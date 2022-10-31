const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, User, Spot, SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { route } = require('./users');

const { Op } = require("sequelize");

router.use(express.json())

const validateNewBooking = [
  check('startDate')
    .exists({ checkFalsy: true })
    .withMessage('Start date is required'),
  check('endDate')
    .exists({ checkFalsy: true })
    .withMessage('End date is required'),
  handleValidationErrors
]

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

//!              EDIT/UPDATE A BOOKING

router.put('/:bookingId',
  // validateNewBooking,
  async (req, res, next) => {
    const { startDate, endDate } = req.body
    const { user } = req

    // const foundBooking = await Booking.findByPk(req.params.bookingId)

    const foundBooking = await Booking.findOne({
      where: {
        id: req.params.bookingId,
        userId: user.id
      }
    })

    const allBookings = await Booking.findAll({ //find all bookings for this spot
      where: {
        spotId: req.params.spotId
      }
    })

    const rn = new Date().toJSON()

    if (!foundBooking) {
      const err = new Error('Booking couldn\'t be found.');  // <<--
      err.status = 404;
      throw (err);

    } else if (Date.parse(startDate) > Date.parse(endDate)) {
      const err = new Error('endDate cannot come before startdate') // <<--
      err.status = 400
      throw (err)

    } else if (foundBooking.endDate < rn) { // if the found booking's dates have passed
      const err = new Error('Past bookings can\'t be modified') // <<--
      err.status = 403
      throw (err)
    }

    for (let i = 0; i < allBookings.length; i++) {
      let booking = allBookings[i]

      // console.log('----------------------')
      // console.log(booking)
      // console.log('----------------------')
      // console.log(typeof booking)
      // console.log(booking.startDate)
      // console.log(booking.endDate)
      // console.log('----------------------')

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

      } else if (startDate < rn || endDate < rn) {
        const err = new Error('New date cannot be in the past') //! <<--
        err.status = 403
        throw (err)
      }
    }

    foundBooking.set({
      startDate: startDate,
      endDate: endDate
    })
    foundBooking.save()

    return res.json(foundBooking)
  })

module.exports = router;
