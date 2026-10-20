import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCartControl from './ProductCartControl';

export default function ProductCard({
  product,
  homepageCompact = false,
  featuredCartIconOnly = false,
  catalogListing = false,
}) {
  return (
    <article className={`product-card ${homepageCompact ? 'homepage-compact-product-card' : ''} ${featuredCartIconOnly ? 'featured-home-product-card' : ''} ${catalogListing ? 'catalog-listing-product-card' : ''}`}>
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" />
        <span className={`stock-badge ${product.stock === 0 ? 'out' : ''}`}>
          {product.stock === 0 ? 'Out of stock' : 'In stock'}
        </span>
      </div>

      <div className="product-content">
        <div className="product-meta-row">
          {!homepageCompact && <span>{product.category}</span>}
          <span className="rating">
            <Star size={15} fill="currentColor" /> {product.rating}
          </span>
        </div>

        <h3>{product.name}</h3>
        {!homepageCompact && <p className="sku">SKU: {product.sku}</p>}

        <div className="price-row">
          <strong>₹{product.wholesalePrice}</strong>
          {(homepageCompact || featuredCartIconOnly) && (
            <ProductCartControl
              product={product}
              iconOnly
              addButtonClassName="homepage-compact-cart featured-home-cart"
            />
          )}
          <span>₹{product.price}</span>
          {catalogListing && (
            <ProductCartControl
              product={product}
              iconOnly
              className="catalog-cart-control"
              addButtonClassName="catalog-mobile-cart"
            />
          )}
        </div>

        <div className="product-actions">
          {!homepageCompact && !featuredCartIconOnly && (
            <ProductCartControl
              product={product}
              className={catalogListing ? 'catalog-desktop-cart' : ''}
              addButtonClassName="primary-btn"
            />
          )}
          <Link to={`/product/${product.id}`} state={{ product }} className="secondary-link">
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
