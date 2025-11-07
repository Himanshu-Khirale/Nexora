export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  image: string;
  inventory: number;
}

export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  lineTotal: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
}

export interface ReceiptItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  lineTotal: number;
}

export interface Receipt {
  receiptId: string;
  customer: {
    name: string;
    email: string;
  };
  purchasedAt: string;
  items: ReceiptItem[];
  total: number;
}

