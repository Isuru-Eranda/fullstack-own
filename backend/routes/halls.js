const express = require('express');
const router = express.Router();
const {
  createHall,
  getAllHalls,
  getHallById,
  updateHall,
  deleteHall,
} = require('../controllers/hallController');
const { protect, isAdmin } = require('../middleware/auth');


router.get('/', getAllHalls);
router.get('/:id', getHallById);

// Admin only
router.post('/', createHall);
router.put('/:id', updateHall);
router.delete('/:id', deleteHall);

module.exports = router;