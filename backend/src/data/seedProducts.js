const Product = require('../models/Product');
const defaultProducts = require('./products');

const seedProducts = async () => {
  await Promise.all(
    defaultProducts.map((product) =>
      Product.updateOne(
        { sku: product.sku },
        {
          $set: {
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            inventory: product.inventory,
          },
        },
        { upsert: true }
      )
    )
  );
};

module.exports = seedProducts;

