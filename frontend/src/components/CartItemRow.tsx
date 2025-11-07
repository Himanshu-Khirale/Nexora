import type { CartItem } from '../types';

interface CartItemRowProps {
  item: CartItem;
  isProcessing?: boolean;
  onQuantityChange: (productId: string, quantity: number) => Promise<void>;
  onRemove: (productId: string) => Promise<void>;
}

export const CartItemRow = ({ item, isProcessing = false, onQuantityChange, onRemove }: CartItemRowProps) => {
  const handleDecrease = async () => {
    if (item.quantity === 1) return;
    await onQuantityChange(item.productId, item.quantity - 1);
  };

  const handleIncrease = async () => {
    await onQuantityChange(item.productId, item.quantity + 1);
  };

  const handleRemove = async () => {
    await onRemove(item.productId);
  };

  return (
    <div className="cart-item">
      <div className="cart-item__overview">
        <img src={item.image} alt={item.name} />
        <div>
          <h4>{item.name}</h4>
          <span className="cart-item__sku">{item.sku}</span>
          <span className="cart-item__price">₹{item.price.toFixed(2)}</span>
        </div>
      </div>
      <div className="cart-item__actions">
        <div className="quantity-control">
          <button type="button" onClick={handleDecrease} disabled={isProcessing || item.quantity <= 1}>
            −
          </button>
          <span>{item.quantity}</span>
          <button type="button" onClick={handleIncrease} disabled={isProcessing}>
            +
          </button>
        </div>
        <span className="cart-item__line-total">₹{item.lineTotal.toFixed(2)}</span>
        <button type="button" className="btn btn--ghost" onClick={handleRemove} disabled={isProcessing}>
          Remove
        </button>
      </div>
    </div>
  );
};

