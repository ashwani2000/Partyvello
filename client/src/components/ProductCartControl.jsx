import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProductCartControl({
  product,
  iconOnly = false,
  className = '',
  addButtonClassName = '',
}) {
  const { cart, addToCart, updateCartItem, removeFromCart } = useApp();
  const quantity = cart.find((item) => item.id === product.id)?.quantity ?? 0;

  if (quantity === 0) {
    return (
      <button
        type="button"
        className={addButtonClassName}
        onClick={() => addToCart(product)}
        aria-label={`Add ${product.name} to cart`}
        title="Add to cart"
      >
        {iconOnly ? <ShoppingCart size={16} aria-hidden="true" /> : <><ShoppingCart size={15} aria-hidden="true" /> Add to Cart</>}
      </button>
    );
  }

  return (
    <div className={`cart-quantity-control ${iconOnly ? 'icon-only' : ''} ${className}`}>
      <button
        type="button"
        onClick={() => (quantity === 1 ? removeFromCart(product.id) : updateCartItem(product.id, quantity - 1))}
        aria-label={`Decrease ${product.name} quantity`}
        title="Decrease quantity"
      >
        <Minus size={15} aria-hidden="true" />
      </button>
      <span aria-live="polite" aria-label={`${quantity} in cart`}>{quantity}</span>
      <button
        type="button"
        onClick={() => addToCart(product)}
        aria-label={`Increase ${product.name} quantity`}
        title="Increase quantity"
      >
        <Plus size={15} aria-hidden="true" />
      </button>
      <button
        type="button"
        className="cart-quantity-delete"
        onClick={() => removeFromCart(product.id)}
        aria-label={`Remove ${product.name} from cart`}
        title="Remove from cart"
      >
        <Trash2 size={15} aria-hidden="true" />
      </button>
    </div>
  );
}
