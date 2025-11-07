import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { Cart } from '../types';
import { CartItemRow } from './CartItemRow';

interface CartPanelProps {
  cart?: Cart | null;
  pendingItemId?: string | null;
  onQuantityChange: (productId: string, quantity: number) => Promise<void>;
  onRemove: (productId: string) => Promise<void>;
  onCheckout: (payload: { name: string; email: string }) => Promise<void>;
  checkoutError?: string | null;
  isCheckoutLoading?: boolean;
}

export const CartPanel = ({
  cart,
  pendingItemId,
  onQuantityChange,
  onRemove,
  onCheckout,
  checkoutError,
  isCheckoutLoading = false,
}: CartPanelProps) => {
  type CheckoutFormState = { name: string; email: string };

  const [formState, setFormState] = useState<CheckoutFormState>({ name: '', email: '' });
  const [touched, setTouched] = useState(false);

  const hasItems = Boolean(cart?.items.length);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name as keyof CheckoutFormState]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    if (!formState.name || !formState.email) return;

    try {
      await onCheckout(formState);
      setFormState({ name: '', email: '' });
      setTouched(false);
    } catch (error) {
      // handled by parent component
    }
  };

  const formError = touched && (!formState.name || !formState.email);

  return (
    <aside className="cart-panel">
      <header className="cart-panel__header">
        <div>
          <h2>Your Cart</h2>
          <span>{cart?.items.length ?? 0} items</span>
        </div>
        <span className="cart-panel__total">Total: ₹{(cart?.total ?? 0).toFixed(2)}</span>
      </header>

      <div className="cart-panel__items">
        {!hasItems && <p className="empty-state">Your cart is empty. Add some products to get started.</p>}
        {cart?.items.map((item) => (
          <CartItemRow
            key={item.productId}
            item={item}
            isProcessing={pendingItemId === item.productId}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
          />
        ))}
      </div>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <h3>Checkout</h3>
        <label>
          Full Name
          <input
            type="text"
            name="name"
            placeholder="Jane Doe"
            value={formState.name}
            onChange={handleInputChange}
            onBlur={() => setTouched(true)}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            placeholder="jane@example.com"
            value={formState.email}
            onChange={handleInputChange}
            onBlur={() => setTouched(true)}
            required
          />
        </label>

        {formError && <p className="form-error">Please provide both name and email.</p>}
        {checkoutError && <p className="form-error">{checkoutError}</p>}

        <button type="submit" className="btn btn--primary" disabled={!hasItems || isCheckoutLoading}>
          {isCheckoutLoading ? 'Processing…' : 'Place order'}
        </button>
      </form>
    </aside>
  );
};

