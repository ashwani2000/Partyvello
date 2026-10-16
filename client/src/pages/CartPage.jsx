import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function CartPage() {
  const { cart, removeFromCart, updateCartItem, subtotal } = useApp();

  if (cart.length === 0) {
    return (
      <div className="container page-block empty-state-card">
        <h1>Your cart is empty</h1>
        <Link to="/products" className="primary-btn">Explore products</Link>
      </div>
    );
  }

  return (
    <div className="container page-block cart-page">
      <div className="section-heading">
        <h1>Shopping cart</h1>
      </div>

      <div className="cart-layout">
        <div className="cart-items-list">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-copy">
                <h3>{item.name}</h3>
                <p>₹{item.price} each</p>
                <div className="quantity-inline">
                  <button type="button" onClick={() => updateCartItem(item.id, item.quantity - 1)}>
                    <Minus size={14} />
                  </button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => updateCartItem(item.id, item.quantity + 1)}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className="cart-item-actions">
                <strong>₹{item.price * item.quantity}</strong>
                <button type="button" onClick={() => removeFromCart(item.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="summary-card">
          <h3>Order summary</h3>
          <div className="summary-row"><span>Subtotal</span><strong>₹{subtotal}</strong></div>
          <div className="summary-row"><span>Shipping</span><strong>₹0</strong></div>
          <div className="summary-row total"><span>Total</span><strong>₹{subtotal}</strong></div>
          <Link to="/checkout" className="primary-btn full-width">Proceed to checkout</Link>
        </aside>
      </div>
    </div>
  );
}
