import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { sampleProducts } from '../data/products';
import { API_BASE_URL } from '../api/auth';

const AppContext = createContext(null);
const CART_KEY = 'partypops-cart';
const USER_KEY = 'partypops-user';
const TOKEN_KEY = 'partypops-token';

export function AppProvider({ children }) {
  const [products] = useState(sampleProducts);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem(CART_KEY);
    return saved
      ? JSON.parse(saved).map((item) => ({ ...item, price: item.wholesalePrice ?? item.price }))
      : [];
  });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    if (!saved) return null;

    try {
      const savedUser = JSON.parse(saved);
      if (!savedUser.id && !savedUser.fullName) return null;
      return { ...savedUser, name: savedUser.name || savedUser.fullName || savedUser.email };
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const addToCart = (product, quantity = 1) => {
    setCart((current) => {
      const existingItem = current.find((item) => item.id === product.id);
      if (existingItem) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock || 99) }
            : item,
        );
      }
      return [...current, { ...product, price: product.wholesalePrice ?? product.price, quantity }];
    });
  };

  const updateCartItem = (productId, quantity) => {
    setCart((current) =>
      current
        .map((item) => (item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const setAuthenticatedUser = (authenticatedUser, token) => {
    const profile = {
      ...authenticatedUser,
      name: authenticatedUser.name || authenticatedUser.fullName || authenticatedUser.email,
    };
    setUser(profile);
    if (token) localStorage.setItem(TOKEN_KEY, token);
  };

  const logoutUser = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      products,
      cart,
      user,
      setUser,
      setAuthenticatedUser,
      addToCart,
      removeFromCart,
      updateCartItem,
      clearCart,
      logoutUser,
      cartCount,
      subtotal,
    }),
    [products, cart, user, cartCount, subtotal],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return context;
}
