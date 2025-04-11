const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { auth } = require('../middleware/auth');

router.get('/', auth, patientController.getPatients);

module.exports = router; 