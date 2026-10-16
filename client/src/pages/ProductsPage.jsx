import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';

const categoryMap = {
  decorations: 'Decorations',
  'balloons-party-supplies': 'Balloons',
  'return-gifts-accessories': 'Return Gifts',
};

export default function ProductsPage() {
  const { products } = useApp();
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const queryCategory = searchParams.get('category');
  const budgetAmount = Number(searchParams.get('budget'));
  const maxPrice = Number(searchParams.get('maxPrice'));
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(categorySlug ? categoryMap[categorySlug] || 'all' : queryCategory || 'all');
  const [sort, setSort] = useState('popular');
  const [availability, setAvailability] = useState('all');

  useEffect(() => {
    setCategory(categorySlug ? categoryMap[categorySlug] || 'all' : queryCategory || 'all');
  }, [categorySlug, queryCategory]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (category !== 'all') {
      list = list.filter((product) => product.category === category);
    }

    if (budgetAmount > 0) {
      list = list.filter((product) => product.budgetAmount === budgetAmount);
    } else if (maxPrice > 0) {
      list = list.filter((product) => product.price < maxPrice);
    }

    if (search) {
      list = list.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.sku.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (availability === 'in-stock') {
      list = list.filter((product) => product.stock > 0);
    }

    if (sort === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      list.sort((a, b) => b.id.localeCompare(a.id));
    } else {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, search, category, sort, availability, budgetAmount, maxPrice]);
  const categoryHeading = category === 'Tableware' ? 'Party Supply' : category;

  return (
    <div className="container page-block content-page">
      <div className="section-heading row-between">
        <div>
          <span className="eyebrow">
            {budgetAmount > 0 ? 'Shop by budget' : category !== 'all' ? 'Shop by category' : 'Curated collection'}
          </span>
          <h1>
            {budgetAmount > 0
              ? `Products under ₹${budgetAmount}`
              : categoryHeading || 'Birthday products'}
          </h1>
        </div>
        <Link to="/" className="secondary-btn small-btn">Back home</Link>
      </div>

      <div className="filters-card">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or SKU"
        />

        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">All categories</option>
          {[...new Set(products.map((item) => item.category))].map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="popular">Popularity</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
          <option value="newest">Newest</option>
        </select>

        <select value={availability} onChange={(event) => setAvailability(event.target.value)}>
          <option value="all">All availability</option>
          <option value="in-stock">In stock</option>
        </select>
      </div>

      <div className="product-grid three-col">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && <p className="empty-state">No products match the selected filters.</p>}
    </div>
  );
}
