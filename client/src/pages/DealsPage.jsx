import { Balloon, Gift, Package, PartyPopper, Sparkles, Star } from 'lucide-react';
import BudgetLinks from '../components/BudgetLinks';
import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';

const dealSections = [
  { category: 'Balloons', title: 'Balloons', icon: Balloon },
  { category: 'Tableware', title: 'Party Supply', icon: PartyPopper },
  { category: 'Decorations', title: 'Decoration Special', icon: Sparkles },
  { category: 'Return Gifts', title: 'Return Gifts', icon: Gift },
  { category: 'Cake Toppers', title: 'Cake Toppers', icon: Star },
  { category: 'Accessories', title: 'Accessories', icon: Package },
];

export default function DealsPage() {
  const { products } = useApp();

  return (
    <div className="container page-block deals-page">
      <div className="section-heading">
        <span className="eyebrow">Party Vello offers</span>
        <h1>Deals for every celebration</h1>
      </div>

      <BudgetLinks />

      {dealSections.map(({ category, title, icon: Icon }) => {
        const sectionProducts = products.filter((product) => product.category === category);

        return (
          <section key={category} className="deals-category-section">
            <div className="deals-category-heading">
              <span className="deals-category-icon"><Icon size={25} aria-hidden="true" /></span>
              <div>
                <h2>{title}</h2>
                <span>{sectionProducts.length} items</span>
              </div>
            </div>
            <div className="product-grid three-col">
              {sectionProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
