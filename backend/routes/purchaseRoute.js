const express = require('express');
const { createPurchase, getUserPurchases, cancelPurchase, cancelPurchaseItem } = require('../controllers/purchaseController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createPurchase);
router.get('/', protect, getUserPurchases);
router.delete('/:id', protect, cancelPurchase);
router.delete('/:purchaseId/items/:itemIndex', protect, cancelPurchaseItem);

module.exports = router;
