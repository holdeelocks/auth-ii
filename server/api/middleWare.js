const jwt = require("jsonwebtoken");
const { secret } = require("./helpers");

module.exports = function protected(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        res.status(401).send({ error: "You shall not pass! (invalid token)" });
      } else {
        next();
      }
    });
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};
