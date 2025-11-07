import type { Receipt } from '../types';

interface ReceiptModalProps {
  receipt: Receipt | null;
  onClose: () => void;
}

export const ReceiptModal = ({ receipt, onClose }: ReceiptModalProps) => {
  if (!receipt) return null;

  const formattedDate = new Date(receipt.purchasedAt).toLocaleString();

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <header className="modal__header">
          <h3>Order Confirmed</h3>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Close
          </button>
        </header>
        <div className="modal__body">
          <p className="modal__highlight">Receipt ID: {receipt.receiptId}</p>
          <p>
            {receipt.customer.name} ({receipt.customer.email})<br />
            <span>{formattedDate}</span>
          </p>
          <ul className="modal__items">
            {receipt.items.map((item) => (
              <li key={item.productId}>
                <span>{item.quantity} × {item.name}</span>
                <span>₹{item.lineTotal.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="modal__total">
            <span>Total</span>
            <strong>₹{receipt.total.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

