import { ArrowRight, LogOut, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function MePage() {
  const { user, logoutUser } = useApp();
  const navigate = useNavigate();
  const dashboardPath = user?.role === 'admin'
    ? '/admin'
    : user?.role === 'wholesaler'
      ? '/wholesaler/dashboard'
      : '/retailer/dashboard';

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className="container page-block me-page">
      <span className="eyebrow">My account</span>
      <h1>{user ? `Hello, ${user.name || user.fullName || user.email}` : 'Welcome to Party Vello'}</h1>

      {user ? (
        <div className="me-actions">
          <Link to={dashboardPath} className="primary-btn">
            Open my dashboard <ArrowRight size={18} />
          </Link>
          <button type="button" className="secondary-btn" onClick={handleLogout}>
            <LogOut size={18} /> Log out
          </button>
        </div>
      ) : (
        <div className="me-actions">
          <p>Sign in or create an account to manage your Party Vello activity.</p>
          <Link to="/login" className="primary-btn">
            <UserRound size={18} /> Login
          </Link>
          <Link to="/register" className="secondary-btn">Register</Link>
        </div>
      )}
    </div>
  );
}
