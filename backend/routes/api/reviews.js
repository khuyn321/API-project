const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Review, ReviewImage, User, Spot, SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateNewReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .withMessage('Star rating is required'),
  check('stars')
    .isNumeric({ checkFalsy: true })
    .withMessage('Star rating must be a number'),
  check('stars')
    .isLength({ min: 1 })
    .withMessage('Stars must be an integer from 1 to 5'),
  check('stars')
    .isLength({ max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
]

//!              GET REVIEWS OF CURRENT USER

router.get('/current', async (req, res) => {
  const { user } = req
  const allReviews = await Review.findAll({
    where: {
      userId: user.id
    }
  })

  const Reviews = [];
  for (let i = 0; i < allReviews.length; i++) {
    const review = allReviews[i]

    const reviewUser = await User.findOne({
      where: { id: user.id },
      attributes: ['id', 'firstName', 'lastName']
    })

    const spot = await Spot.findOne({
      where: { id: review.spotId },
    })

    let spotImage = await SpotImage.findOne({
      where: { preview: true, spotId: spot.id }
    })

    if (spotImage) {
      spotImage = spotImage.url
    } else {
      spotImage = null
    }
    // const previewImage = spotImage

    let reviewImages = await ReviewImage.findAll({
      where: { reviewId: review.id },
      attributes: ['id', 'url']
    })

    const spotInfo = {
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
      Spot: spotInfo,  //   <--  defined from data obj above
      ReviewImages: reviewImages
    }
    Reviews.push(reviewData)
  }
  res.json({
    Reviews
  })
})

//!             ADD IMG TO REVIEW BASED ON REVIEW ID

router.post('/:reviewId/images', async (req, res, next) => {
  const { url } = req.body
  const review = await Review.findByPk(req.params.reviewId)

  if (!review) {
    const err = new Error('Review couldn\'t be found.');
    err.status = 404;
    throw (err);
  }

  /**************** Checks review's image count and errs  if > 10 ****************/
  const allReviewImages = await ReviewImage.findAll({
    where: { reviewId: review.id }
  })
  if (allReviewImages.length >= 10) {
    const err = new Error('Maximum number of images for this resource was reached');
    err.status = 403;
    throw (err);
  }
  /*******************************************************************************/

  // create the review's new image, linking it using given reviewId
  const reviewImage = await ReviewImage.create({
    reviewId: req.params.reviewId,
    url: url
  })

  let id = reviewImage.id

  return res.json({
    id,
    url
  });

});

//!              EDIT/UPDATE A REVIEW

router.put('/:reviewId', validateNewReview, async (req, res, next) => {
  const { review, stars } = req.body
  const { user } = req

  const foundReview = await Review.findOne({
    where: {
      id: req.params.reviewId,
      userId: user.id
    }
  })

  if (!foundReview) {
    const err = new Error('Review couldn\'t be found.');
    err.status = 404;
    throw (err);
  }

  foundReview.update({
    review: review,
    stars: stars
  })
  await foundReview.save()

  res.json(foundReview)
})

module.exports = router;