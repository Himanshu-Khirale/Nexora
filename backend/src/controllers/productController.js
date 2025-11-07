const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ name: 1 });
  res.json(products);
});

module.exports = { getProducts };

