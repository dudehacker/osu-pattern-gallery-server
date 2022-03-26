const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema({
    osuId: String,
    likes: [String],
    dislikes: [String]
});

module.exports = mongoose.model("Bookmark", BookmarkSchema);

