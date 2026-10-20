import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { submitAuthRequest } from '../api/auth';

const ADMIN_GATE_TOKEN_KEY = 'partypops-admin-gate-token';

export default function AdminGatePage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const result = await submitAuthRequest('admin-gate', { pin });
      sessionStorage.setItem(ADMIN_GATE_TOKEN_KEY, result.gateToken);
      navigate('/admin/login', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container page-block auth-page">
      <div className="auth-card">
        <div className="auth-top admin-login-heading">
          <span className="admin-login-icon"><Shield size={22} /></span>
          <span className="eyebrow">Restricted area</span>
          <h1>Admin access PIN</h1>
          <p>Enter the admin access PIN to continue to administrator sign-in.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Access PIN
            <input
              type="password"
              autoComplete="current-password"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              placeholder="Enter access PIN"
              required
            />
          </label>

          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" className="primary-btn full-width" disabled={isSubmitting}>
            {isSubmitting ? 'Verifying...' : 'Continue'}
          </button>
          <Link to="/" className="admin-login-back">Back to store</Link>
        </form>
      </div>
    </div>
  );
}
