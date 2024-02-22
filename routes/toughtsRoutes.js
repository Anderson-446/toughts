const express = require('express');
const router = express.Router();
const ToughtController = require('../controllers/toughtsController.js');
//controller

router.get('/', ToughtController.showToughts)

module.exports = router