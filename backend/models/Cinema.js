const mongoose = require('mongoose');

const cinemaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    city: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    image: { type: String, default: '/uploads/movies/placeholder-cinema.jpg' },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cinema', cinemaSchema);
