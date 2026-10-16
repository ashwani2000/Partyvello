import { PackageCheck, ShoppingBag, Truck, WalletCards } from 'lucide-react';
import { useApp } from '../context/AppContext';

const cards = [
  { label: 'Open orders', value: '12', icon: ShoppingBag },
  { label: 'Saved addresses', value: '4', icon: PackageCheck },
  { label: 'Returns', value: '02', icon: WalletCards },
  { label: 'Shipment tracking', value: 'Live', icon: Truck },
];

export default function RetailerDashboard() {
  const { user } = useApp();

  return (
    <div className="container page-block dashboard-page">
      <div className="section-heading">
        <span className="eyebrow">Retailer dashboard</span>
        <h1>Good morning, {user?.fullName || user?.name || 'there'}</h1>
      </div>

      <div className="dashboard-grid">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="metric-card">
            <div className="metric-icon"><Icon size={18} /></div>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
