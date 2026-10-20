import { useRef, useState } from 'react';
import { BadgePercent, ChevronLeft, ChevronRight, Gift, PartyPopper, ShoppingBag, Star, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useApp } from '../context/AppContext';

const budgetRanges = [
  { amount: 9, icon: Gift },
  { amount: 19, icon: PartyPopper },
  { amount: 29, icon: ShoppingBag },
  { amount: 49, icon: BadgePercent },
  { amount: 59, icon: Star },
  { amount: 99, icon: Tag },
  { amount: 149, icon: BadgePercent },
];

export default function BudgetLinks({ excludedAmounts = [] }) {
  const { products } = useApp();
  const sliderRef = useRef(null);
  const visibleRanges = budgetRanges.filter(({ amount }) => !excludedAmounts.includes(amount));
  const [selectedAmount, setSelectedAmount] = useState(visibleRanges[0]?.amount);
  const activeAmount = visibleRanges.some(({ amount }) => amount === selectedAmount)
    ? selectedAmount
    : visibleRanges[0]?.amount;
  const budgetProducts = products
    .filter((product) => product.budgetAmount === activeAmount)
    .sort((first, second) => first.price - second.price)
    .slice(0, 15);

  const slideProducts = (direction) => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({
      left: direction * sliderRef.current.clientWidth * 0.8,
      behavior: 'smooth',
    });
  };

  if (!visibleRanges.length) return null;

  return (
    <section className="budget-section section-block" aria-label="Shop by budget">
      <div className="section-heading">
        <span className="eyebrow">Shop by budget</span>
        <h2>Find party favorites at every price</h2>
      </div>
      <div className="home-category-browser budget-browser">
        <nav className="home-category-nav" aria-label="Choose a budget">
          {visibleRanges.map(({ amount, icon: Icon }) => (
            <button
              key={amount}
              type="button"
              className={`home-category-select ${activeAmount === amount ? 'active' : ''}`}
              aria-pressed={activeAmount === amount}
              onClick={() => {
                setSelectedAmount(amount);
                if (sliderRef.current) sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
              }}
            >
              <span className="home-category-select-icon"><Icon size={20} aria-hidden="true" /></span>
              <span>Under ₹{amount}</span>
            </button>
          ))}
        </nav>

        <div className="home-category-content">
          <div className="home-category-products-heading">
            <h3>Products under ₹{activeAmount}</h3>
            <div className="budget-slider-actions">
              <button type="button" className="budget-slider-arrow" onClick={() => slideProducts(-1)} aria-label="Previous products">
                <ChevronLeft size={18} />
              </button>
              <button type="button" className="budget-slider-arrow" onClick={() => slideProducts(1)} aria-label="Next products">
                <ChevronRight size={18} />
              </button>
              <Link to={`/products?budget=${activeAmount}`} className="text-link">
                View all <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          {budgetProducts.length ? (
            <div
              className={`home-category-products budget-product-grid ${activeAmount === 99 ? 'under-99-budget-products' : ''}`}
              ref={sliderRef}
            >
              {budgetProducts.map((product) => (
                <ProductCard key={product.id} product={product} homepageCompact />
              ))}
            </div>
          ) : (
            <p className="empty-state">No products are available in this budget yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
