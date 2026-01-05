const express = require('express');
const { createSnack, getproducts, deleteSnack } = require('../controllers/snackController');

const router = express.Router();

router.post('/', createSnack);
router.get('/', getproducts);
router.delete('/:snackid', deleteSnack);

module.exports = router;
