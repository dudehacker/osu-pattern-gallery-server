const mongoose = require("mongoose");

const PatternSchema = new mongoose.Schema({
    osuTimestamps: String,
    imageUrl: String,
    beatmapUrl: String,
    description: String,
    beatmap: {type: mongoose.Schema.Types.ObjectId, ref: 'Beatmap'},
    p_uploadDate: Date
    // p_uploadBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model("Pattern", PatternSchema);

