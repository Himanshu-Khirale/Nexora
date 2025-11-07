const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

const ACTIVE_USER_ID = 'guest';

const ensureCart = async () => {
  let cart = await Cart.findOne({ userId: ACTIVE_USER_ID });

  if (!cart) {
    cart = await Cart.create({ userId: ACTIVE_USER_ID, items: [] });
  }

  return cart;
};

const serializeCart = (cartDoc) => ({
  id: cartDoc.id,
  items: cartDoc.items.map((item) => ({
    productId: item.product.toString(),
    sku: item.sku,
    name: item.name,
    price: item.price,
    image: item.image,
    quantity: item.quantity,
    lineTotal: Number((item.price * item.quantity).toFixed(2)),
  })),
  total: Number(cartDoc.total.toFixed(2)),
});

const getCart = asyncHandler(async (req, res) => {
  const cart = await ensureCart();
  res.json(serializeCart(cart));
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid product id' });
  }

  const parsedQuantity = Number(quantity);
  if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be a positive number' });
  }

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const cart = await ensureCart();
  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  if (existingItem) {
    existingItem.quantity = parsedQuantity;
    existingItem.price = product.price;
    existingItem.name = product.name;
    existingItem.image = product.image;
  } else {
    cart.items.push({
      product: product._id,
      sku: product.sku,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: parsedQuantity,
    });
  }

  await cart.save();

  res.status(201).json(serializeCart(cart));
});

const removeFromCart = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Missing cart item identifier' });
  }

  const cart = await ensureCart();

  const filteredItems = cart.items.filter(
    (item) => item.product.toString() !== id && item.sku !== id
  );

  if (filteredItems.length === cart.items.length) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  cart.items = filteredItems;
  await cart.save();

  res.json(serializeCart(cart));
});

const clearCart = async () => {
  const cart = await ensureCart();
  cart.items = [];
  await cart.save();
  return serializeCart(cart);
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};

