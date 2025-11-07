import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppHeader } from './components/AppHeader';
import { ReceiptModal } from './components/ReceiptModal';
import { useCart } from './hooks/useCart';
import { useProducts } from './hooks/useProducts';
import { CataloguePage } from './pages/CataloguePage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { api } from './services/api';
import type { Receipt } from './types';

const App = () => {
  const { products, isLoading: productsLoading, error: productsError, reload: reloadProducts } =
    useProducts();
  const {
    cart,
    isLoading: cartLoading,
    error: cartError,
    pendingItemId,
    addItem,
    removeItem,
    refreshCart,
    summary,
    resetCart,
  } = useCart();

  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isCheckoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const handleAddToCart = async (productId: string, quantity: number) => {
    setCheckoutError(null);
    try {
      await addItem(productId, quantity);
    } catch (error) {
      // error handled in hook; no-op
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    setCheckoutError(null);
    try {
      await addItem(productId, quantity);
    } catch (error) {
      // handled in hook
    }
  };

  const handleRemoveItem = async (productId: string) => {
    setCheckoutError(null);
    try {
      await removeItem(productId);
    } catch (error) {
      // handled in hook
    }
  };

  const handleCheckout = async (payload: { name: string; email: string }) => {
    setCheckoutError(null);
    setCheckoutLoading(true);
    try {
      const receiptResponse = await api.checkoutCart(payload);
      setReceipt(receiptResponse);
      resetCart();
      await refreshCart();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Checkout failed';
      setCheckoutError(message);
      throw new Error(message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleCloseReceipt = () => {
    setReceipt(null);
  };

  return (
    <BrowserRouter>
      <div className="app-shell">
        <AppHeader itemCount={summary.totalItems} total={summary.totalPrice} />

        <Routes>
          <Route
            path="/"
            element={
              <CataloguePage
                products={products}
                isLoading={productsLoading}
                error={productsError}
                onRetry={() => {
                  reloadProducts();
                  refreshCart();
                }}
                cart={cart}
                pendingItemId={pendingItemId}
                onAdd={handleAddToCart}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                isLoading={cartLoading}
                error={cartError}
                pendingItemId={pendingItemId}
                onQuantityChange={handleUpdateQuantity}
                onRemove={handleRemoveItem}
                onRetry={refreshCart}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                cart={cart}
                isLoading={cartLoading}
                error={cartError}
                pendingItemId={pendingItemId}
                onQuantityChange={handleUpdateQuantity}
                onRemove={handleRemoveItem}
                onCheckout={handleCheckout}
                checkoutError={checkoutError}
                isCheckoutLoading={isCheckoutLoading}
                onRetry={refreshCart}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <ReceiptModal receipt={receipt} onClose={handleCloseReceipt} />
      </div>
    </BrowserRouter>
  );
};

export default App;

