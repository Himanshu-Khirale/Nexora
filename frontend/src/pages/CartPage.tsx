import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItemRow } from '../components/CartItemRow';
import { StatusBanner } from '../components/StatusBanner';
import type { Cart } from '../types';

interface CartPageProps {
  cart?: Cart | null;
  isLoading: boolean;
  error: string | null;
  pendingItemId?: string | null;
  onQuantityChange: (productId: string, quantity: number) => Promise<void>;
  onRemove: (productId: string) => Promise<void>;
  onRetry: () => void;
}

export const CartPage = ({
  cart,
  isLoading,
  error,
  pendingItemId,
  onQuantityChange,
  onRemove,
  onRetry,
}: CartPageProps) => {
  const navigate = useNavigate();

  const hasItems = useMemo(() => Boolean(cart?.items.length), [cart]);

  if (isLoading) {
    return <div className="loader">Loading cart…</div>;
  }

  return (
    <section className="page-section">
      <header className="page-header">
        <div>
          <h2>Your Cart</h2>
          <p>Review your selected items and adjust quantities before checkout.</p>
        </div>
        {hasItems && (
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => navigate('/checkout')}
          >
            Continue to checkout
          </button>
        )}
      </header>

      {error && <StatusBanner kind="error" message={error} onRetry={onRetry} />}

      {!hasItems ? (
        <div className="empty-state">
          <p>Your cart is empty.</p>
          <button type="button" className="btn btn--primary" onClick={() => navigate('/')}>
            Browse products
          </button>
        </div>
      ) : (
        <div className="cart-page__list">
          {cart?.items.map((item) => (
            <CartItemRow
              key={item.productId}
              item={item}
              isProcessing={pendingItemId === item.productId}
              onQuantityChange={onQuantityChange}
              onRemove={onRemove}
            />
          ))}
          <div className="cart-page__footer">
            <div>
              <span className="cart-page__label">Subtotal</span>
              <span className="cart-page__total">₹{(cart?.total ?? 0).toFixed(2)}</span>
            </div>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => navigate('/checkout')}
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

