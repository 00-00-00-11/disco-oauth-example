var express = require("express");
var router = express.Router();

const { discordId, discordSecret } = require("../config");

const OAuth = require("disco-oauth");
const OAuthClient = new OAuth(discordId, discordSecret);

OAuthClient.setScopes(["identify", "guilds"]);
OAuthClient.setRedirect("http://localhost:3000/login");

/**
 * Route redirects to the authcode link if the user is not already logged in.
 * If logged in, directly forwards to the logged in portal.
 */
router.get("/auth/discord", (req, res) => {
  req.cookies.userKey
    ? res.redirect("/home")
    : res.redirect(OAuthClient.getAuthCodeLink());
});

/* Route to handle incoming login requests */
router.get("/login", async (req, res) => {
  try {
    let key = await OAuthClient.getAccess(req.query.code);
    let expires = await OAuthClient.getAccessToken(key);
    res.cookie("userKey", key, {
      maxAge: expires["expires_in"] * 900
    });
    res.redirect("/home/");
  } catch (e) {
    console.log(e);
    res.end();
  }
});

/* Route to fetch the user's details */
router.get("/get-user", async (req, res) => {
  try {
    res.send(await OAuthClient.getAuthorizedUser(req.cookies.userKey));
  } catch (e) {
    if (e.code)
      if (e.code == "444") {
        let key = await OAuthClient.refreshAccess(req.cookies.userKey);
        let expires = await OAuthClient.getAccessToken(key);
        res.clearCookie("userKey");
        res.cookie("userKey", key, {
          maxAge: expires["expires_in"] * 900
        });
        res.redirect("/get-user/");
      } else res.send(e);
  }
});

/* Route to fetch all the guilds */
router.get("/get-guilds", async (req, res) => {
  try {
    res.send(await OAuthClient.getAuthorizedUserGuilds(req.cookies.userKey));
  } catch (e) {
    if (e.code)
      if (e.code == "444") {
        let key = await OAuthClient.refreshAccess(req.cookies.userKey);
        let expires = await OAuthClient.getAccessToken(key);
        res.clearCookie("userKey");
        res.cookie("userKey", key, {
          maxAge: expires["expires_in"] * 900
        });
        res.redirect("/get-guilds/");
      } else res.send(e);
  }
});

module.exports = router;
