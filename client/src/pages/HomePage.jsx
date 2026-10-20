import { ArrowRight, BadgePercent, Balloon, ChevronLeft, ChevronRight, Gift, Package, PartyPopper, ShieldCheck, ShoppingBag, Sparkles, Truck } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import BudgetLinks from '../components/BudgetLinks';
import DiwaliSaleCard from '../components/DiwaliSaleCard';
import ProductCard from '../components/ProductCard';
import NavratriSlider from '../components/NavratriSlider';
import { useApp } from '../context/AppContext';

const reasons = [
  { icon: ShieldCheck, title: 'Quality products', text: 'Curated party essentials with trusted sourcing.' },
  { icon: BadgePercent, title: 'Affordable pricing', text: 'Smart pricing for birthdays, school events, and family gatherings.' },
  { icon: ShoppingBag, title: 'Retail & wholesale', text: 'Flexible purchase models for both established stores and bulk buyers.' },
  { icon: Truck, title: 'Reliable order processing', text: 'On-time dispatch and secure order handling for every purchase.' },
];

const testimonials = [
  { name: 'Nisha K.', quote: 'Amazing balloon setup and customer support. The entire delivery experience felt premium.', rating: 5 },
  { name: 'Karan P.', quote: 'Our retail orders are running smoothly with Party Vello. Easy catalogue and faster fulfilment.', rating: 5 },
  { name: 'Sonia M.', quote: 'The quality for our event decorations felt exceptional and worth every rupee.', rating: 4 },
];

const homeCategories = [
  { name: 'Balloons', category: 'Balloons', to: '/products/balloons-party-supplies', icon: Balloon },
  { name: 'Party Supply', category: 'Tableware', to: '/products?category=Tableware', icon: PartyPopper },
  { name: 'Decoration', category: 'Decorations', to: '/products/decorations', icon: Sparkles },
  { name: 'Return Gift', category: 'Return Gifts', to: '/products/return-gifts-accessories', icon: Gift },
  { name: 'Accessories', category: 'Accessories', to: '/products?category=Accessories', icon: Package },
];

