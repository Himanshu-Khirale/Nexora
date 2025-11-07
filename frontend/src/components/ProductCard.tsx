import { useMemo } from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  inCartQuantity?: number;
  isProcessing?: boolean;
  onAdd: (productId: string, quantity: number) => Promise<void>;
}

export const ProductCard = ({
  product,
  inCartQuantity = 0,
  isProcessing = false,
  onAdd,
}: ProductCardProps) => {
  const formattedPrice = useMemo(() => `₹${product.price.toFixed(2)}`, [product.price]);
  const isOutOfStock = product.inventory <= 0;

  const handleAddClick = async () => {
    const nextQuantity = inCartQuantity + 1;
    await onAdd(product.id, nextQuantity);
  };

  return (
    <article className="product-card">
      <div className="product-card__image">
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
      <div className="product-card__content">
        <span className="product-card__sku">{product.sku}</span>
        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__description">{product.description}</p>
      </div>
      <div className="product-card__footer">
        <div>
          <span className="product-card__price">{formattedPrice}</span>
          <span className="product-card__inventory">
            {isOutOfStock ? 'Out of stock' : `${product.inventory} in stock`}
          </span>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          onClick={handleAddClick}
          disabled={isOutOfStock || isProcessing}
        >
          {isProcessing ? 'Adding…' : inCartQuantity > 0 ? 'Add one more' : 'Add to cart'}
        </button>
      </div>
    </article>
  );
};

