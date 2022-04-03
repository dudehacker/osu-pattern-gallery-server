const osu = require("node-osu");
const osuApi = new osu.Api(process.env.OSU_API_KEY);
const BeatmapStatus = require("../constants/BeatmapStatus");
const logger = require("pino")();

const regex = /^\d{2}:\d{2}:\d{3} \(\d+\|\d(,\d+\|\d)*\) -$/

/**
 * make sure osu timestamp is correct format
 * @param {String} osuTimestamp 00:37:177 (37177|2,37177|0,37177|1,37270|6) -
 */
const isValidOsuTimestamp = (osuTimestamp) => {
    return regex.test(osuTimestamp.trim())
}

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
        return "something wrong with beatmap data"
    }
    if (mapData.mode != "Mania"){
        return "map is not mania!"

    }
    const validStatus = [BeatmapStatus.RANKED, BeatmapStatus.LOVED].includes(mapData.approvalStatus)
    if (!validStatus){
        return "map must be ranked or loved!"
    }
    return null;
}

const RankedStatus = BeatmapStatus

module.exports = { getMapData, isValidMap, getMapIdFromLink, isValidOsuTimestamp, RankedStatus };


