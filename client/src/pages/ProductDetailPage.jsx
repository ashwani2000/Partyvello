import { Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { products, addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);

  const product = useMemo(() => products.find((item) => item.id === id), [products, id]);

  if (!product) {
    return <div className="container page-block">Product not found.</div>;
  }

  return (
    <div className="container page-block product-detail-page">
      <Link to="/products" className="secondary-btn small-btn">Back to products</Link>

      <div className="detail-layout">
        <div className="detail-image-wrap">
          <img src={product.image} alt={product.name} className="detail-image" />
        </div>

        <div className="detail-info">
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="detail-meta">
            <span><Star size={15} fill="currentColor" /> {product.rating}</span>
            <span>SKU: {product.sku}</span>
          </div>

          <div className="price-stack">
            <strong>₹{product.wholesalePrice}</strong>
            <span>Retail: ₹{product.price}</span>
          </div>

          <p className="detail-description">{product.description}</p>

          <div className="quantity-picker">
            <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
              <Minus size={16} />
            </button>
            <span>{quantity}</span>
            <button type="button" onClick={() => setQuantity((value) => value + 1)}>
              <Plus size={16} />
            </button>
          </div>

          <div className="detail-actions">
            <button type="button" className="primary-btn" onClick={() => addToCart(product, quantity)}>
              <ShoppingCart size={16} /> Add to cart
            </button>
            <Link to="/checkout" className="secondary-btn">Buy now</Link>
          </div>

          <div className="status-box">
            <strong>Status:</strong> {product.stock > 0 ? `In stock (${product.stock} left)` : 'Out of stock'}
          </div>
        </div>
      </div>
    </div>
  );
}
