const express = require("express");
const passport = require("passport");
const logger = require("pino")();
const axios = require("axios");
const fs = require("fs");
const OAuth2Strategy = require("passport-oauth2").Strategy;

const router = express.Router();
const User = require("./models/user");
const { loggedIn, notLoggedIn } = require("./ensure");

const reactHost = process.env.FRONT_END || "http://localhost:4000"

const updateUser = (user,me) => {
  user.username = me.username
  user.previous_usernames = me.previous_usernames
  user.country = me.country_code
  user.avatarUrl = me.avatar_url,
  user.discord = me.discord || ""
  user.kudosu = me.kudosu.total
  user.mapping_follower_count = me.mapping_follower_count
  user.ranked_beatmapset_count = me.ranked_and_approved_beatmapset_count
  logger.info(`updated user ${ user.username}`)
}

const updateFriends = (user,friends) => {
  user.friend_ids = friends.map(user => user.id)
  logger.info(`updated friends for user ${ user.username}`)
}

const apiV2 = "https://osu.ppy.sh/api/v2"

passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: "https://osu.ppy.sh/oauth/authorize",
      tokenURL: "https://osu.ppy.sh/oauth/token",
      clientID: process.env.OSU_CLIENT_ID,
      clientSecret: process.env.OSU_CLIENT_SECRET,
      callbackURL: process.env.API_HOST+"/auth/osu/callback",
      scope: ["friends.read","identify","public"]
    },
    async (accessToken, refreshToken, profile, done) => {
      logger.info(profile)
      const me = await axios
        .get(apiV2+"/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res) => {
          return res.data;
        });
      // fs.writeFileSync("me.json", JSON.stringify(me));
      let user = await User.findOne({ osuId: me.id });
      if (!user) {
        user = new User({
          osuId: me.id,
          enabled: true,
          createdDate: new Date()
        });
      } 
      updateUser(user,me)
      user.accessToken = accessToken
      user.refreshToken = refreshToken
      const friends = await axios.get(apiV2+"/friends", {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then((res)=>{
        return res.data;
      });
      // fs.writeFileSync("friends.json", JSON.stringify(friends));
      updateFriends(user,friends)
      await user.save();
      done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

router.get("/login", notLoggedIn, passport.authenticate("oauth2"));

router.get("/logout", loggedIn, (req, res) => {
  logger.info(`User ${req.user.username} logged out`)
  req.logout();
  req.session.destroy();
  res.redirect(reactHost);
});

const cookieOpts = { sameSite: "none", secure: true}

router.get(
  "/osu/callback",
  passport.authenticate("oauth2", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication!
    logger.info("Successful authentication!");
    
    res.cookie("username",req.user.username, cookieOpts)
    res.cookie("avatar",req.user.avatarUrl, cookieOpts)
    res.redirect(`${reactHost}`)
  }
);

module.exports = router;
