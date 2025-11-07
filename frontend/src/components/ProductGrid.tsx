import type { Cart, Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  cart?: Cart | null;
  pendingItemId?: string | null;
  onAdd: (productId: string, quantity: number) => Promise<void>;
}

export const ProductGrid = ({ products, cart, pendingItemId, onAdd }: ProductGridProps) => {
  const getQuantityForProduct = (productId: string) =>
    cart?.items.find((item) => item.productId === productId)?.quantity ?? 0;

  if (!products.length) {
    return (
      <div className="empty-state">
        <p>No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          inCartQuantity={getQuantityForProduct(product.id)}
          isProcessing={pendingItemId === product.id}
          onAdd={onAdd}
        />
      ))}
    </div>
  );
};

