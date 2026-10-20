import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';

const categoryMap = {
  decorations: 'Decorations',
  'balloons-party-supplies': 'Balloons',
  'return-gifts-accessories': 'Return Gifts',
};

const curatedCollectionItems = [
  'HBD Banner',
  'Crown',
  'Candles',
  'Poppers & Snow Spray',
  'Tape',
  'Curtains',
  'Arch Strip',
  'Ribbens',
  'Anniversary',
];

const buildCuratedCollectionProducts = (item) => Array.from({ length: 15 }, (_, index) => {
  const title = `${item} ${index + 1}`;
  const accent = ['Pink', 'Gold', 'Pastel', 'Premium', 'Luxury'][index % 5];

  return {
    id: `${item.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index + 1}`,
    name: title,
    sku: `${item.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(2, '0')}`,
    category: item,
    price: 299 + ((index * 71) % 520),
    wholesalePrice: 209 + ((index * 53) % 340),
    description: `${accent} ${item} pack designed for celebration styling, gifting, and party décor.`,
    stock: 10 + (index % 18),
    rating: 4.3 + ((index % 5) * 0.1),
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80',
    featured: index % 3 === 0,
    availability: 'In Stock',
  };
});

const balloonFilterOptions = [
  'Standard',
  'Matellic',
  'Latex',
  'Balloon Pump',
  'Foil Balloons',
  'Star',
  'Diamond',
  'Number Foil',
  'Baby Boy',
  'Animal Shap',
];

const hbdBannerFilterOptions = [
  'Small Size',
  'Medium Size',
  'Paper Banner',
  'Foil Banner',
  'Non-Foil',
  'Decorative Net',
];

const tapeFilterOptions = ['Glue Tape', 'Double Sided Tape'];
const ribbonFilterOptions = {
  Ribbens: ['HBD Girls Ribben', 'HBD Boys Ribben'],
  Anniversary: ['Anniversary Ribben'],
};

const normalizeFilterValue = (value = '') => value.toLowerCase().replace(/[^a-z0-9]+/g, '');

const keywordGroups = {
  Standard: ['standard', 'classic'],
  Matellic: ['matellic', 'metallic', 'gold'],
  Latex: ['latex'],
  'Balloon Pump': ['balloonpump', 'pump'],
  'Foil Balloons': ['foil', 'foilballoon'],
  Star: ['star'],
  Diamond: ['diamond'],
  'Number Foil': ['numberfoil', 'number'],
  'Baby Boy': ['babyboy', 'boy'],
  'Animal Shap': ['animal', 'shape', 'animalshap'],
};

const hbdBannerKeywordGroups = {
  'Small Size': ['small', 'mini', 'compact'],
  'Medium Size': ['medium', 'regular', 'standard'],
  'Paper Banner': ['paper', 'paperbanner'],
  'Foil Banner': ['foil', 'foilbanner'],
  'Non-Foil': ['nonfoil', 'nonfoilbanner'],
  'Decorative Net': ['decorativenet', 'net', 'mesh'],
};

const matchesTapeFilter = (product, selectedFilter) => {
  if (!selectedFilter || selectedFilter === 'all') return true;

  return normalizeFilterValue(product.name).includes(normalizeFilterValue(selectedFilter));
};

const matchesBalloonFilter = (product, selectedFilter) => {
  if (!selectedFilter || selectedFilter === 'all') return true;

  const haystack = normalizeFilterValue(product.name);
  const keywords = keywordGroups[selectedFilter] ?? [normalizeFilterValue(selectedFilter)];

  return keywords.some((keyword) => haystack.includes(keyword));
};

const matchesHbdBannerFilter = (product, selectedFilter) => {
  if (!selectedFilter || selectedFilter === 'all') return true;

  const haystack = normalizeFilterValue(product.name);
  const keywords = hbdBannerKeywordGroups[selectedFilter] ?? [normalizeFilterValue(selectedFilter)];

  return keywords.some((keyword) => haystack.includes(keyword));
};

