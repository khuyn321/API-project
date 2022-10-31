const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, ReviewImage, SpotImage, User, Booking, Sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { route } = require('./users');

const { Op } = require("sequelize");

router.use(express.json())

const validateNewSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage("City is required"),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage("State is required"),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  check('lat')
    .exists({ checkFalsy: true })
    .withMessage('Latitude is not valid'),
  check('lng')
    .exists({ checkFalsy: true })
    .withMessage('Longitude is not valid'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters.'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .withMessage('Price per day is required'),
  handleValidationErrors
];

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

//!              GET ALL BOOKINGS BY SPOTID

router.get('/:spotId/bookings', async (req, res) => {
  const { user } = req
  const spot = await Spot.findOne({  //finds the spot to check if it exists
    where: { id: req.params.spotId },
  })
  if (!spot) { // if incvalid/doesn't exist, throw err
    const err = new Error('Spot couldn\'t be found.');
    err.status = 404;
    throw (err);
  }

  const allBookings = await Booking.findAll({
    where: {
      spotId: req.params.spotId
    }
  })

  const Bookings = [];
  for (let i = 0; i < allBookings.length; i++) { //for each review of the current user
    const booking = allBookings[i]

    if (spot.ownerId === user.id) {
      //*    if the spot belongs to the user (owner),
      //*    return booking with more information

      const bookingUser = await User.findOne({
        where: {
          id: booking.userId
        }
      })

      // Grabbing user info for a booking at owner's spot
      const userInfo = {   //   -->
        id: bookingUser.id,
        firstName: bookingUser.firstName,
        lastName: bookingUser.lastName
      }

      const bookingInfo1 = {
        User: userInfo,  //   <--
        id: booking.id,
        spotId: req.params.spotId,
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
      }
      Bookings.push(bookingInfo1)

    } else {
      //*    else, return minimal information for user

      const bookingInfo2 = {
        spotId: req.params.spotId,
        startDate: booking.startDate,
        endDate: booking.endDate
      }
      Bookings.push(bookingInfo2)
    }
  }
  res.json({
    Bookings
  })
})

//!             ADD IMG TO SPOT BASED ON SPOT ID

router.post('/:spotid/images', async (req, res, next) => {
  const { url, preview } = req.body
  const spot = await Spot.findByPk(req.params.spotid)

  if (!spot) {
    const err = new Error('Spot couldn\'t be found.');
    err.status = 404;
    throw (err);
  }
  // create the new spot's image, linking it using given spotId
  const spotImage = await SpotImage.create({
    spotId: req.params.spotid,
    url: url,
    preview: preview
  })

  let id = spotImage.id

  return res.json({
    id,
    url,
    preview
  });
});

//!             CREATE REVIEW FOR SPOT BASED ON SPOT ID

router.post('/:spotId/reviews', validateNewReview, async (req, res, next) => {
  const { review, stars } = req.body
  const { user } = req
  // const spotId = JSON.parse(req.params.spotId)
  // const spot = await Spot.findByPk(spotId)
  const spot = await Spot.findByPk(req.params.spotId)

  if (!spot) {
    const err = new Error('Spot couldn\'t be found.');
    err.status = 404;
    throw (err);
  }

  //check if user has made
  const reviewExists = await Review.findAll({
    where: {
      userId: user.id,
      spotId: spot.id
    }
  })
  if (reviewExists[0]) {
    const err = new Error('User already has a review for this spot');
    err.status = 403;
    throw (err);
  }
  // create the new spot's review, linking it using given spotId
  const newReview = await Review.create({
    userId: user.id,
    spotId: req.params.spotId,
    review: review,
    stars: stars
  })

  return res.json(
    newReview);
});

//!             CREATE BOOKING FOR SPOT BASED ON SPOT ID


/* must validate:
!       - NOT BOOKED during another booking time slot
!           -     "startDate": "Start date conflicts with an existing booking"
!           -     "endDate": "End date conflicts with an existing booking"

*/
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const { startDate, endDate } = req.body
  const { user } = req

  const spot = await Spot.findByPk(req.params.spotId) // find the spot to make a booking from

  if (!spot) {
    const err = new Error('Spot couldn\'t be found.');
    err.status = 404;
    throw (err);
  }

  //!  Check new date conflicts
  /********************************************************/
  const allBookings = await Booking.findAll({
    where: {
      spotId: req.params.spotId
    }
  })

  const rn = new Date().toJSON()

  if (Date.parse(startDate) >= Date.parse(endDate)) {
    const err = new Error('Validation error') //! <<--
    err.status = 400
    err.errors = { endDate: "endDate cannot be on or before startDate" }
    throw (err)

  } else if (startDate < rn || endDate < rn) { // if the new booking is set in the past
    const err = new Error('New date cannot be in the past') //! <<--
    err.status = 403
    throw (err)
  }

  for (let i = 0; i < allBookings.length; i++) { //! Check any bookings that already exist
    let booking = allBookings[i]

    if ((startDate >= booking.startDate && endDate >= booking.startDate) && (startDate <= booking.endDate && endDate <= booking.endDate)) {
      //! if the new date range is contained in another booking's date range

      const err = new Error('Sorry, this spot is already booked for the specified dates')
      err.errors = {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking"
      }
      err.status = 403
      throw (err)


    } else if (startDate <= booking.startDate && endDate >= booking.startDate) {
      //! if the new end date overlaps another booking

      const err = new Error('Sorry, this spot is already booked for the specified dates') //! <<--
      err.errors = { endDate: "End date conflicts with an existing booking" }
      err.status = 403
      throw (err)


    } else if (startDate <= booking.endDate && endDate >= booking.endDate) {
      //! if the new start date overlaps another booking

      const err = new Error('Sorry, this spot is already booked for the specified dates') //! <<--
      err.errors = { startDate: "Start date conflicts with an existing booking" }
      err.status = 403
      throw (err)
    }
  }
  /********************************************************/

  const newBooking = await Booking.create({
    spotId: req.params.spotId,
    userId: user.id,
    startDate: startDate,
    endDate: endDate
  })

  return res.json(
    newBooking);
});

