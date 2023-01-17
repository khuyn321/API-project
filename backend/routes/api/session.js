const express = require('express')
// const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Email or username is required"),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage("Password is required"),
  handleValidationErrors
];

// Restore session user
router.get('/', restoreUser, requireAuth,
  (req, res) => {
    const { user } = req;
    if (user) {
      return res.json({
        user: user.toSafeObject()  // <-- (🚧🚧)  //edit: (it works fine)
      });
    } else return res.json({});
  }
);

// Log in
router.post('/', validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.login({ credential, password });

  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    err.title = 'Invalid credentials'
    delete err.stack;
    throw (err);
  }
  /**  ex. response
   {
  "message": "Invalid credentials",
  "statusCode": 401  //todo)  <--- (bonus-ish(?)🚧) Remove "title" and add statusCode somehow to res object
   }
   */

  const token = await setTokenCookie(res, user);

  return res.json({
    user:
    {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username
    }
  });
});

// Log out
router.delete('/', (req, res) => {
  res.clearCookie("token");
  return res.json({ message: 'success' });
}
);

/**

// Error formatter
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});

 */

module.exports = router;