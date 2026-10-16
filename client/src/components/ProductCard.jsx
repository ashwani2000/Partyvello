import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProductCard({ product }) {
  const { addToCart } = useApp();

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" />
        <span className={`stock-badge ${product.stock === 0 ? 'out' : ''}`}>
          {product.stock === 0 ? 'Out of stock' : 'In stock'}
        </span>
      </div>

      <div className="product-content">
        <div className="product-meta-row">
          <span>{product.category}</span>
          <span className="rating">
            <Star size={15} fill="currentColor" /> {product.rating}
          </span>
        </div>

        <h3>{product.name}</h3>
        <p className="sku">SKU: {product.sku}</p>

        <div className="price-row">
          <strong>₹{product.wholesalePrice}</strong>
          <span>₹{product.price}</span>
        </div>

        <div className="product-actions">
          <button type="button" className="primary-btn" onClick={() => addToCart(product)}>
            <ShoppingCart size={15} /> Add to Cart
          </button>
          <Link to={`/product/${product.id}`} className="secondary-link">
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
