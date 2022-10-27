const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, Sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { route } = require('./users');

const { Op } = require("sequelize");

router.use(express.json())

const validateNewSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Please provide an address.'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a city.'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a state.'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a country.'),
  check('lat')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a latitude coordinate.'),
  check('lng')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a longitude coordinate.'),
  check('name')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a spot name.'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a spot name.'),
  check('price')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a price for your spot.'),
  handleValidationErrors
];

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
  const allSpots = await Spot.findAll()

  const payload = [];
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

    spotImage ? spotImage = spotImage.url : null

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
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      avgRating: avgRating,
      previewImage: spotImage
    }
    payload.push(spotData)
  }
  res.json({
    Spots: payload
  })
})


//todo)   scrapped/flawed code v v v

// attributes: {
//   include: [
//     [Sequelize.fn('AVG', Sequelize.col('avgRating.stars')), 'avgRating']]
// },

// const avgRating = await Review.findAll({
//   attributes: {
//     include: [
//       sequelize.fn('AVG', sequelize.col("stars")),
//       'avgRating'
//     ]
//   }
// })

// spots.forEach(async spot => {
//   if (spot.SpotImages[0].preview == true) {
//     let previewUrl = await SpotImage.findOne({
//       where: {
//         spotId: {
//           [Op.eq]: spot.id
//         }
//       },
//       attributes: ['url']
//     })

//     spot.SpotImages[0].preview = previewUrl
//   }
// });

// router.get('/', async (req, res) => {
//   // grab all needed information
//   const spots = await Spot.findAll(
//     {
//       include: [
//         {
//           model: Review
//         },
//         {
//           model: SpotImage
//         },
//       ],
//     }
//   )

//   //create  an empty arr to store spots.toJSON-ed
//   const spotList = []

//   spots.forEach(async spot => {
//     spotList.push(spot.toJSON())
//   })

//   //for each spot,
//   spotList.forEach(async spot => {
//     let reviewArr = spot.Reviews
//     let sumRatings = 0

//     // grab the sum of all ratings
//     reviewArr.forEach(review => {
//       sumRatings += review.stars
//     })

//     // find avg of the sum of ratings
//     let avgRating = sumRatings / reviewArr.length
//     spot.avgRating = avgRating

//     // GET RID OF Reviews info now that keyVal is set for avgRating
//     delete spot.Reviews

//     let spotImgArr = spot.SpotImages

//     spotImgArr.forEach(async image => {
//       if (image.preview === true) {
//         spot.previewImage = image.url
//       }
//       delete spot.SpotImages
//     })

//   });
//   return res.json({
//     Spots: spotList
//   })
// })

// router.get('/', async (_req, res, _next) => {
//   const allSpots = await Spot.findAll({
//     include: [
//       { model: Review, attributes: [] },
//       { model: SpotImage, attributes: [] }
//     ],
//     attributes: {
//       include: [
//         [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
//         [Sequelize.col('SpotImages.url'), 'previewImage']
//       ]
//     },
//     group: ['Spot.id']
//   });

//   return res.json({ Spots: allSpots });
// });

module.exports = router;