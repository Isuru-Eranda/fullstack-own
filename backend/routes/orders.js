const express = require('express');
const { getUserOrders, getOrderReceipt } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getUserOrders);
router.get('/:id/receipt', protect, getOrderReceipt);

module.exports = router;