//!              GET REVIEWS BY SPOTID

router.get('/:spotId/reviews', async (req, res) => {
  const spot = await Spot.findOne({  //finds the spot to check if it exists
    where: { id: req.params.spotId },
  })
  if (!spot) { // if incvalid/doesn't exist, throw err
    const err = new Error('Spot couldn\'t be found.');
    err.status = 404;
    throw (err);
  }

  const allReviews = await Review.findAll({
    where: {
      spotId: req.params.spotId
    }
  })

  const Reviews = [];
  for (let i = 0; i < allReviews.length; i++) { //for each review of the current user
    const review = allReviews[i]

    const reviewUser = await User.findOne({ // finds the review's user info
      where: { id: review.userId },
      attributes: ['id', 'firstName', 'lastName']
    })

    let reviewImages = await ReviewImage.findAll({      //finds all imgs for review
      where: { reviewId: review.id },
      attributes: ['id', 'url']
    })

    const reviewData = {
      id: review.id,
      userId: review.userId,
      spotId: review.spotId,
      review: review.review,
      stars: review.stars,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      User: reviewUser,
      ReviewImages: reviewImages
    }
    Reviews.push(reviewData)
  }
  res.json({
    Reviews
  })
})


//!              GET SPOTS OF CURRENT USER

router.get('/current', async (req, res) => {
  const { user } = req
  const allSpots = await Spot.findAll({
    where: {
      ownerId: user.id
    }
  })

  const spotsInfo = [];
  for (let i = 0; i < allSpots.length; i++) {
    const spot = allSpots[i]

    const review = await spot.getReviews({
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']
        // sequelize aggregate function to avg stars
      ]
    })
    const avgRating = review[0].toJSON().avgRating

    let spotImage = await SpotImage.findOne({
      where: {
        preview: true,
        spotId: spot.id
      }
    })

    if (spotImage) {
      spotImage = spotImage.url
    } else {
      spotImage = null
    }

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
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      avgRating: avgRating,
      previewImage: spotImage
    }
    spotsInfo.push(spotInfo)
  }
  res.json({
    Spots: spotsInfo
  })
})

//!           GET DETAILS OF SPOT FROM AN ID

router.get('/:spotid', async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotid)
  if (!spot) {
    const err = new Error('Spot couldn\'t be found.');
    err.status = 404;
    throw (err);
  }

  const numReviews = await Review.count({
    where: {
      spotId: spot.id
    }
  })

  // const numReview = await spot.getReviews({  //aggregate function to find average of Stars column
  //   attributes: [
  //     [Sequelize.fn('COUNT'), 'numReviews']
  //   ]
  // })

  // const numReviews = numReview[0].toJSON().numReviews //keying to grab the value
  // console.log('---------THIS IS NUM-REVIEWS BELOW--------')
  // console.log(numReviews)
  // console.log('------------------------------------------')

  const review = await spot.getReviews({  //aggregate function to find average of Stars column
    attributes: [
      [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgStarRating']
    ]
  })

  const avgRating = review[0].toJSON().avgStarRating //keying to grab the value

  // console.log('---------THIS IS AVG-RATING BELOW--------')
  // console.log(avgRating)
  // console.log('------------------------------------------')

  let SpotImages = await SpotImage.findAll({      //finds the first image that has a truthy preview
    where: {
      spotId: spot.id
    },
    attributes: [
      'id', 'url', 'preview'
    ]
  })

  const owner = await User.findByPk(spot.ownerId, {
    attributes: [
      'id', 'firstName', 'lastName'
    ]
  })

  res.json({
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lng: spot.lng,
    name: spot.name,
    description: spot.description,
    price: spot.price,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
    numReviews: numReviews,
    avgStarRating: avgRating,
    SpotImages: SpotImages,
    Owner: owner
  })
});

//!              EDIT/UPDATE A SPOT

