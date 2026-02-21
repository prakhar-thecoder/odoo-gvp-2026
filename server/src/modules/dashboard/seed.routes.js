const express = require('express');
const router = express.Router();
const seedController = require('./seed.controller');

router.post('/demo', seedController.seedDemoData);

module.exports = router;
