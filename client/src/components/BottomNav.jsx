import { BadgePercent, House, Tags, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const tabs = [
  { label: 'Home', to: '/', icon: House, end: true },
  { label: 'Categories', to: '/products', icon: Tags },
  { label: 'Deals', to: '/deals', icon: BadgePercent },
  { label: 'Me', to: '/me', icon: UserRound },
];

export default function BottomNav() {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {tabs.map(({ label, to, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          <Icon size={21} aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
