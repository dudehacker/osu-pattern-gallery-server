const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema({
    osuId: { type: String, index: true },
    likes: [String],
    dislikes: [String]
});

module.exports = mongoose.model("Bookmark", BookmarkSchema);

