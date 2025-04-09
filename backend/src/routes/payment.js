const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

router.use(auth);

router.post('/create-checkout-session', paymentController.createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

module.exports = router; 