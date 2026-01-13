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

// Update cinema
exports.updateCinema = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, city, address, description } = req.body;

    let updateData = { name, city, address, description };

    if (req.file && req.file.filename) {
      updateData.image = `/uploads/movies/${req.file.filename}`;
    }

    const cinema = await Cinema.findByIdAndUpdate(id, updateData, { new: true });
    if (!cinema) {
      return res.status(404).json({ message: 'Cinema not found' });
    }

    res.status(200).json({ message: 'Cinema updated successfully', cinema });
  } catch (err) {
    console.error('updateCinema error', err);
    res.status(500).json({ message: 'Failed to update cinema' });
  }
};

// Delete cinema
exports.deleteCinema = async (req, res) => {
  try {
    const { id } = req.params;
    const cinema = await Cinema.findByIdAndDelete(id);
    if (!cinema) {
      return res.status(404).json({ message: 'Cinema not found' });
    }

    res.status(200).json({ message: 'Cinema deleted successfully' });
  } catch (err) {
    console.error('deleteCinema error', err);
    res.status(500).json({ message: 'Failed to delete cinema' });
  }
};

module.exports = exports;
