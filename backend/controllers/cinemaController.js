const Cinema = require('../models/Cinema');

// Create a new cinema (accepts image via multipart/form-data)
exports.createCinema = async (req, res) => {
  try {
    const { name, city, address, description } = req.body;
    if (!name || !city) return res.status(400).json({ message: 'Name and city are required' });

    let imagePath = '';
    if (req.file && req.file.filename) {
      imagePath = `/uploads/movies/${req.file.filename}`;
    }

    const cinema = new Cinema({ name, city, address, description, image: imagePath || undefined });
    await cinema.save();
    res.status(201).json({ message: 'Cinema created', cinema });
  } catch (err) {
    console.error('createCinema error', err);
    res.status(500).json({ message: 'Failed to create cinema' });
  }
};

// List cinemas (public)
exports.listCinemas = async (req, res) => {
  try {
    const cinemas = await Cinema.find().sort({ createdAt: -1 });
    res.status(200).json({ data: cinemas });
  } catch (err) {
    console.error('listCinemas error', err);
    res.status(500).json({ message: 'Failed to list cinemas' });
  }
};

module.exports = exports;
