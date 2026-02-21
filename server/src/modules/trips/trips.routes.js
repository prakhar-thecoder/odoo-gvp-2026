const express = require('express');
const router = express.Router();
const tripsController = require('./trips.controller');

router.post('/', tripsController.createTrip);
router.get('/', tripsController.getTrips);
router.patch('/:id/status', tripsController.updateTripStatus);

module.exports = router;
