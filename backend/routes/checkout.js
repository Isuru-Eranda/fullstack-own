const express = require('express');
const { checkout, createPaymentIntent } = require('../controllers/checkoutController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, checkout);
router.post('/create-payment-intent', protect, createPaymentIntent);

module.exports = router;
