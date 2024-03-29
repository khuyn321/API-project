const jwt = require('jsonwebtoken')
const { jwtConfig } = require('../config')
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
  // Create the token.
  const token = jwt.sign(
    { data: user.toSafeObject() },
    secret,
    { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie('token', token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax"
  });

  return token;
};

// middleware function that will verify and parse the JWT's payload and search
// the database for a User with the id in the payload
const restoreUser = (req, res, next) => {
  // token parsed from cookies
  const { token } = req.cookies;
  req.user = null;

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.findByPk(id);
    } catch (e) {
      res.clearCookie('token');
      return next();
    }

    if (!req.user) res.clearCookie('token');

    return next();
  });
};

// middleware requiring a session user to be authenticated before accessing a route
// (If there is no current user, return an error)
const requireAuth = function (req, res, next) {
  if (req.user) return next();

  return res.json({
    "user": null
  })
}

module.exports = { setTokenCookie, restoreUser, requireAuth };