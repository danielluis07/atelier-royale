import { CartClient } from "@/components/store/cart/client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sacola | Atelier Royale",
};

const CartPage = () => {
  return <CartClient />;
};

export default CartPage;
