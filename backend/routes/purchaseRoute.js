const express = require('express');
const { createPurchase, getUserPurchases } = require('../controllers/purchaseController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createPurchase);
router.get('/', protect, getUserPurchases);

module.exports = router;
