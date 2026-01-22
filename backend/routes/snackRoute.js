const express = require('express');
const { createSnack, getproducts, deleteSnack, updatesnack, getSnackinfo, migrateSnackImagesToB2 } = require('../controllers/snackController');
const { protect } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');

const router = express.Router();

router.post('/', protect, uploadMultiple('images', 10, 'snacks'), createSnack);
router.get('/', getproducts);
router.delete('/:snackid', protect, deleteSnack);
router.put('/:snackid', protect, uploadMultiple('images', 10, 'snacks'), updatesnack);
router.get('/:snackid', getSnackinfo);
router.post('/migrate-images', protect, migrateSnackImagesToB2);

module.exports = router;
