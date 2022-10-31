const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, User, Sequelize } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { route } = require('./users');

const { Op } = require("sequelize");

router.use(express.json())

//!              DELETE A SPOT IMAGE

router.delete('/:imageId', requireAuth, async (req, res, next) => {
  const { user } = req

  const spotImage = await SpotImage.findOne({
    where: {
      id: req.params.imageId  //! find spotImage from given param
    }
  })

  //! (authorization) ********************/
  // find spotId from found spotImage
  // find ownerId from spot
  // if spot's ownerId !== user.id, user isn't authorized to delete spot

  const spot = await Spot.findOne({
    where: {
      id: spotImage.spotId  //! find spot to compare owner's id and currUser's id
    }
  })
  if (spot.ownerId != user.id) {
    const err = new Error("Must be owner to delete Spot Image")  //! <--
    err.status = 403
    throw (err)
  }

  if (!spotImage) {
    const err = new Error('Spot Image couldn\'t be found.'); //! <--
    err.status = 404;
    throw (err);
  } else if (!spot) {
    const err = new Error('Spot couldn\'t be found.'); //! <--
    err.status = 404;
    throw (err);
  };
  //! ***************************************/

  await spotImage.destroy();

  res.json({
    message: "Successfully deleted",
    statusCode: 200
  });
});

module.exports = router;