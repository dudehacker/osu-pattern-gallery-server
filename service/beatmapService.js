const osu = require("node-osu");
const osuApi = new osu.Api(process.env.OSU_API_KEY);
const BeatmapStatus = require("../constants/BeatmapStatus");
const Pattern = require("../models/pattern");
const Beatmap = require("../models/beatmap");
const logger = require("pino")();

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
    if (!mapData || !mapData.approvalStatus) return false;
    return [BeatmapStatus.RANKED, BeatmapStatus.LOVED].includes(mapData.approvalStatus)
}

const  saveMapToDB = async (uploadRequest) => {
    try {
        const mapId = getMapIdFromLink(uploadRequest.beatmapUrl)
        map = await getMapData(mapId);
    } catch (e) {
        logger.error(`Error getting map data from Url`);
        // return res.send({ mapset: {}, errors: ["Invalid beatmap ID"] });
    }

    if (!isValidMap(map)){
        logger.error("Map is not valid");
        logger.error(map)

    }

    const now = new Date();

    const savedMap = await new Beatmap(map).save();
    const pattern = new Pattern({
        ...uploadRequest,
        beatmap: savedMap,
        p_uploadDate: now
    });
    const updated = await pattern.save();
    logger.info(updated)
    logger.info(`user has succesfully uploaded pattern for ${pattern.beatmap.artist} - ${pattern.beatmap.title}`);
    return updated;
}

const RankedStatus = BeatmapStatus

module.exports = { getMapData, isValidMap, getMapIdFromLink, saveMapToDB, RankedStatus };


