// Ensure a user has a certain permission before allowing access
const logger = require("pino")();

function loggedIn(req, res, next) {
  if (!req.user || !req.user.username) {
    return res.status(401).send({ error: "Not logged in, refusing access." });
  }

  next();
}

function notLoggedIn(req, res, next){
    if (req.user && req.user.username) {
        return res.status(401).send({ error: "Already logged in." });
    }
    next();
}

module.exports = {
  loggedIn, notLoggedIn
};