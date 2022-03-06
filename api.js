const express = require("express");
const logger = require("pino")();
const { addAsync } = require("@awaitjs/express");
const router = addAsync(express.Router());
const beatmapService = require("./service/beatmapService");


/**
 * POST /api/pattern
 * Upload a new pattern
 * param {String} description describe the pattern
 * param {String} osuTimestamps example: "00:37:177 (37177|2,37177|0,37177|1) -"
 * param {String} imageUrl screenshot for the pattern
 * param {String} beatmapUrl example: https://osu.ppy.sh/beatmapsets/1578629#mania/3223324
 */
router.postAsync("/pattern", async (req, res) => {
    const updated = await beatmapService.saveMapToDB(req.body);
    res.send({ pattern: updated });
});

router.all("*", (req, res) => {
    logger.warn(`API route not found: ${req.method} ${req.url}`);
    res.status(404).send({ msg: "API route not found" });
});

module.exports = router;