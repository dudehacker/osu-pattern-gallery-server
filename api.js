const express = require("express");
const logger = require("pino")();
const { addAsync } = require("@awaitjs/express");
const router = addAsync(express.Router());
const beatmapService = require("./service/beatmapService");
const imageService = require("./service/imageService");
const Pattern = require("./models/pattern");
const Beatmap = require("./models/beatmap");
const User = require("./models/user");
const ensure = require("./ensure");
const Bookmark = require("./models/bookmark");

/**
 * POST /api/pattern
 * Upload a new pattern
 * param {String} description describe the pattern
 * param {String} osuTimestamps example: "00:37:177 (37177|2,37177|0,37177|1) -"
 * param {String} imageUrl screenshot for the pattern
 * param {String} beatmapUrl example: https://osu.ppy.sh/beatmapsets/1578629#mania/3223324
 */
router.postAsync("/pattern", ensure.loggedIn, async (req, res) => {
  const uploadRequest = req.body;
  logger.info(uploadRequest);
  if (!beatmapService.isValidOsuTimestamp(uploadRequest.osuTimestamps)) {
    const errMsg = `invalid osu timestamps: ${uploadRequest.osuTimestamps}`;
    logger.error(errMsg);
    return res.status(400).send(errMsg);
  }

  const mapId = beatmapService.getMapIdFromLink(uploadRequest.beatmapUrl);
  if (mapId == null) {
    return res.status(400).send("can't parse beatmap Id from beatmap URL");
  }

  let errorMsg = `invalid screenshot image: ${uploadRequest.imageUrl}`;
  try {
    imageResponse = await imageService.uploadImageFromOsuUrl(
      uploadRequest.imageUrl
    );
    if (!imageResponse.success) {
      logger.error(errorMsg);
      return res.status(400).send(errorMsg);
    }
  } catch (err) {
    logger.error(errorMsg);
    return res.status(400).send(errorMsg);
  }

  let savedMap = await Beatmap.findOne({ id: mapId });

  if (!savedMap) {
    logger.info(`looking up new map: ${mapId}`);
    let newMap = await beatmapService.getMapData(mapId);
    let errorMsg = beatmapService.isValidMap(newMap);
    if (errorMsg) {
      logger.error(newMap);
      return res.status(400).send(errorMsg);
    }
    savedMap = await new Beatmap(newMap).save();
  } else {
    logger.info(`found map ${mapId}`);
  }

  const now = new Date();

  const user = await User.findOne({ osuId: req.user.osuId });
  const pattern = new Pattern({
    ...uploadRequest,
    beatmap: savedMap,
    imageUrl: imageResponse.data.link,
    imageDeleteHash: imageResponse.data.deletehash,
    p_uploadDate: now,
    p_uploadBy: user,
  });
  const updated = await pattern.save();
  logger.info(
    `user has succesfully uploaded pattern for ${pattern.beatmap.artist} - ${pattern.beatmap.title}`
  );
  res.send({ pattern: updated });
});

/**
 * get a single pattern
 */
router.getAsync("/pattern/:id", async (req, res) => {
  const patternId = req.params.id;
  let pattern = await Pattern.findOne({ _id: patternId })
    .populate("beatmap p_uploadBy")
    .exec();
  let osuId = req.user ? req.user.osuId : null;

  if (pattern._doc.p_uploadBy) {
    pattern._doc.p_uploadBy = {
      username: pattern._doc.p_uploadBy.username,
      id: pattern._doc.p_uploadBy.osuId,
    };
  }
  if (osuId) {
    let liked = pattern._doc.likedBy.includes(osuId);
    let disliked = pattern._doc.dislikedBy.includes(osuId);
    pattern._doc.liked = liked;
    pattern._doc.disliked = disliked;
  }

  res.send(pattern);
});

// todo add raw_approvedDate filter
const beatmapQueryFields = ["genre", "language", "keys", "rating", "bpm", "sr"];

const createMinValueFilter = (value, field) => {
  return {
    range: {
      gte: value,
      path: field,
    },
  };
};

