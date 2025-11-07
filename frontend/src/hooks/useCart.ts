import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import type { Cart } from '../types';

export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);

  const loadCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.fetchCart();
      setCart(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const performCartMutation = useCallback(
    async (action: () => Promise<Cart>, productId: string) => {
      setPendingItemId(productId);
      try {
        const updatedCart = await action();
        setCart(updatedCart);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Cart update failed';
        setError(message);
        throw err;
      } finally {
        setPendingItemId(null);
      }
    },
    []
  );

  const addItem = useCallback(
    async (productId: string, quantity: number) => {
      await performCartMutation(() => api.addToCart(productId, quantity), productId);
    },
    [performCartMutation]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      await performCartMutation(() => api.removeFromCart(productId), productId);
    },
    [performCartMutation]
  );

  const refreshCart = useCallback(async () => {
    await loadCart();
  }, [loadCart]);

  const summary = useMemo(() => {
    const totalItems = cart?.items.reduce<number>((count, item) => count + item.quantity, 0) ?? 0;
    const totalPrice = cart?.total ?? 0;
    return { totalItems, totalPrice };
  }, [cart]);

  const resetCart = useCallback(() => {
    setCart({
      id: 'guest',
      items: [],
      total: 0,
    });
  }, []);

  return {
    cart,
    isLoading,
    error,
    pendingItemId,
    addItem,
    removeItem,
    refreshCart,
    summary,
    resetCart,
  };
};