export default function HomePage() {
  const { products } = useApp();
  const categorySliderRef = useRef(null);
  const categories = [
    ...homeCategories,
    ...[...new Set(products.map((product) => product.category).filter(Boolean))]
      .filter((category) => !homeCategories.some(
        (item) => item.category.toLowerCase() === category.toLowerCase(),
      ))
      .map((category) => ({
        name: category,
        category,
        to: `/products?category=${encodeURIComponent(category)}`,
        icon: Package,
      })),
  ];
  const [selectedCategory, setSelectedCategory] = useState(homeCategories[0]);
  const matchingCategoryProducts = products
    .filter((product) => selectedCategory.budgetAmount
      ? product.budgetAmount === selectedCategory.budgetAmount
      : product.category?.toLowerCase() === selectedCategory.category.toLowerCase())
    .slice(0, 15);
  const categoryProducts = selectedCategory.category === 'Tableware'
    ? matchingCategoryProducts.slice(1)
    : selectedCategory.category === 'Cake Toppers' && matchingCategoryProducts.length > 1
      ? matchingCategoryProducts.map(() => matchingCategoryProducts[1])
      : matchingCategoryProducts;
  const featuredProducts = [
    ...products.filter((item) => item.featured),
    ...products.filter((item) => !item.featured),
  ].slice(0, 6);
  const dealProducts = products
    .filter((item) => item.stock > 0 && item.wholesalePrice < item.price)
    .slice(0, 6);
  const slideCategoryProducts = (direction) => {
    if (!categorySliderRef.current) return;
    categorySliderRef.current.scrollBy({
      left: direction * categorySliderRef.current.clientWidth * 0.8,
      behavior: 'smooth',
    });
  };

  return (
    <div className="page-block">
      <NavratriSlider />

      <div className="container"><BudgetLinks excludedAmounts={[9]} /></div>

      <section className="hero-section container">
        <div className="hero-copy">
          <span className="eyebrow">Birthday essentials • party supplies • gifting</span>
          <h1>Make Every Birthday Extra Special!</h1>
          <p>
            Discover premium birthday decorations, balloon kits, cake toppers, party tableware, return gifts, and celebration accessories designed for joyful memories.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="primary-btn">
              Shop Products <ArrowRight size={18} />
            </Link>
            <Link to="/register?role=wholesaler" className="secondary-btn">
              Explore Wholesale
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80"
            alt="Birthday party setup"
          />
        </div>
      </section>

      <DiwaliSaleCard />

      <section className="container section-block">
        <div className="section-heading">
          <span className="eyebrow">Shop by category</span>
          <h2>Everything you need for a perfect celebration</h2>
        </div>
        <div className="home-category-browser">
          <nav className="home-category-nav" aria-label="Browse products by category">
            {categories.map(({ name, icon: Icon, ...category }) => (
              <button
                key={name}
                type="button"
                className={`home-category-select ${selectedCategory.name === name ? 'active' : ''}`}
                aria-pressed={selectedCategory.name === name}
                onClick={() => {
                  setSelectedCategory({ name, icon: Icon, ...category });
                  if (categorySliderRef.current) {
                    categorySliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                  }
                }}
              >
                <span className="home-category-select-icon"><Icon size={20} aria-hidden="true" /></span>
                <span>{name}</span>
              </button>
            ))}
          </nav>

          <div className="home-category-content">
            <div className="home-category-products-heading">
              <h3>{selectedCategory.name}</h3>
              <div className="budget-slider-actions">
                <button type="button" className="budget-slider-arrow" onClick={() => slideCategoryProducts(-1)} aria-label="Previous category products">
                  <ChevronLeft size={18} />
                </button>
                <button type="button" className="budget-slider-arrow" onClick={() => slideCategoryProducts(1)} aria-label="Next category products">
                  <ChevronRight size={18} />
                </button>
                <Link to={selectedCategory.to} className="text-link">View all <ArrowRight size={16} /></Link>
              </div>
            </div>
            <div className="home-category-products uploaded-product-grid" ref={categorySliderRef}>
              {categoryProducts.map((product, index) => (
                <ProductCard key={`${product.id}-${index}`} product={product} homepageCompact />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container section-block">
        <div className="section-heading row-between">
          <div>
            <span className="eyebrow">Featured collection</span>
            <h2>Top picks for birthdays</h2>
          </div>
          <Link to="/products" className="text-link">View all products</Link>
        </div>

        <div className="product-grid three-col featured-home-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} featuredCartIconOnly />
          ))}
        </div>
      </section>

      <section className="container section-block deals-section">
        <div className="section-heading row-between">
          <div>
            <span className="eyebrow">Three separate deals</span>
            <h2>Party favorites, better in bulk</h2>
          </div>
          <Link to="/products" className="text-link">Browse all products</Link>
        </div>
        <div className="deal-grid">
          {dealProducts.map((product) => (
            <article key={product.id} className="deal-card">
              <Link to={`/product/${product.id}`} className="deal-image-link" aria-label={`View ${product.name}`}>
                <img src={product.image} alt={product.name} className="deal-image" />
                <span className="deal-badge"><BadgePercent size={15} /> Bulk deal</span>
              </Link>
              <div className="deal-copy">
                <span className="deal-category">{product.category}</span>
                <h3><Link to={`/product/${product.id}`}>{product.name}</Link></h3>
                <div className="deal-prices">
                  <div>
                    <span>Retail</span>
                    <strong>₹{product.price.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="wholesale-price">
                    <span>Wholesale</span>
                    <strong>₹{product.wholesalePrice.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
                <Link to={`/product/${product.id}`} className="deal-link">
                  View deal <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container section-block">
        <div className="section-heading">
          <span className="eyebrow">Why choose us</span>
          <h2>Trusted by families, retailers, and event planners</h2>
        </div>
        <div className="reasons-grid">
          {reasons.map(({ icon: Icon, title, text }) => (
            <div key={title} className="reason-card">
              <div className="icon-badge"><Icon size={20} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container section-block bright-panel">
        <div className="two-column-panel">
          <div>
            <span className="eyebrow">Retailer & wholesaler</span>
            <h2>Built for everyday shoppers and bulk buyers</h2>
            <p>
              Unlock better pricing, quick reorder workflows, and personalized support when you partner with us for larger celebrations and repeat orders.
            </p>
          </div>
          <div className="panel-actions">
            <Link to="/login?role=retailer" className="secondary-btn">
              Retailer Login
            </Link>
            <Link to="/login?role=wholesaler" className="primary-btn">
              Wholesaler Login
            </Link>
            <Link to="/register" className="text-link">Become a Wholesale Partner</Link>
          </div>
        </div>
      </section>

      <section className="container section-block promo-banner">
        <div>
          <span className="eyebrow">Seasonal offer</span>
          <h2>Save up to 30% on bulk birthday party bundles</h2>
        </div>
        <Link to="/products" className="primary-btn">
          View deals <Gift size={18} />
        </Link>
      </section>

      <section className="container section-block testimonials-block">
        <div className="section-heading">
          <span className="eyebrow">Customer love</span>
          <h2>What customers say</h2>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <div key={item.name} className="testimonial-card">
              <div className="stars">{'★'.repeat(item.rating)}</div>
              <p>“{item.quote}”</p>
              <strong>{item.name}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
