import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('maa_cart');
    return saved ? JSON.parse(saved) : { items: [], cookId: null, cookName: '' };
  });

  useEffect(() => {
    localStorage.setItem('maa_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, cookId, cookName) => {
    setCart(prev => {
      // If adding item from a different cook, clear current cart or prompt. For simplicity, auto-clear here.
      if (prev.cookId && prev.cookId !== cookId) {
        if (!window.confirm(`Your cart contains items from ${prev.cookName}. Do you want to discard them and add this item?`)) {
          return prev;
        }
        return {
          cookId,
          cookName,
          items: [{ ...item, qty: 1 }]
        };
      }

      const existingItemIndex = prev.items.findIndex(i => i._id === item._id);
      if (existingItemIndex >= 0) {
        const newItems = [...prev.items];
        newItems[existingItemIndex].qty += 1;
        return { ...prev, items: newItems, cookId, cookName };
      }

      return {
        ...prev,
        cookId,
        cookName,
        items: [...prev.items, { ...item, qty: 1 }]
      };
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const newItems = prev.items.filter(i => i._id !== itemId);
      return {
        ...prev,
        items: newItems,
        cookId: newItems.length === 0 ? null : prev.cookId,
        cookName: newItems.length === 0 ? '' : prev.cookName
      };
    });
  };

  const updateQuantity = (itemId, qty) => {
    if (qty < 1) return removeFromCart(itemId);
    setCart(prev => {
      const newItems = prev.items.map(i => i._id === itemId ? { ...i, qty } : i);
      return { ...prev, items: newItems };
    });
  };

  const clearCart = () => {
    setCart({ items: [], cookId: null, cookName: '' });
  };

  const getCartTotal = () => {
    return cart.items.reduce((total, item) => total + (item.price * item.qty), 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