router.put('/:spotId', validateNewSpot, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body
  const { user } = req

  const spot = await Spot.findOne({
    where: {
      id: req.params.spotId,
      ownerId: user.id
    }
  })

  if (!spot) {
    const err = new Error('Spot couldn\'t be found.');
    err.status = 404;
    throw (err);
  }

  spot.update({
    address: address,
    city: city,
    state: state,
    country: country,
    lat: lat,
    lng: lng,
    name: name,
    description: description,
    price: price
  })
  await spot.save()

  res.json(spot)
})

// const updateDog = (req, res) => {
//   const { name } = req.body;
//   const { dogId } = req.params;
//   const dog = dogs.find(dog => dog.dogId == dogId);
//   dog.name = name;
//   res.json(dog);
// };

//!              DELETE A SPOT

router.delete('/:spotId', async (req, res, next) => {
  const { user } = req

  const spot = await Spot.findOne({
    where: {
      id: req.params.spotId,
      ownerId: user.id
    }
  })

  if (!spot) {
    const err = new Error('Spot couldn\'t be found.');
    err.status = 404;
    throw (err);
  };

  await spot.destroy();

  res.json({
    message: "Successfully deleted",
    statusCode: 200
  });
});

//!              CREATE A NEW SPOT

router.post(
  '/',
  validateNewSpot,
  async (req, res) => {
    const { user } = req

    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spot = await Spot.create({
      ownerId: user.id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    });
    // return await Spot.findByPk(spot.id);
    return res.json({
      spot
    });
  }
);

//!              GET ALL SPOTS
//* for each spot, I want to get that spot's reviews
//* then I want to average those reviews (sumOfReviews / revCount)
//* and res.json an "avgRating" with that calculated avg

router.get('/', async (req, res) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query
  page = parseInt(page)
  size = parseInt(size)
  if (!page || page > 10) page = 1
  if (!size || size > 20) size = 20

  const where = {};

  //! *****************************************************************

  if (page < 1) err.errors.page = "Page must be greater than or equal to 1"
  if (size < 1) err.errors.size = "Size must be greater than or equal to 1"
  if (maxLat) {
    if (isNaN(parseFloat(maxLat))) {
      const err = new Error('Validation Error')
      err.errors = { maxLat: "Maximum latitude is invalid" };
      err.status = 400
      throw (err)
    }
    where.lat = { [Op.lt]: maxLat }
  }
  if (minLat) {
    if (isNaN(parseFloat(minLat))) {
      const err = new Error('Validation Error')
      err.errors = { minLat: "Minimum latitude is invalid" }
      err.status = 400
      throw (err)
    };
    where.lat = { [Op.gt]: minLat }
  }
  if (minLng) {
    if (isNaN(parseFloat(minLng))) {
      const err = new Error('Validation Error')
      err.errors = { minLng: "Maximum longitude is invalid" };
      err.status = 400
      throw (err)
    }
    where.lng = { [Op.gt]: minLng }
  }
  if (maxLng) {
    if (isNaN(parseFloat(maxLng))) {
      const err = new Error('Validation Error')
      err.errors = { maxLng: "Minimum longitude is invalid" }
      err.status = 400
      throw (err)
    }
    where.lng = { [Op.lt]: maxLng }
  }
  if (minPrice) {
    if (isNaN(parseFloat(minPrice)) || minPrice < 0) {
      const err = new Error('Validation Error')
      err.errors = { minPrice: "Minimum price must be greater than or equal to 0" };
      err.status = 400
      throw (err)
    }
    where.price = { [Op.gt]: minPrice }
  }
  if (maxPrice) {
    if (isNaN(parseFloat(maxPrice)) || maxPrice < 0) {
      const err = new Error('Validation Error')
      err.errors = { maxPrice: "Minimum price must be greater than or equal to 0" }
      err.status = 400
      throw (err)
    }
    where.price = { [Op.lt]: maxPrice }
  }

  //! *****************************************************************

  let pagination = {}

  pagination.limit = size; // pagination: limit = user-inputted size
  pagination.offset = size * (page - 1)

  //? ***********************************************/

  const allSpots = await Spot.findAll({
    where,
    ...pagination
  })

  const spotsInfo = [];
  for (let i = 0; i < allSpots.length; i++) { //lazy loading to avoid conflicts w/ Postgres
    const spot = allSpots[i]

    const review = await spot.getReviews({  //aggregate function to find average of Stars column
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']
      ]
    })

    const avgRating = review[0].toJSON().avgRating //keying to grab the value

    let spotImage = await SpotImage.findOne({      //finds the first image that has a truthy preview
      where: {
        preview: true,
        spotId: spot.id
      }
    })

    if (spotImage) {
      spotImage = spotImage.url
    } else {
      spotImage = null
    }

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
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      avgRating: avgRating,
      previewImage: spotImage
    }
    spotsInfo.push(spotInfo)
  }
  res.json({
    Spots: spotsInfo,
    page,
    size
  })
})

module.exports = router;