const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, ReviewImage, User, Sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { route } = require('./users');

const { Op } = require("sequelize");

router.use(express.json())

//!              DELETE A REVIEW IMAGE

router.delete('/:imageId', requireAuth, async (req, res, next) => {
  const { user } = req

  const reviewImage = await ReviewImage.findOne({
    where: {
      id: req.params.imageId  //! find revImage from given param
    }
  })

  //! (authorization) ********************/
  // find reviewId from found reviewImage
  // find userId from review
  // if review's userId !== user.id, user isn't authorized to delete review

  if (!reviewImage) {
    const err = new Error('Review Image couldn\'t be found.'); //! <--
    err.status = 404;
    throw (err);
  } else if (!review) {
    const err = new Error('Review couldn\'t be found.'); //! <--
    err.status = 404;
    throw (err);
  };

  const review = await Review.findOne({
    where: {
      id: reviewImage.reviewId  //! find review to compare user's id and currUser's id
    }
  })
  if (review.userId != user.id) {
    const err = new Error("Must be owner to delete Spot Image")  //! <--
    err.status = 403
    throw (err)
  }

  //! ***************************************/

  await reviewImage.destroy();

  res.json({
    message: "Successfully deleted",
    statusCode: 200
  });
});

module.exports = router;