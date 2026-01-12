const express = require('express');
const { createSnack, getproducts, deleteSnack, updatesnack, getSnackinfo } = require('../controllers/snackController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', createSnack);
router.get('/', protect, getproducts);
router.delete('/:snackid', protect, deleteSnack);
router.put('/:snackid', protect, updatesnack);
router.get('/public/:snackid', getSnackinfo); // Public route for viewing snack details
router.get('/:snackid', protect, getSnackinfo); // Admin route for managing snacks

module.exports = router;

/*
{
  "firstName": "Admin",
  "email": "admin@example.com",
  "password": "Admin123!",
  "lastName": "User",
  "phone": "+1234567890",
  "role": "admin"
}
  */