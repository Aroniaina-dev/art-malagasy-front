"use client";

import { useEffect } from "react";
import { useShop } from "./ShopProvider";

/** Vide le panier local une fois la commande confirmée. */
export default function ClearCart() {
  const { clearCart } = useShop();
  useEffect(() => {
    clearCart();
  }, [clearCart]);
  return null;
}
