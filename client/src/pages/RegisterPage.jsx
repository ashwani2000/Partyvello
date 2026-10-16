import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { submitAuthRequest } from '../api/auth';

const tabs = ['Retailer', 'Wholesaler'];

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'wholesaler' ? 'Wholesaler' : 'Retailer';
  const [selectedTab, setSelectedTab] = useState(initialRole);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    gstin: '',
  });
  const { setAuthenticatedUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      const role = selectedTab.toLowerCase();
      const result = await submitAuthRequest('register', {
        role,
        fullName: form.fullName,
        businessName: role === 'retailer' ? form.businessName : '',
        companyName: role === 'wholesaler' ? form.businessName : '',
        businessAddress: form.address,
        email: form.email,
        phone: form.phone,
        password: form.password,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        gstin: form.gstin,
      });
      setAuthenticatedUser(result.user, result.token);
      navigate(role === 'wholesaler' ? '/wholesaler/dashboard' : '/retailer/dashboard');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container page-block auth-page">
      <div className="auth-card">
        <div className="auth-top">
          <span className="eyebrow">Create account</span>
          <h1>{selectedTab} registration</h1>
        </div>

        <div className="role-pills">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={selectedTab === tab ? 'active' : ''}
              onClick={() => {
                setSelectedTab(tab);
                setError('');
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-grid two-col">
            <label>
              {selectedTab === 'Retailer' ? 'Full name' : 'Owner name'}
              <input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} required />
            </label>
            <label>
              {selectedTab === 'Retailer' ? 'Business/shop name' : 'Company name'}
              <input value={form.businessName} onChange={(event) => setForm({ ...form, businessName: event.target.value })} required />
            </label>
            <label>
              Email
              <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            </label>
            <label>
              Mobile number
              <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required />
            </label>
            <label>
              Password
              <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
            </label>
            <label>
              Confirm password
              <input type="password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} required />
            </label>
          </div>

          <label>
            Business address
            <input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} required />
          </label>

          <div className="form-grid three-col">
            <label>
              City
              <input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} required />
            </label>
            <label>
              State
              <input value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} required />
            </label>
            <label>
              Postal code
              <input value={form.postalCode} onChange={(event) => setForm({ ...form, postalCode: event.target.value })} required />
            </label>
          </div>

          <label>
            GSTIN (optional)
            <input value={form.gstin} onChange={(event) => setForm({ ...form, gstin: event.target.value })} />
          </label>

          <label className="check-row terms-row">
            <input type="checkbox" required />
            <span>I accept the terms and conditions.</span>
          </label>

          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" className="primary-btn full-width" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
