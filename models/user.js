const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    id: String,
    username: String,
    avatarUrl: String,
    enabled: Boolean,
    createdDate: Date
});

module.exports = mongoose.model("User", UserSchema);