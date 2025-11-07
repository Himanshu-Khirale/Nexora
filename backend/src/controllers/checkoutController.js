const Cart = require('../models/Cart');
const asyncHandler = require('../utils/asyncHandler');
const { clearCart } = require('./cartController');

const generateReceiptId = () => `RCPT-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Date.now()}`;

const checkoutCart = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  const cart = await Cart.findOne({ userId: 'guest' });

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const receipt = {
    receiptId: generateReceiptId(),
    customer: {
      name,
      email,
    },
    purchasedAt: new Date().toISOString(),
    items: cart.items.map((item) => ({
      productId: item.product.toString(),
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      lineTotal: Number((item.price * item.quantity).toFixed(2)),
    })),
    total: Number(cart.total.toFixed(2)),
  };

  await clearCart();

  res.status(201).json(receipt);
});

module.exports = { checkoutCart };

