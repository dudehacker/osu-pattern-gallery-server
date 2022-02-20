const osu = require("node-osu");
const osuApi = new osu.Api(process.env.OSU_API_KEY);
const BeatmapStatus = require("../constants/BeatmapStatus")


const getMapData = async (beatmapId) => {
    try {
        beatmap = await osuApi.getBeatmaps({ b: beatmapId });
        return beatmap
    } catch (err){
        console.error(`beatmap with id=${beatmapId} is not found!`)
        console.error(err);
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
        console.error(`mapUrl is not string: ${JSON.stringify(mapUrl)}` )
        return null;
    }
    
    const parts = mapUrl.split("#mania/");
    if (parts.length === 2){
        return parts[1]
    }

    console.error(`mapUrl is invalid: ${mapUrl}, it must be of format: https://osu.ppy.sh/beatmapsets/1578629#mania/3223324` )
    return null
}

const isValidMap = (mapData) =>{
    if (!mapData || !mapData.approvalStatus) return false;
    return [BeatmapStatus.RANKED, BeatmapStatus.LOVED].includes(mapData.approvalStatus)
}

const RankedStatus = BeatmapStatus

module.exports = { getMapData, isValidMap, getMapIdFromLink, RankedStatus };