const createSingleNumberFilter = (value, field) => {
  return {
    range: {
      gte: value,
      lte: value,
      path: field,
    },
  };
};

const createRangeFilter = (value, field) => {
  return {
    range: {
      gte: value[0],
      lte: value[1],
      path: field,
    },
  };
};

const createTextFilter = (value, field) => {
  return {
    text: {
      query: value,
      path: field,
    },
  };
};

const searchTextFields = [
  "creator",
  "artist",
  "title",
  "tags",
  "version",
  "source",
];

const createSearchQuery = (searchQuery) => {
  let shouldConditions = [];
  searchTextFields.forEach((field) => {
    shouldConditions.push({
      text: {
        query: searchQuery,
        path: field,
        fuzzy: {
          maxEdits: 1,
        },
      },
    });
  });
  return shouldConditions;
};

/**
 * get all patterns with atlas search and pagination
 */
router.postAsync("/pattern/search", async (req, res) => {
  console.log(req.body);
  console.log(req.query);
  const { text } = req.query;
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  var searchAgg = {
    $search: {
      index: "beatmapMetaIndex",
      compound: {
        filter: [],
      },
    },
  };

  if (text) {
    searchAgg.$search.compound.should = createSearchQuery(text);
    searchAgg.$search.compound.minimumShouldMatch = 1;
  }

  beatmapQueryFields.forEach(function (field, index) {
    let value = req.body[field];
    if (
      (Array.isArray(value) && value.length > 0) ||
      typeof value == "number"
    ) {
      switch (field) {
        case "language":
        case "genre":
          if (value.length > 0)
            searchAgg.$search.compound.filter.push(
              createTextFilter(value, field)
            );
          break;
        case "keys":
          searchAgg.$search.compound.filter.push(
            createSingleNumberFilter(value, "difficulty.size")
          );
          break;
        case "rating":
          searchAgg.$search.compound.filter.push(
            createMinValueFilter(value, field)
          );
          break;
        case "bpm":
          if (value.length == 2)
            searchAgg.$search.compound.filter.push(
              createRangeFilter(value, field)
            );
          break;
        case "sr":
          if (value.length == 2)
            searchAgg.$search.compound.filter.push(
              createRangeFilter(value, "difficulty.rating")
            );
          break;

        // default:
        //     beatmapQuery[field] =  {$regex : req.query[field]}
      }
    }
  });

  const projectAgg = {
    $project: {
      _id: 1,
      score: { $meta: "searchScore" },
    },
  };

  const sortAgg = { $sort: { score: -1 } };

  // logger.info(searchAgg);

  const maps = await Beatmap.aggregate([
    searchAgg,
    projectAgg,
    sortAgg,
    { $project: { _id: -1 } },
  ]);

  const patterns = await Pattern.find({beatmap : {
    $in: maps,
  }}, "imageUrl _id", {
    skip: (page-1) * limit,
    limit: limit,
  }).sort({ p_uploadDate: -1 });
  res.send(patterns);
});

/**
 * Get all the patterns
 */
// router.postAsync("/pattern/search", async (req, res) => {
//   console.log(req.body);
//   console.log(req.query);
//   const { page, limit, text } = req.query;
//   var beatmapQuery = {};
//   beatmapQueryFields.forEach(function (field, index) {
//     let value = req.body[field];
//     if (
//       (Array.isArray(value) && value.length > 0) ||
//       typeof value == "number"
//     ) {
//       switch (field) {
//         case "language":
//         case "genre":
//           beatmapQuery[field] = { $in: value };
//           break;
//         case "keys":
//           beatmapQuery["difficulty.size"] = value;
//           break;
//         case "rating":
//           beatmapQuery[field] = { $gte: value };
//           break;
//         case "bpm":
//           if (value.length == 2)
//             beatmapQuery[field] = { $gte: value[0], $lte: value[1] };
//           break;
//         case "sr":
//           if (value.length == 2)
//             beatmapQuery["difficulty.rating"] = {
//               $gte: value[0],
//               $lte: value[1],
//             };
//           break;

