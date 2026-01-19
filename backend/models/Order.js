const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  purchase: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' },
  totalPrice: { type: Number, default: 0 },
  receipt: { type: String }, // base64 PDF
  paymentMethod: { type: String, enum: ['card', 'cash'], default: 'cash' },
  status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
