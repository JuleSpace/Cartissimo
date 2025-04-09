const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { auth } = require('../middleware/auth');

router.use(auth);

router.post('/', patientController.create);
router.get('/', patientController.getAll);
router.get('/:id', patientController.getOne);
router.put('/:id', patientController.update);
router.delete('/:id', patientController.delete);

module.exports = router; 