import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { submitAuthRequest } from '../api/auth';

const roles = [
  { id: 'retailer', label: 'Retailer Login' },
  { id: 'wholesaler', label: 'Wholesaler Login' },
];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const requestedRole = searchParams.get('role');
  const initialRole = roles.some((role) => role.id === requestedRole) ? requestedRole : 'retailer';
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const { setAuthenticatedUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      const result = await submitAuthRequest('login', form);
      setAuthenticatedUser(result.user, result.token);
      const destination = result.user.role === 'admin'
        ? '/admin'
        : result.user.role === 'wholesaler'
          ? '/wholesaler/dashboard'
          : '/retailer/dashboard';
      navigate(destination);
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
          <span className="eyebrow">Welcome back</span>
          <h1>Login to your account</h1>
        </div>

        <div className="role-pills">
          {roles.map((role) => (
            <button
              key={role.id}
              type="button"
              className={selectedRole === role.id ? 'active' : ''}
              onClick={() => {
                setSelectedRole(role.id);
                setError('');
              }}
            >
              {role.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email or username
            <input
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password
            <div className="password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="Enter password"
                required
              />
              <button type="button" onClick={() => setShowPassword((value) => !value)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <div className="auth-row">
            <label className="check-row">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link to="/register">Need an account?</Link>
          </div>

          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" className="primary-btn full-width" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
