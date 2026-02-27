export type CartItem = {
  productId: string;
  productName: string;
  productBrand: string;
  productImage: string;
  productSlug: string;
  variantId: string | null;
  variantName: string | null;
  size: string | null;
  price: number;
  quantity: number;
  maxStock: number | null;
};

export type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, variantId: string | null) => void;
  updateQuantity: (
    productId: string,
    variantId: string | null,
    quantity: number,
  ) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
};