const buildBalloonVariantProducts = (selectedFilter) => {
  const baseNames = [
    'Classic Birthday Balloon Mix',
    'Royal Metallic Balloon Pack',
    'Latex Balloon Garland',
    'Portable Balloon Pump Kit',
    'Foil Balloon Celebration Set',
    'Starry Night Balloon Pack',
    'Diamond Shine Balloon Bundle',
    'Number Foil Balloon Set',
    'Baby Boy Balloon Kit',
    'Animal Shape Balloon Collection',
    'Premium Party Balloon Combo',
    'Pastel Balloon Fest Pack',
    'Luxury Balloon Decor Set',
    'Glossy Balloon Stack',
    'Festive Balloon Surprise Box',
  ];

  const relevantBaseName = selectedFilter === 'all' ? 'Premium Balloon Pack' : selectedFilter;

  return Array.from({ length: 15 }, (_, index) => {
    const productName = selectedFilter === 'all'
      ? `${relevantBaseName} ${index + 1}`
      : `${baseNames[index % baseNames.length]} ${index + 1}`;

    return {
      id: `balloon-${selectedFilter}-${index + 1}`,
      name: productName,
      sku: `BAL-${selectedFilter.toString().slice(0, 3).toUpperCase()}-${String(index + 1).padStart(2, '0')}`,
      category: 'Balloons',
      price: 399 + ((index * 97) % 450),
      wholesalePrice: 259 + ((index * 67) % 280),
      description: `Balloon collection for ${selectedFilter === 'all' ? 'party styling' : selectedFilter.toLowerCase()} designs and festive decor.`,
      stock: 12 + (index % 16),
      rating: 4.3 + ((index % 5) * 0.1),
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80',
      featured: index % 3 === 0,
      availability: 'In Stock',
    };
  });
};

const buildHbdBannerVariantProducts = (selectedFilter) => {
  const baseNames = [
    'Small Birthday Banner Pack',
    'Medium Party Banner Set',
    'Paper Banner Celebration Kit',
    'Foil Birthday Banner Bundle',
    'Non-Foil Banner Collection',
    'Decorative Net Banner Pack',
    'Premium HBD Welcome Banner',
    'Personalized HBD Banner Pack',
    'Birthday Arch Banner Combo',
    'HBD Backdrop Banner Kit',
    'Festive Paper Banner Set',
    'Cake Table Banner Design',
    'Luxury HBD Banner Pack',
    'Color Pop Banner Bundle',
    'HBD Banner Surprise Kit',
  ];

  return Array.from({ length: 15 }, (_, index) => {
    const productName = selectedFilter === 'all'
      ? `${baseNames[index % baseNames.length]} ${index + 1}`
      : `${baseNames[index % baseNames.length]} ${index + 1}`;

    return {
      id: `hbd-banner-${selectedFilter}-${index + 1}`,
      name: productName,
      sku: `HBD-${selectedFilter.toString().slice(0, 3).toUpperCase()}-${String(index + 1).padStart(2, '0')}`,
      category: 'HBD Banner',
      price: 299 + ((index * 59) % 360),
      wholesalePrice: 199 + ((index * 41) % 220),
      description: `HBD banner collection for ${selectedFilter === 'all' ? 'birthday celebration decor' : selectedFilter.toLowerCase()} styling.`,
      stock: 9 + (index % 17),
      rating: 4.2 + ((index % 6) * 0.1),
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80',
      featured: index % 4 === 0,
      availability: 'In Stock',
    };
  });
};

const buildTapeVariantProducts = (selectedFilter) => Array.from({ length: 15 }, (_, index) => {
  const tapeType = selectedFilter === 'all'
    ? tapeFilterOptions[index % tapeFilterOptions.length]
    : selectedFilter;

  return {
    id: `tape-${normalizeFilterValue(tapeType)}-${index + 1}`,
    name: `${tapeType} ${['Party Decor', 'Craft', 'Premium', 'Clear', 'Strong Hold'][index % 5]} Tape Roll ${index + 1}`,
    sku: `TAPE-${normalizeFilterValue(tapeType).slice(0, 3).toUpperCase()}-${String(index + 1).padStart(2, '0')}`,
    category: 'Tape',
    price: 99 + ((index * 37) % 220),
    wholesalePrice: 69 + ((index * 23) % 140),
    description: `${tapeType} for party decorations, crafts, and celebration setups.`,
    stock: 10 + (index % 18),
    rating: 4.2 + ((index % 6) * 0.1),
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80',
    featured: index % 3 === 0,
    availability: 'In Stock',
  };
});

