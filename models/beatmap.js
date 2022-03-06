const mongoose = require("mongoose");

const BeatmapSchema = new mongoose.Schema({
    id: String,
    beatmapSetId: String,
    hash: String,
    title: String,
    creator: String,
    version: String,
    source: String,
    artist: String,
    genre: String,
    language: String,
    rating: Number,
    bpm: Number,
    mode: String,
    tags: [String],
    approvalStatus: String,
    raw_submitDate: Date,
    raw_approvedDate: Date,
    raw_lastUpdate: Date,
    maxCombo: Number,
    objects: {
        normal: Number, 
        slider: Number, 
        spinner: Number
    },
    difficulty: {
        rating: Number,
        aim: Number,
        speed: Number,
        size: Number,
        overall: Number,
        approach: Number,
        drain: Number
    },
    length: {
        total: Number,
        drain: Number
    },
    counts:{
        favorites: Number,
        favourites: Number,
        plays: Number,
        passes: Number
    },
    hasDownload: Boolean,
    hasAudio: Boolean
});

module.exports = mongoose.model("Beatmap", BeatmapSchema);