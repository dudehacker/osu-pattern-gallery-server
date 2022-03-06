const osu = require("node-osu");
const osuApi = new osu.Api(process.env.OSU_API_KEY);
const BeatmapStatus = require("../constants/BeatmapStatus");
const Pattern = require("../models/pattern");
const Beatmap = require("../models/beatmap");
const logger = require("pino")();
const express = require("express");
const { addAsync } = require("@awaitjs/express");
const router = addAsync(express.Router());

const getMapData = async (beatmapId) => {
    try {
        map = {...await osuApi.getBeatmaps({ b: beatmapId })}[0]
        return map
    } catch (err){
        logger.error(`beatmap with id=${beatmapId} is not found!`)
        logger.error(err);
        return null
    }
};

/**
 * 
 * @param {String} mapUrl example: https://osu.ppy.sh/beatmapsets/1578629#mania/3223324
 * @returns {String} the beatmapId, example: 3223324
 */
const getMapIdFromLink = (mapUrl) => {
    if (typeof mapUrl !== 'string' || !mapUrl instanceof String){
        logger.error(`mapUrl is not string: ${JSON.stringify(mapUrl)}` )
        return null;
    }
    
    const parts = mapUrl.split("#mania/");
    if (parts.length === 2){
        return parts[1]
    }

    logger.error(`mapUrl is invalid: ${mapUrl}, it must be of format: https://osu.ppy.sh/beatmapsets/1578629#mania/3223324` )
    return null
}

const isValidMap = (mapData) =>{
    if (!mapData || !mapData.approvalStatus) {
        logger.error("something wrong with beatmap data")
        return false;
    }
    if (mapData.mode != "Mania"){
        logger.error("map is not mania!")
        return false;
    }
    const validStatus = [BeatmapStatus.RANKED, BeatmapStatus.LOVED].includes(mapData.approvalStatus)
    if (!validStatus){
        logger.error("map must be ranked or loved!")
        return false;
    }
    return true;
}

const RankedStatus = BeatmapStatus

module.exports = { getMapData, isValidMap, getMapIdFromLink, RankedStatus };


