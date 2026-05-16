import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product === product._id);
      if (existing) {
        return prev.map(i => i.product === product._id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, {
        product: product._id,
        title: product.title,
        price: product.price,
        originalPrice: product.discountPrice > 0 ? product.discountPrice : product.price,
        image: product.images?.[0] || '',
        quantity,
        stock: product.stock,
      }];
    });
  };

  const removeFromCart = (productId) => {
    setItems(prev => prev.filter(i => i.product !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId);
    setItems(prev => prev.map(i => i.product === productId ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalSavings = items.reduce((sum, i) => sum + (i.originalPrice > i.price ? (i.originalPrice - i.price) * i.quantity : 0), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, totalSavings }}>
      {children}
    </CartContext.Provider>
  );
}
