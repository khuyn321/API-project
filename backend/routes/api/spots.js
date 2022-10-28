const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, Sequelize } = require('../../db/models');

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

//!              GET SPOTS OF CURRENT USER

router.get('/current', async (req, res) => {
  const { user } = req
  const allSpots = await Spot.findAll({
    where: {
      ownerId: user.id
    }
  })

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

//////////////////////////////////////
// const { spotId } = req.params

// const spots = await Spot.findAll()
// let spotArr = []

// for (let i = 0; i < spots.length; i++) {
//   let jsonSpot = spots[i].toJSON()

//   console.log(`jsonSpot:  ${jsonSpot}`)
//   console.log(`spotId:  ${req.params.spotid}`)

//   if (jsonSpot.id === req.params.spotid) {
//     spotArr.push(jsonSpot)
//   }
// }

// console.log('...SPOTARRAY...')
// console.log(spotArr)
// console.log('...')

// spots.url = url
// spots.preview = preview

// console.log('...')
// // console.log(spot)
// console.log('...')


module.exports = router;