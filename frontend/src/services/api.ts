import axios, { AxiosError } from 'axios';
import type { Cart, Product, Receipt } from '../types';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const parseErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || axiosError.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unexpected error occurred';
};

const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data } = await apiClient.get<Product[]>('/products');
    return data;
  } catch (error) {
    throw new Error(parseErrorMessage(error));
  }
};

const fetchCart = async (): Promise<Cart> => {
  try {
    const { data } = await apiClient.get<Cart>('/cart');
    return data;
  } catch (error) {
    throw new Error(parseErrorMessage(error));
  }
};

const addToCart = async (productId: string, quantity: number): Promise<Cart> => {
  try {
    const { data } = await apiClient.post<Cart>('/cart', { productId, quantity });
    return data;
  } catch (error) {
    throw new Error(parseErrorMessage(error));
  }
};

const removeFromCart = async (productId: string): Promise<Cart> => {
  try {
    const { data } = await apiClient.delete<Cart>(`/cart/${productId}`);
    return data;
  } catch (error) {
    throw new Error(parseErrorMessage(error));
  }
};

const checkoutCart = async (
  payload: { name: string; email: string }
): Promise<Receipt> => {
  try {
    const { data } = await apiClient.post<Receipt>('/checkout', payload);
    return data;
  } catch (error) {
    throw new Error(parseErrorMessage(error));
  }
};

export const api = {
  fetchProducts,
  fetchCart,
  addToCart,
  removeFromCart,
  checkoutCart,
};

