import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { submitAuthRequest } from '../api/auth';
import { useApp } from '../context/AppContext';

const ADMIN_GATE_TOKEN_KEY = 'partypops-admin-gate-token';

export default function AdminLoginPage() {
  const [hasGateToken] = useState(() => Boolean(sessionStorage.getItem(ADMIN_GATE_TOKEN_KEY)));
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const { setAuthenticatedUser } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasGateToken) navigate('/admin/gate', { replace: true });
  }, [hasGateToken, navigate]);

  if (!hasGateToken) {
    return <Navigate to="/admin/gate" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const gateToken = sessionStorage.getItem(ADMIN_GATE_TOKEN_KEY);
      if (!gateToken) {
        navigate('/admin/gate', { replace: true });
        return;
      }
      const result = await submitAuthRequest(
        'login',
        { ...form, portal: 'admin' },
        { 'X-Admin-Gate-Token': gateToken },
      );
      if (result.user.role !== 'admin') {
        setError('These credentials do not have administrator access.');
        return;
      }

      sessionStorage.removeItem(ADMIN_GATE_TOKEN_KEY);
      setAuthenticatedUser(result.user, result.token);
      navigate('/admin', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
      if (requestError.message.includes('Complete the admin PIN check')) {
        sessionStorage.removeItem(ADMIN_GATE_TOKEN_KEY);
        navigate('/admin/gate', { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container page-block auth-page">
      <div className="auth-card">
        <div className="auth-top admin-login-heading">
          <span className="admin-login-icon"><Shield size={22} /></span>
          <span className="eyebrow">Secure administrator access</span>
          <h1>Admin Login</h1>
          <p>Sign in with your administrator email and password.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Admin email
            <input
              type="email"
              autoComplete="username"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="admin@example.com"
              required
            />
          </label>

          <label>
            Password
            <div className="password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="Enter admin password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" className="primary-btn full-width" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in to admin'}
          </button>
          <Link to="/" className="admin-login-back">Back to store</Link>
        </form>
      </div>
    </div>
  );
}
