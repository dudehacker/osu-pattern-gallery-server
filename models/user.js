const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    osuId: String,
    username: String,
    avatarUrl: String,
    country: String,
    discord: String,
    enabled: Boolean,
    kudosu: Number,
    mapping_follower_count: Number,
    ranked_beatmapset_count: Number,
    previous_usernames: [String],
    friend_ids: [String],
    accessToken: String,
    refreshToken: String,
    createdDate: Date
});

module.exports = mongoose.model("User", UserSchema);