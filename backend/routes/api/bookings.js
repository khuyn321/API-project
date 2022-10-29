const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Review, ReviewImage, User, Spot, SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { route } = require('./users');

const { Op } = require("sequelize");

router.use(express.json())

//!              GET BOOKINGS OF CURRENT USER

router.get('/current',
  requireAuth,
  async (req, res) => {
    const { user } = req
    const allBookings = await Booking.findAll({
      where: {
        userId: user.id
      }
    })
    const Bookings = [];

    for (let i = 0; i < allBookings.length; i++) {
      const booking = allBookings[i]

      const spot = await Spot.findOne({
        where: { id: booking.spotId },
      })

      let spotImage = await SpotImage.findOne({
        where: { preview: true, spotId: spot.id }
      })

      if (spotImage) {
        spotImage = spotImage.url
      } else {
        spotImage = null
      }

      //************************/
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

      const bookingData = {
        id: booking.id,
        spotId: booking.spotId,
        Spot: spotInfo,
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
      }
      Bookings.push(bookingData)
    }
    res.json({
      Bookings
    })
  })

module.exports = router;