const buildRibbonProducts = (category, selectedFilter) => {
  const options = ribbonFilterOptions[category];

  return Array.from({ length: 15 }, (_, index) => {
    const ribbonType = selectedFilter === 'all'
      ? options[index % options.length]
      : selectedFilter;

    return {
      id: `${normalizeFilterValue(category)}-${normalizeFilterValue(ribbonType)}-${index + 1}`,
      name: `${ribbonType} ${['Satin', 'Decorative', 'Premium', 'Printed', 'Party'][index % 5]} Ribbon ${index + 1}`,
      sku: `${normalizeFilterValue(category).slice(0, 3).toUpperCase()}-${normalizeFilterValue(ribbonType).slice(0, 3).toUpperCase()}-${String(index + 1).padStart(2, '0')}`,
      category,
      price: 149 + ((index * 43) % 260),
      wholesalePrice: 99 + ((index * 29) % 170),
      description: `${ribbonType} for birthday and celebration decorations.`,
      stock: 10 + (index % 18),
      rating: 4.2 + ((index % 6) * 0.1),
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80',
      featured: index % 3 === 0,
      availability: 'In Stock',
    };
  });
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
  const [selectedBalloonFilter, setSelectedBalloonFilter] = useState('all');
  const [selectedHbdBannerFilter, setSelectedHbdBannerFilter] = useState('all');
  const [selectedTapeFilter, setSelectedTapeFilter] = useState('all');
  const [selectedRibbonFilter, setSelectedRibbonFilter] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sort, setSort] = useState('popular');
  const [productsPerPage, setProductsPerPage] = useState(12);

  useEffect(() => {
    setCategory(categorySlug ? categoryMap[categorySlug] || 'all' : queryCategory || 'all');
  }, [categorySlug, queryCategory]);

  useEffect(() => {
    if (category !== 'Balloons') {
      setSelectedBalloonFilter('all');
    }

    if (category !== 'HBD Banner') {
      setSelectedHbdBannerFilter('all');
    }

    if (category !== 'Tape') {
      setSelectedTapeFilter('all');
    }

    if (!ribbonFilterOptions[category]) {
      setSelectedRibbonFilter('all');
    }

    setShowMobileFilters(false);
  }, [category]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (category === 'Balloons') {
      const balloonProducts = buildBalloonVariantProducts(selectedBalloonFilter);
      list = balloonProducts;

      if (selectedBalloonFilter !== 'all') {
        list = balloonProducts.filter((product) => matchesBalloonFilter(product, selectedBalloonFilter));
      }

      if (list.length < 15) {
        const pad = buildBalloonVariantProducts(selectedBalloonFilter);
        list = [...list, ...pad].slice(0, 15);
      }

      return list.slice(0, 15);
    }

    if (category === 'HBD Banner') {
      const bannerProducts = buildHbdBannerVariantProducts(selectedHbdBannerFilter);
      list = bannerProducts;

      if (selectedHbdBannerFilter !== 'all') {
        list = bannerProducts.filter((product) => matchesHbdBannerFilter(product, selectedHbdBannerFilter));
      }

      if (list.length < 15) {
        const pad = buildHbdBannerVariantProducts(selectedHbdBannerFilter);
        list = [...list, ...pad].slice(0, 15);
      }

      return list.slice(0, 15);
    }

    if (category === 'Tape') {
      const tapeProducts = buildTapeVariantProducts(selectedTapeFilter);
      list = tapeProducts.filter((product) => matchesTapeFilter(product, selectedTapeFilter));
      return list.slice(0, 15);
    }

    if (ribbonFilterOptions[category]) {
      return buildRibbonProducts(category, selectedRibbonFilter);
    }

    if (curatedCollectionItems.includes(category)) {
      list = buildCuratedCollectionProducts(category);
    } else if (category !== 'all') {
      list = list.filter((product) => product.category === category);
    }

    if (budgetAmount > 0) {
      list = list.filter((product) => product.budgetAmount === budgetAmount);
    } else if (maxPrice > 0) {
      list = list.filter((product) => product.price < maxPrice);
    }

    if (search) {
      list = list.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));
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
  }, [products, search, category, selectedBalloonFilter, selectedHbdBannerFilter, selectedTapeFilter, selectedRibbonFilter, sort, budgetAmount, maxPrice]);

  const [pageState, setPageState] = useState({ page: 1, products: null, pageSize: 12 });
  const currentPage = pageState.products === filteredProducts && pageState.pageSize === productsPerPage
    ? pageState.page
    : 1;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const pageStart = (currentPage - 1) * productsPerPage;
  const visibleProducts = filteredProducts.slice(pageStart, pageStart + productsPerPage);
  const firstVisibleProduct = filteredProducts.length > 0 ? pageStart + 1 : 0;
  const lastVisibleProduct = Math.min(pageStart + productsPerPage, filteredProducts.length);
  const goToPage = (page) => {
    setPageState({ page, products: filteredProducts, pageSize: productsPerPage });
  };
  const categoryHeading = category === 'Tableware' ? 'Party Supply' : category;
  const showCategoryFilters = category === 'Balloons'
    || category === 'HBD Banner'
    || category === 'Tape'
    || Boolean(ribbonFilterOptions[category]);
  const categoryFilterOptions = category === 'Balloons'
    ? balloonFilterOptions
    : category === 'HBD Banner'
      ? hbdBannerFilterOptions
      : category === 'Tape'
        ? tapeFilterOptions
        : ribbonFilterOptions[category];
  const selectedCategoryFilter = category === 'Balloons'
    ? selectedBalloonFilter
    : category === 'HBD Banner'
      ? selectedHbdBannerFilter
      : category === 'Tape'
        ? selectedTapeFilter
        : selectedRibbonFilter;
  const setSelectedCategoryFilter = category === 'Balloons'
    ? setSelectedBalloonFilter
    : category === 'HBD Banner'
      ? setSelectedHbdBannerFilter
      : category === 'Tape'
        ? setSelectedTapeFilter
        : setSelectedRibbonFilter;
  const categoryFilterLabel = category === 'Balloons'
    ? 'Balloon styles'
    : category === 'HBD Banner'
      ? 'HBD banner styles'
      : category === 'Tape'
        ? 'Tape types'
        : category === 'Ribbens'
          ? 'Ribbon styles'
          : 'Anniversary styles';

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

      <div className="filters-card products-filters-card">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name"
          aria-label="Search by name"
        />

        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">All categories</option>
          {curatedCollectionItems.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
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
      </div>

      {showCategoryFilters && (
        <div className="balloon-filters-panel">
          <div className="balloon-filters-header">
            <span className="eyebrow">{categoryFilterLabel}</span>
            <button
              type="button"
              className="mobile-filter-trigger"
              onClick={() => setShowMobileFilters((open) => !open)}
              aria-label={`Toggle ${categoryFilterLabel.toLowerCase()} filters`}
              aria-expanded={showMobileFilters}
            >
              <Filter size={16} />
            </button>
          </div>

          <div className={`balloon-filter-wrap ${showMobileFilters ? 'open' : ''}`}>
            <button
              type="button"
              className={`balloon-filter-chip ${selectedCategoryFilter === 'all' ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategoryFilter('all');
                setShowMobileFilters(false);
              }}
            >
              All
            </button>
            {categoryFilterOptions.map((item) => (
              <button
                key={item}
                type="button"
                className={`balloon-filter-chip ${selectedCategoryFilter === item ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategoryFilter(item);
                  setShowMobileFilters(false);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="product-grid three-col products-page-grid">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} catalogListing />
        ))}
      </div>

      {filteredProducts.length === 0 && <p className="empty-state">No products match the selected filters.</p>}

      {filteredProducts.length > 0 && (
        <div className="products-pagination" aria-label="Product pagination">
          <p className="products-pagination-count">
            Showing {firstVisibleProduct}–{lastVisibleProduct} of {filteredProducts.length} products
          </p>
          <label className="products-page-size">
            <span>Products per page</span>
            <select
              value={productsPerPage}
              onChange={(event) => setProductsPerPage(Number(event.target.value))}
            >
              {[12, 15, 18, 21].map((pageSize) => (
                <option key={pageSize} value={pageSize}>{pageSize}</option>
              ))}
            </select>
          </label>
          <div className="products-pagination-controls">
            <button
              type="button"
              className="products-pagination-button"
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              aria-label="Previous product page"
            >
              <ChevronLeft size={17} aria-hidden="true" />
              <span>Previous</span>
            </button>
            <span className="products-pagination-page">Page {currentPage} of {totalPages}</span>
            <button
              type="button"
              className="products-pagination-button"
              onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next product page"
            >
              <span>Next</span>
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
