const express = require('express');
const { createSnack, getproducts, deleteSnack, updatesnack, getSnackinfo, migrateSnackImagesToB2 } = require('../controllers/snackController');
const { protect } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');

const router = express.Router();

router.post('/', protect, uploadMultiple('images', 10, 'snacks'), createSnack);
// Allow public access to GET list — controller will return only available snacks for non-admins
router.get('/', getproducts);
router.delete('/:snackid', protect, deleteSnack);
router.put('/:snackid', protect, uploadMultiple('images', 10, 'snacks'), updatesnack);
router.get('/:snackid', getSnackinfo);

// Migration route for admin to migrate Supabase images to B2
router.post('/migrate-images', protect, migrateSnackImagesToB2);

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