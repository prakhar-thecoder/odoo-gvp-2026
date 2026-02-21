const express = require('express');
const router = express.Router();
const vehicleController = require('./vehicles.controller');

router.post('/', vehicleController.createVehicle);
router.get('/', vehicleController.getVehicles);
router.delete('/:id', vehicleController.deleteVehicle);
router.patch('/:id/status', vehicleController.updateVehicleStatus);

module.exports = router;
