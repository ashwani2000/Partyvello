import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useApp();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleCheckout = () => {
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="container page-block empty-state-card">
        <h1>Order confirmed!</h1>
        <p>Your birthday order is now in our fulfillment queue. A confirmation email is on the way.</p>
        <Link to="/products" className="primary-btn">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="container page-block checkout-page">
      <div className="section-heading">
        <h1>Checkout</h1>
      </div>

      <div className="checkout-layout">
        <form className="form-card" onSubmit={(event) => { event.preventDefault(); handleCheckout(); }}>
          <div className="form-grid two-col">
            <label>
              Full name
              <input required />
            </label>
            <label>
              Email
              <input type="email" required />
            </label>
            <label>
              Phone
              <input required />
            </label>
            <label>
              City
              <input required />
            </label>
          </div>
          <label>
            Street address
            <input required />
          </label>
          <button type="submit" className="primary-btn full-width">Place order</button>
        </form>

        <aside className="summary-card">
          <h3>Order summary</h3>
          {cart.map((item) => (
            <div key={item.id} className="summary-row">
              <span>{item.name} × {item.quantity}</span>
              <strong>₹{item.price * item.quantity}</strong>
            </div>
          ))}
          <div className="summary-row total"><span>Total</span><strong>₹{subtotal}</strong></div>
        </aside>
      </div>
    </div>
  );
}
