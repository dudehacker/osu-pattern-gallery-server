const mongoose = require("mongoose");

const BeatmapSchema = new mongoose.Schema({
    id: { type: [String], index: true },
    beatmapSetId: { type: [String], index: true },
    hash: { type: [String], index: true },
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

BeatmapSchema.index({ title: 1, artist:1, creator: 1 , bpm: 1, genre:1, language:1, source:1, tags:1,
    "difficulty.rating": 1, "counts.favourites": 1, "counts.plays": 1,
    "objects.slider" : 1, "objects.normal": 1
}); // sch

module.exports = mongoose.model("Beatmap", BeatmapSchema);