const express = require("express");
const logger = require("pino")();
const { addAsync } = require("@awaitjs/express");
const router = addAsync(express.Router());
const beatmapService = require("./service/beatmapService");
const imageService = require("./service/imageService");
const Pattern = require("./models/pattern")
const Beatmap = require("./models/beatmap")
const User = require("./models/user")
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
    logger.info(uploadRequest)
    if (!beatmapService.isValidOsuTimestamp(uploadRequest.osuTimestamps)){
        const errMsg = `invalid osu timestamps: ${uploadRequest.osuTimestamps}`
        logger.error(errMsg)
        return res.status(400).send(errMsg);
    }

    const mapId = beatmapService.getMapIdFromLink(uploadRequest.beatmapUrl)
    if (mapId == null){
        return res.status(400).send("can't parse beatmap Id from beatmap URL");
    }
    map = await beatmapService.getMapData(mapId);

    if (!beatmapService.isValidMap(map)){
        logger.error(map);
        return res.status(400).send("invalid map for upload");
    }

    let errorMsg = `invalid screenshot image: ${uploadRequest.imageUrl}`
    try {
        imageResponse = await imageService.uploadImageFromOsuUrl(uploadRequest.imageUrl)
        if (!imageResponse.success){
            logger.error(errorMsg)
            return res.status(400).send(errorMsg);
        }
    } catch (err) {
        logger.error(errorMsg)
        return res.status(400).send(errorMsg);
    }
   

    const now = new Date();

    const savedMap = await new Beatmap(map).save();
    const user = await User.findOne({ osuId: req.user.osuId });
    const pattern = new Pattern({
        ...uploadRequest,
        beatmap: savedMap,
        imageUrl: imageResponse.data.link,
        imageDeleteHash: imageResponse.data.deletehash,
        p_uploadDate: now,
        p_uploadBy: user
    });
    const updated = await pattern.save();
    logger.info(`user has succesfully uploaded pattern for ${pattern.beatmap.artist} - ${pattern.beatmap.title}`);
    res.send({ pattern: updated });
});

/**
 * Get all the patterns
 */
router.getAsync("/pattern", async (req, res) => {
    let patterns = await Pattern.find().populate('beatmap p_uploadBy').exec();
    let osuId = req.user ? req.user.osuId : null;
    let bookmark = await Bookmark.findOne({osuId: osuId});
    const newData = patterns.map( (x) => {
        if (x._doc.p_uploadBy){
            x._doc.p_uploadBy = {
                username: x._doc.p_uploadBy.username,
                id:  x._doc.p_uploadBy.osuId
            }
        }
        if (osuId && bookmark){
            let liked = bookmark.likes.includes(x._doc._id) 
            let disliked = bookmark.dislikes.includes(x._doc._id) 
            x._doc.liked = liked
            x._doc.disliked = disliked
        }
        return x
    })
    res.send(newData)
});

router.postAsync("/pattern/:id/dislike", ensure.loggedIn, async (req, res) => {
    const patternId = req.params.id
    const osuId = req.user.osuId;
    let pattern = await Pattern.findOne({_id: patternId})
    if (!pattern){
        let errMsg = `pattern ${patternId} to dislike doesn't exist`
        logger.error(errMsg)
        res.status(400)
        return res.send(errMsg);
    }
    if (!pattern.dislikedBy.includes(osuId)){
        pattern.dislikedBy.push(osuId)
        if (pattern.likedBy.includes(osuId)){
            pattern.likedBy = pattern.likedBy.filter(x => x != osuId)
        }
    } else {
        pattern.dislikedBy = pattern.dislikedBy.filter( x => x != osuId)
    }
    await pattern.save();
    
    let bookmark = await Bookmark.findOne({osuId: req.user.osuId})
    if (!bookmark){
        bookmark= new Bookmark({
            osuId: req.user.osuId,
            likes: [],
            dislikes: []
        })
    }
    if (!bookmark.dislikes.includes(patternId)){
        bookmark.dislikes.push(patternId)
        bookmark.likes = bookmark.likes.filter( x => x != patternId)
        const saved = await bookmark.save();
        logger.info(`new pattern ${patternId} added to dislikes for user ${req.user.username}`)
        return res.send(saved)
    } 
    bookmark.dislikes = bookmark.dislikes.filter( x => x != patternId)
    let msg = `pattern ${patternId} is removed from disliked for user ${req.user.username}`
    logger.info(msg)
    const saved = await bookmark.save();
    return res.send(saved);
})

/**
 * user like or remove like on a pattern 
 */
router.postAsync("/pattern/:id/like", ensure.loggedIn, async (req, res) => {
    const patternId = req.params.id;
    const osuId = req.user.osuId;
    let pattern = await Pattern.findOne({_id: patternId})
    if (!pattern){
        let errMsg = `pattern ${patternId} to like doesn't exist`
        logger.error(errMsg)
        res.status(400)
        return res.send(errMsg);
    }
    if (!pattern.likedBy.includes(osuId)){
        pattern.likedBy.push(osuId)
        if (pattern.dislikedBy.includes(osuId)){
            pattern.dislikedBy = pattern.dislikedBy.filter(x => x != osuId)
        }
    } else {
        pattern.likedBy = pattern.likedBy.filter( x => x != osuId)
    }
    await pattern.save();

    let bookmark = await Bookmark.findOne({osuId: req.user.osuId})
    if (!bookmark){
        bookmark= new Bookmark({
            osuId: req.user.osuId,
            likes: [],
            dislikes: []
        })
    }
    if (!bookmark.likes.includes(patternId)){
        bookmark.likes.push(patternId)
        bookmark.dislikes = bookmark.dislikes.filter( x => x != patternId)
        const saved = await bookmark.save();
        logger.info(`new pattern ${patternId} added to likes for user ${req.user.username}`)
        return res.send(saved)
    } 
    bookmark.likes = bookmark.likes.filter( x => x != patternId)
    let msg = `pattern ${patternId} is removed from liked for user ${req.user.username}`
    logger.info(msg)
    const saved = await bookmark.save();
    return res.send(saved);
})


router.get("/user", (req, res) => {
    logger.info(Object.keys(req))
    logger.info(req.session)
    res.send(req.user)
});

router.all("*", (req, res) => {
    logger.warn(`API route not found: ${req.method} ${req.url}`);
    res.status(404).send({ msg: "API route not found" });
});

module.exports = router;