const express = require('express');
const { getUserOrders, getOrderReceipt, getOrderById, getAllOrders, cancelOrder, deleteOrder } = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getUserOrders);
router.get('/:id/receipt', protect, getOrderReceipt);
router.get('/:id', protect, getOrderById);

// Admin routes
router.get('/admin/all', protect, isAdmin, getAllOrders);
router.put('/:id/cancel', protect, isAdmin, cancelOrder);
router.delete('/:id', protect, isAdmin, deleteOrder);

module.exports = router;