//         // default:
//         //     beatmapQuery[field] =  {$regex : req.query[field]}
//       }
//     }
//   });
//   console.log(beatmapQuery);
//   const beatmapIds = await Beatmap.find(beatmapQuery, "_id");
//   var patternQuery = {};
//   if (Object.keys(beatmapQuery).length > 0) {
//     patternQuery.beatmap = {
//       $in: beatmapIds,
//     };
//   }
//   const patterns = await Pattern.find(patternQuery, "imageUrl _id", {
//     skip: page * limit,
//     limit: limit,
//   });
//   res.send(patterns);
// });

router.postAsync("/pattern/:id/dislike", ensure.loggedIn, async (req, res) => {
  const patternId = req.params.id;
  const osuId = req.user.osuId;
  let pattern = await Pattern.findOne({ _id: patternId });
  if (!pattern) {
    let errMsg = `pattern ${patternId} to dislike doesn't exist`;
    logger.error(errMsg);
    res.status(400);
    return res.send(errMsg);
  }
  if (!pattern.dislikedBy.includes(osuId)) {
    pattern.dislikedBy.push(osuId);
    if (pattern.likedBy.includes(osuId)) {
      pattern.likedBy = pattern.likedBy.filter((x) => x != osuId);
    }
  } else {
    pattern.dislikedBy = pattern.dislikedBy.filter((x) => x != osuId);
  }
  await pattern.save();

  let bookmark = await Bookmark.findOne({ osuId: req.user.osuId });
  if (!bookmark) {
    bookmark = new Bookmark({
      osuId: req.user.osuId,
      likes: [],
      dislikes: [],
    });
  }
  if (!bookmark.dislikes.includes(patternId)) {
    bookmark.dislikes.push(patternId);
    bookmark.likes = bookmark.likes.filter((x) => x != patternId);
    const saved = await bookmark.save();
    logger.info(
      `new pattern ${patternId} added to dislikes for user ${req.user.username}`
    );
    return res.send(saved);
  }
  bookmark.dislikes = bookmark.dislikes.filter((x) => x != patternId);
  let msg = `pattern ${patternId} is removed from disliked for user ${req.user.username}`;
  logger.info(msg);
  const saved = await bookmark.save();
  return res.send(saved);
});

/**
 * user like or remove like on a pattern
 */
router.postAsync("/pattern/:id/like", ensure.loggedIn, async (req, res) => {
  const patternId = req.params.id;
  const osuId = req.user.osuId;
  let pattern = await Pattern.findOne({ _id: patternId });
  if (!pattern) {
    let errMsg = `pattern ${patternId} to like doesn't exist`;
    logger.error(errMsg);
    res.status(400);
    return res.send(errMsg);
  }
  if (!pattern.likedBy.includes(osuId)) {
    pattern.likedBy.push(osuId);
    if (pattern.dislikedBy.includes(osuId)) {
      pattern.dislikedBy = pattern.dislikedBy.filter((x) => x != osuId);
    }
  } else {
    pattern.likedBy = pattern.likedBy.filter((x) => x != osuId);
  }
  await pattern.save();

  let bookmark = await Bookmark.findOne({ osuId: req.user.osuId });
  if (!bookmark) {
    bookmark = new Bookmark({
      osuId: req.user.osuId,
      likes: [],
      dislikes: [],
    });
  }
  if (!bookmark.likes.includes(patternId)) {
    bookmark.likes.push(patternId);
    bookmark.dislikes = bookmark.dislikes.filter((x) => x != patternId);
    const saved = await bookmark.save();
    logger.info(
      `new pattern ${patternId} added to likes for user ${req.user.username}`
    );
    return res.send(saved);
  }
  bookmark.likes = bookmark.likes.filter((x) => x != patternId);
  let msg = `pattern ${patternId} is removed from liked for user ${req.user.username}`;
  logger.info(msg);
  const saved = await bookmark.save();
  return res.send(saved);
});

router.get("/user", (req, res) => {
  logger.info(Object.keys(req));
  logger.info(req.session);
  res.send(req.user);
});

router.all("*", (req, res) => {
  logger.warn(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
