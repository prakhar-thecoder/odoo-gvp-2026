const express = require('express');
const router = express.Router();
const maintenanceController = require('./maintenance.controller');

router.post('/', maintenanceController.createMaintenance);
router.get('/', maintenanceController.getMaintenanceLogs);
router.patch('/:id/status', maintenanceController.updateMaintenanceStatus);

module.exports = router;
