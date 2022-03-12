const express = require("express");
const logger = require("pino")();
const { addAsync } = require("@awaitjs/express");
const router = addAsync(express.Router());
const beatmapService = require("./service/beatmapService");
const imageService = require("./service/imageService");
const Pattern = require("./models/pattern")
const Beatmap = require("./models/beatmap")


/**
 * POST /api/pattern
 * Upload a new pattern
 * param {String} description describe the pattern
 * param {String} osuTimestamps example: "00:37:177 (37177|2,37177|0,37177|1) -"
 * param {String} imageUrl screenshot for the pattern
 * param {String} beatmapUrl example: https://osu.ppy.sh/beatmapsets/1578629#mania/3223324
 */
router.postAsync("/pattern", async (req, res) => {
    const uploadRequest = req.body;
    const mapId = beatmapService.getMapIdFromLink(uploadRequest.beatmapUrl)
    if (mapId == null){
        return res.status(400).send("can't parse beatmap Id from beatmap URL");
    }
    map = await beatmapService.getMapData(mapId);

    if (!beatmapService.isValidMap(map)){
        logger.error(map);
        return res.status(400).send("invalid map for upload");
    }


    imageResponse = await imageService.uploadImageFromOsuUrl(uploadRequest.imageUrl)
    if (!imageResponse.success){
        logger.error(`invalid screenshot image: ${uploadRequest.imageUrl}`)
        return res.status(400).send("invalid screenshot image");
    }

    const now = new Date();

    const savedMap = await new Beatmap(map).save();
    const pattern = new Pattern({
        ...uploadRequest,
        beatmap: savedMap,
        imageUrl: imageResponse.data.link,
        imageDeleteHash: imageResponse.data.deletehash,
        p_uploadDate: now
    });
    const updated = await pattern.save();
    logger.info(`user has succesfully uploaded pattern for ${pattern.beatmap.artist} - ${pattern.beatmap.title}`);
    res.send({ pattern: updated });
});

router.all("*", (req, res) => {
    logger.warn(`API route not found: ${req.method} ${req.url}`);
    res.status(404).send({ msg: "API route not found" });
});

module.exports = router;