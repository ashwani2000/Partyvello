import { BadgePercent, Gift, PartyPopper, ShoppingBag, Star, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  const visibleRanges = budgetRanges.filter(({ amount }) => !excludedAmounts.includes(amount));

  return (
    <section className="budget-section" aria-label="Shop by budget">
      <div className="category-grid budget-grid">
        {visibleRanges.map(({ amount, icon: Icon }) => (
          <article key={amount} className="category-card budget-card">
            <Link to={`/products?budget=${amount}`} className="budget-card-heading">
              <span className="budget-icon"><Icon size={30} aria-hidden="true" /></span>
              <span>Under ₹{amount}</span>
            </Link>
            <ul className="budget-product-list">
              {products
                .filter((product) => product.budgetAmount === amount)
                .sort((a, b) => a.price - b.price)
                .slice(0, 4)
                .map((product) => (
                  <li key={product.id}>
                    <Link className="budget-product-card" to={`/product/${product.id}`}>
                      <img src={product.image} alt={product.name} loading="lazy" />
                      <span className="budget-product-details">
                        <span className="budget-product-category">{product.category}</span>
                        <span className="budget-product-name">{product.name}</span>
                        <span className="budget-product-description">{product.description}</span>
                        <strong>₹{product.price}</strong>
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
