const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

router.post('/create-checkout-session', auth, paymentController.createCheckoutSession);
router.get('/subscription-status', auth, paymentController.getSubscriptionStatus);
router.post('/simulate-activation', auth, paymentController.simulateSubscriptionActivation);
router.post('/webhook', paymentController.handleWebhook);
router.get('/webhook-test', paymentController.testWebhook);

module.exports = router; 