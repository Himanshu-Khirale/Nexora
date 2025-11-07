import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartPanel } from '../components/CartPanel';
import { StatusBanner } from '../components/StatusBanner';
import type { Cart } from '../types';

interface CheckoutPageProps {
  cart?: Cart | null;
  isLoading: boolean;
  error: string | null;
  pendingItemId?: string | null;
  onQuantityChange: (productId: string, quantity: number) => Promise<void>;
  onRemove: (productId: string) => Promise<void>;
  onCheckout: (payload: { name: string; email: string }) => Promise<void>;
  checkoutError?: string | null;
  isCheckoutLoading?: boolean;
  onRetry: () => void;
}

export const CheckoutPage = ({
  cart,
  isLoading,
  error,
  pendingItemId,
  onQuantityChange,
  onRemove,
  onCheckout,
  checkoutError,
  isCheckoutLoading = false,
  onRetry,
}: CheckoutPageProps) => {
  const navigate = useNavigate();
  const hasItems = useMemo(() => Boolean(cart?.items.length), [cart]);

  if (isLoading) {
    return <div className="loader">Preparing checkout…</div>;
  }

  return (
    <section className="page-section checkout-page">
      <header className="page-header">
        <div>
          <h2>Checkout</h2>
          <p>Confirm your order details and receive an instant receipt.</p>
        </div>
        <button type="button" className="btn btn--ghost" onClick={() => navigate('/cart')}>
          Back to cart
        </button>
      </header>

      {error && <StatusBanner kind="error" message={error} onRetry={onRetry} />}

      {!hasItems ? (
        <div className="empty-state">
          <p>Your cart is empty.</p>
          <button type="button" className="btn btn--primary" onClick={() => navigate('/')}
          >
            Browse products
          </button>
        </div>
      ) : (
        <CartPanel
          cart={cart}
          pendingItemId={pendingItemId}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
          onCheckout={onCheckout}
          checkoutError={checkoutError}
          isCheckoutLoading={isCheckoutLoading}
        />
      )}
    </section>
  );
};

