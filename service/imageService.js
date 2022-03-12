const logger = require("pino")();
const axios = require("axios");
const { ImgurClient } = require('imgur');

const client = new ImgurClient({ 
    clientId: process.env.IMGUR_CLIENT_ID
});


/**
 * saves osu screenshot to cloud image hosting service for permenant storage
 * osu link expires after 1 month
 * @param {String} osuUrl https://osu.ppy.sh/ss/17631095/1486 
 */
const uploadImageFromOsuUrl = async (osuUrl) => {
    const axioResponse = await axios.get(osuUrl,  { responseType: 'arraybuffer' })
    const buffer = Buffer.from(axioResponse.data, "utf-8")
    const response = await client.upload({
        image: buffer
    });
    // logger.info(response)
    return response;
}

module.exports = { uploadImageFromOsuUrl};