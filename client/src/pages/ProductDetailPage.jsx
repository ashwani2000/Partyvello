import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import ProductCartControl from '../components/ProductCartControl';

export default function ProductDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const { products } = useApp();
  const [activeGalleryGroup, setActiveGalleryGroup] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const mobileGalleryRef = useRef(null);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const product = useMemo(() => {
    const catalogProduct = products.find((item) => String(item.id) === id);
    if (catalogProduct) return catalogProduct;

    const linkedProduct = location.state?.product;
    return linkedProduct && String(linkedProduct.id) === id ? linkedProduct : undefined;
  }, [products, id, location.state]);
  const galleryGroups = useMemo(() => {
    if (!product) return [];

    const availableImages = [...new Set([
      product.image,
      ...(Array.isArray(product.images) ? product.images : []),
      ...products
        .filter((item) => String(item.id) !== String(product.id) && item.category === product.category)
        .map((item) => item.image),
      ...products
        .filter((item) => String(item.id) !== String(product.id) && item.category !== product.category)
        .map((item) => item.image),
    ].filter((image) => typeof image === 'string' && image.length > 0))];

    if (!availableImages.length) return [];

    return Array.from({ length: 4 }, (_, groupIndex) =>
      Array.from({ length: 4 }, (_, imageIndex) =>
        availableImages[(groupIndex * 4 + imageIndex) % availableImages.length],
      ),
    );
  }, [product, products]);
  const galleryImages = galleryGroups[activeGalleryGroup] ?? [];
  const relatedProducts = useMemo(() => {
    if (!product) return [];

    const otherProducts = products.filter((item) => String(item.id) !== String(product.id));
    return [
      ...otherProducts.filter((item) => item.category === product.category),
      ...otherProducts.filter((item) => item.category !== product.category),
    ].slice(0, 4);
  }, [product, products]);

  const showImage = (index) => {
    const track = mobileGalleryRef.current;
    if (track) track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' });
  };
  const showGalleryGroup = (index) => {
    setActiveGalleryGroup(index);
    setActiveImage(0);
    const track = mobileGalleryRef.current;
    if (track) track.scrollTo({ left: 0, behavior: 'smooth' });
  };
  const slideGallery = (direction) => {
    const nextIndex = (activeImage + direction + galleryImages.length) % galleryImages.length;
    showImage(nextIndex);
  };

  if (!product) {
    return <div className="container page-block">Product not found.</div>;
  }

  return (
    <div className="container page-block product-detail-page">
      <Link
        to="/products"
        className="product-detail-back-button"
        aria-label="Back to products"
        title="Back to products"
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </Link>

      <div className="detail-layout">
        <div className="product-gallery">
          <div className="product-gallery-frame">
            <div
              className="product-gallery-track"
              ref={mobileGalleryRef}
              role="region"
              aria-label={`${product.name} photos`}
              tabIndex={0}
              onScroll={(event) => {
                const track = event.currentTarget;
                setActiveImage(Math.round(track.scrollLeft / track.clientWidth));
              }}
            >
              {galleryImages.map((image, index) => (
                <div className="product-gallery-slide" key={`${image}-${index}`}>
                  <img src={image} alt={`${product.name} view ${index + 1}`} />
                </div>
              ))}
            </div>
            {galleryImages.length > 0 && (
              <>
                <button
                  type="button"
                  className="product-gallery-arrow previous"
                  aria-label="Previous product image"
                  onClick={() => slideGallery(-1)}
                >
                  <ChevronLeft size={22} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="product-gallery-arrow next"
                  aria-label="Next product image"
                  onClick={() => slideGallery(1)}
                >
                  <ChevronRight size={22} aria-hidden="true" />
                </button>
              </>
            )}
          </div>
          <div className="product-gallery-dots" aria-label="Choose a product image">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                type="button"
                className={activeImage === index ? 'active' : ''}
                aria-label={`Show image ${index + 1}`}
                aria-current={activeImage === index ? 'true' : undefined}
                onClick={() => showImage(index)}
              />
            ))}
          </div>
          {galleryGroups.length > 0 && (
            <div className="product-gallery-thumbnails" role="group" aria-label="Choose a product image">
              {galleryGroups.map((images, index) => (
                <button
                  key={`${images[0]}-${index}`}
                  type="button"
                  className={`product-gallery-thumbnail ${activeGalleryGroup === index ? 'active' : ''}`}
                  aria-label={`Show image set ${index + 1}`}
                  aria-pressed={activeGalleryGroup === index}
                  onClick={() => showGalleryGroup(index)}
                >
                  <img src={images[0]} alt="" />
                </button>
              ))}
            </div>
          )}
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

          <div className="detail-actions">
            <ProductCartControl product={product} addButtonClassName="primary-btn" />
            <Link to="/checkout" className="secondary-btn">Buy now</Link>
          </div>

          <div className="status-box">
            <strong>Status:</strong> {product.stock > 0 ? `In stock (${product.stock} left)` : 'Out of stock'}
          </div>
        </div>
      </div>

      <section className="product-specification" aria-labelledby="product-specification-heading">
        <h2 id="product-specification-heading">Product Specification</h2>
        <dl className="product-specification-list">
          <div>
            <dt>Category</dt>
            <dd>{product.category}</dd>
          </div>
          <div>
            <dt>SKU</dt>
            <dd>{product.sku}</dd>
          </div>
          <div>
            <dt>Retail Price</dt>
            <dd>₹{product.price}</dd>
          </div>
          <div>
            <dt>Wholesale Price</dt>
            <dd>₹{product.wholesalePrice}</dd>
          </div>
          <div>
            <dt>Availability</dt>
            <dd>{product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'}</dd>
          </div>
        </dl>
        <p className="product-specification-description">
          {product.description || `Explore the ${product.name}, available in the ${product.category} collection.`}
        </p>
      </section>

      {relatedProducts.length > 0 && (
        <section className="related-products" aria-labelledby="related-products-heading">
          <h2 id="related-products-heading">You may also like</h2>
          <div className="product-grid related-products-grid">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} catalogListing />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
