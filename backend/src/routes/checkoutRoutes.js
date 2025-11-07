const express = require('express');
const { checkoutCart } = require('../controllers/checkoutController');

const router = express.Router();

router.post('/', checkoutCart);

module.exports = router;

