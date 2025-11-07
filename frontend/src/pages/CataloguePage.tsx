import { ProductGrid } from '../components/ProductGrid';
import { StatusBanner } from '../components/StatusBanner';
import type { Cart, Product } from '../types';

interface CataloguePageProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  cart?: Cart | null;
  pendingItemId?: string | null;
  onAdd: (productId: string, quantity: number) => Promise<void>;
}

export const CataloguePage = ({
  products,
  isLoading,
  error,
  onRetry,
  cart,
  pendingItemId,
  onAdd,
}: CataloguePageProps) => {
  return (
    <section className="page-section">
      <header className="section-header">
        <div>
          <h2>Featured Products</h2>
          <p>Hand-picked lifestyle essentials for the modern workspace.</p>
        </div>
        <button type="button" className="btn btn--ghost" onClick={onRetry} disabled={isLoading}>
          Refresh
        </button>
      </header>

      {error && <StatusBanner kind="error" message={error} onRetry={onRetry} />}

      {isLoading ? (
        <div className="loader">Loading products…</div>
      ) : (
        <ProductGrid
          products={products}
          cart={cart}
          pendingItemId={pendingItemId}
          onAdd={onAdd}
        />
      )}
    </section>
  );
};

