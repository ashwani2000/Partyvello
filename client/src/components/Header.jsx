import { ChevronDown, LogOut, Menu, ShoppingCart, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const productLinks = [
  { label: 'Birthday Decorations', to: '/products/decorations' },
  { label: 'Balloons & Party Supplies', to: '/products/balloons-party-supplies' },
  { label: 'Return Gifts & Accessories', to: '/products/return-gifts-accessories' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { cartCount, user, logoutUser } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <header className="main-header">
      <div className="container nav-shell">
        <Link to="/" className="brand" aria-label="Party Vello homepage">
          <img src="/party-vello-logo.png" alt="Party Vello" className="brand-logo" />
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
            About
          </NavLink>

          <div
            className={`nav-dropdown ${dropdownOpen ? 'open' : ''}`}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              type="button"
              className="dropdown-toggle"
              aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen((open) => !open)}
            >
              Categories <ChevronDown size={16} />
            </button>
            <div className="dropdown-menu">
              {productLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={() => setDropdownOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {navItems.slice(2).map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="cart-button" aria-label="Shopping cart">
            <ShoppingCart size={18} />
            <span>{cartCount}</span>
          </Link>

          {user ? (
            <div className="user-pill">
              <UserRound size={16} />
              <span>{user.name || user.fullName || user.email}</span>
              <button type="button" onClick={handleLogout} className="logout-btn" aria-label="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="secondary-btn small-btn">
                Login
              </Link>
              <Link to="/register" className="primary-btn small-btn">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
