// backend/routes/index.js
const express = require('express');
const router = express.Router();

// ...
const apiRouter = require('./api');

router.use('/api', apiRouter);

router.get('/hello/world', function (req, res) {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.send('Hello World!');
});


// Add a XSRF-TOKEN cookie
/*
In this route, you are setting a cookie on the response with the name of XSRF-TOKEN
to the value of the req.csrfToken method's return. Then, send the token as the
response for easy retrieval.
*/
router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});
// ...

module.exports = router;