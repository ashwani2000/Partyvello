import { useCallback, useEffect, useState } from 'react';
import { ArrowUpRight, Check, Package, ShoppingCart, Users, X } from 'lucide-react';
import { adminRequest } from '../api/admin';
import { useApp } from '../context/AppContext';

const emptyProduct = {
  name: '',
  sku: '',
  category: '',
  price: '',
  wholesalePrice: '',
  stock: '',
  image: '',
  description: '',
};

const maxImageSize = 3 * 1024 * 1024;
const supportedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

export default function AdminDashboard() {
  const { setProducts: setStoreProducts } = useApp();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [wholesalers, setWholesalers] = useState([]);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const fetchDashboardData = useCallback(async () => {
    const [dashboardResult, productResult, userResult] = await Promise.all([
        adminRequest('/dashboard'),
        adminRequest('/products'),
        adminRequest('/users'),
      ]);
    return {
      stats: dashboardResult.stats,
      products: productResult.items,
      wholesalers: userResult.users.filter((user) => user.role === 'wholesaler'),
    };
  }, []);

  useEffect(() => {
    let active = true;
    fetchDashboardData()
      .then((data) => {
        if (!active) return;
        setStats(data.stats);
        setProducts(data.products);
        setStoreProducts(data.products);
        setWholesalers(data.wholesalers);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [fetchDashboardData, setStoreProducts]);

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchDashboardData();
      setStats(data.stats);
      setProducts(data.products);
      setStoreProducts(data.products);
      setWholesalers(data.wholesalers);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (product) => {
    setEditingId(product.id);
    setProductForm({
      name: product.name || '',
      sku: product.sku || '',
      category: product.category || '',
      price: product.price ?? '',
      wholesalePrice: product.wholesalePrice ?? '',
      stock: product.stock ?? '',
      image: product.image || '',
      description: product.description || '',
    });
    setNotice('');
  };

  const resetProductForm = () => {
    setEditingId(null);
    setProductForm(emptyProduct);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!supportedImageTypes.includes(file.type)) {
      setError('Choose a JPG, PNG, or WebP image.');
      event.target.value = '';
      return;
    }
    if (file.size > maxImageSize) {
      setError('Image must be 3 MB or smaller.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        setError('Unable to read the selected image. Please choose another file.');
        return;
      }
      setError('');
      setProductForm((current) => ({ ...current, image: reader.result }));
    };
    reader.onerror = () => {
      setError('Unable to read the selected image. Please choose another file.');
    };
    reader.readAsDataURL(file);
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    const payload = {
      ...productForm,
      price: Number(productForm.price),
      wholesalePrice: Number(productForm.wholesalePrice || productForm.price),
      stock: Number(productForm.stock),
    };

    try {
      const result = editingId
        ? await adminRequest(`/products/${encodeURIComponent(editingId)}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
          })
        : await adminRequest('/products', {
            method: 'POST',
            body: JSON.stringify(payload),
          });
      setNotice(result.message);
      resetProductForm();
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setError('');
    setNotice('');
    try {
      const result = await adminRequest(`/products/${encodeURIComponent(product.id)}`, { method: 'DELETE' });
      setNotice(result.message);
      if (editingId === product.id) resetProductForm();
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const updateWholesalerStatus = async (user, status) => {
    setError('');
    setNotice('');
    try {
      const result = await adminRequest(`/users/${encodeURIComponent(user.id)}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setNotice(`${user.fullName}: ${result.message}`);
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const metrics = [
    { label: 'Total products', value: stats?.products ?? '—', icon: Package },
    { label: 'Orders', value: stats?.orders ?? '—', icon: ShoppingCart },
    { label: 'Users', value: stats?.users ?? '—', icon: Users },
    { label: 'Revenue', value: stats ? formatCurrency(stats.revenue) : '—', icon: ArrowUpRight },
  ];

  return (
    <div className="container page-block dashboard-page">
      <div className="section-heading row-between">
        <div>
          <span className="eyebrow">Admin workspace</span>
          <h1>Welcome back, Admin</h1>
        </div>
        <button type="button" className="secondary-btn small-btn" onClick={loadDashboard} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh data'}
        </button>
      </div>

      {error && <p className="auth-error" role="alert">{error}</p>}
      {notice && <p className="admin-notice" role="status">{notice}</p>}

      <div className="dashboard-grid">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div key={label} className="metric-card">
            <div className="metric-icon"><Icon size={18} /></div>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="dashboard-panels">
        <section className="panel-card admin-panel">
          <h3>{editingId ? 'Edit product' : 'Create product'}</h3>
          <form className="form-grid two-col" onSubmit={saveProduct}>
            <label>
              Product name
              <input required value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} />
            </label>
            <label>
              SKU
              <input required value={productForm.sku} onChange={(event) => setProductForm({ ...productForm, sku: event.target.value })} />
            </label>
            <label>
              Category
              <input required value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })} />
            </label>
            <label>
              Retail price (₹)
              <input required type="number" min="0.01" step="0.01" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} />
            </label>
            <label>
              Wholesale price (₹)
              <input type="number" min="0" step="0.01" value={productForm.wholesalePrice} onChange={(event) => setProductForm({ ...productForm, wholesalePrice: event.target.value })} />
            </label>
            <label>
              Inventory
              <input required type="number" min="0" step="1" value={productForm.stock} onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })} />
            </label>
            <div className="admin-form-wide admin-image-upload">
              <label htmlFor="product-image">Product image</label>
              <input
                id="product-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
              />
              <span className="admin-image-help">Upload a JPG, PNG, or WebP image (up to 3 MB).</span>
              {productForm.image && (
                <div className="admin-image-preview">
                  <img src={productForm.image} alt="Product preview" />
                  <button
                    type="button"
                    className="secondary-btn small-btn"
                    onClick={() => setProductForm((current) => ({ ...current, image: '' }))}
                  >
                    Remove image
                  </button>
                </div>
              )}
            </div>
            <label className="admin-form-wide">
              Description
              <textarea rows="3" value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} />
            </label>
            <div className="admin-form-wide admin-action-row">
              <button type="submit" className="primary-btn" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Save product changes' : 'Create product'}
              </button>
              {editingId && (
                <button type="button" className="secondary-btn" onClick={resetProductForm} disabled={saving}>
                  Cancel edit
                </button>
              )}
            </div>
          </form>

          <h3 className="admin-subheading">Product inventory ({products.length})</h3>
          {loading ? <p>Loading products...</p> : products.length === 0 ? <p>No products found.</p> : (
            <div className="admin-record-list">
              {products.map((product) => (
                <article className="admin-record" key={product.id}>
                  <div className="admin-record-info">
                    <strong>{product.name}</strong>
                    <span>{product.sku} · {product.category}</span>
                    <span>Retail {formatCurrency(product.price)} · Wholesale {formatCurrency(product.wholesalePrice)} · Stock {product.stock}</span>
                  </div>
                  <div className="admin-action-row">
                    <button type="button" className="secondary-btn small-btn" onClick={() => startEditing(product)}>Edit</button>
                    <button type="button" className="danger-btn small-btn" onClick={() => deleteProduct(product)}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="panel-card admin-panel">
          <h3>Wholesale approvals</h3>
          <p>Review submitted business details and update each wholesaler’s approval status.</p>
          {loading ? <p>Loading wholesale applications...</p> : wholesalers.length === 0 ? (
            <p>No wholesale applications found.</p>
          ) : (
            <div className="admin-record-list">
              {wholesalers.map((user) => (
                <article className="admin-record" key={user.id}>
                  <div className="admin-record-info">
                    <strong>{user.businessName || user.companyName || user.fullName}</strong>
                    <span>{user.fullName} · {user.email}</span>
                    <span>{[user.businessAddress, user.city, user.state, user.postalCode].filter(Boolean).join(', ') || 'No business address provided'}</span>
                    <span>Status: <strong className={`status-${user.status}`}>{user.status}</strong>{user.gstin ? ` · GSTIN ${user.gstin}` : ''}</span>
                  </div>
                  {user.status === 'pending' && (
                    <div className="admin-action-row">
                      <button type="button" className="primary-btn small-btn" onClick={() => updateWholesalerStatus(user, 'approved')} aria-label={`Approve ${user.fullName}`}>
                        <Check size={15} /> Approve
                      </button>
                      <button type="button" className="danger-btn small-btn" onClick={() => updateWholesalerStatus(user, 'rejected')} aria-label={`Reject ${user.fullName}`}>
                        <X size={15} /> Reject
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
