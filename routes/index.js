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
  let key = await OAuthClient.getAccess(req.query.code);
  res.cookie("userKey", key, {
    maxAge: OAuthClient.getAccessObject(key).expireTimestamp - Date.now()
  });

  res.redirect("/home/");
});

/* Route to fetch the user's details */
router.get("/get-user", async (req, res) => {
  try {
    res.send(await OAuthClient.getAuthorizedUser(req.cookies.userKey));
  } catch {
    res.send(undefined);
  }
});

module.exports = router;
