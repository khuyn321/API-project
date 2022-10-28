const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Review, ReviewImage, User, Spot, SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// ...
// const validateSignup = [
//   check('email')
//     .exists({ checkFalsy: true })
//     .isEmail()
//     .withMessage('Please provide a valid email.'),
//   check('username')
//     .exists({ checkFalsy: true })
//     .isLength({ min: 4 })
//     .withMessage('Please provide a username with at least 4 characters.'),
//   check('username')
//     .not()
//     .isEmail()
//     .withMessage('Username cannot be an email.'),
//   check('password')
//     .exists({ checkFalsy: true })
//     .isLength({ min: 6 })
//     .withMessage('Password must be 6 characters or more.'),
//   handleValidationErrors
// ];

//!              GET SPOTS OF CURRENT USER

router.get('/current', async (req, res) => {
  const { user } = req
  const allReviews = await Review.findAll({
    where: {
      userId: user.id
    }
  })

  const Reviews = [];
  for (let i = 0; i < allReviews.length; i++) { //for each review of the current user
    const review = allReviews[i]

    const reviewUser = await User.findOne({
      where: { id: user.id },
      attributes: ['id', 'firstName', 'lastName']
    })

    const spot = await Spot.findOne({
      where: { id: review.spotId },
    })

    let spotImage = await SpotImage.findOne({      //finds the first image that has a truthy preview
      where: { preview: true, spotId: spot.id }
    })

    spotImage ? spotImage = spotImage.url : null
    // const previewImage = spotImage

    let reviewImages = await ReviewImage.findAll({      //finds the first image that has a truthy preview
      where: { reviewId: review.id },
      attributes: ['id', 'url']
    })

    // setting spotData to be used by reviewData
    const spotData = {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      price: spot.price,
      previewImage: spotImage
    }

    const reviewData = {
      id: review.id,
      userId: review.userId,
      spotId: review.spotId,
      review: review.review,
      stars: review.stars,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      User: reviewUser,
      Spot: spotData,  //   <--  defined from data obj above
      ReviewImages: reviewImages
    }
    Reviews.push(reviewData)
  }
  res.json({
    Reviews
  })
})

module.exports = router;