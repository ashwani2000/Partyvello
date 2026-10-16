import { Boxes, CreditCard, PackageSearch, TrendingUp } from 'lucide-react';

const panels = [
  { label: 'Approved status', value: 'Pending Review', icon: PackageSearch },
  { label: 'Bulk orders', value: '18', icon: Boxes },
  { label: 'Tier pricing', value: 'VIP', icon: TrendingUp },
  { label: 'Invoice ready', value: '05', icon: CreditCard },
];

export default function WholesalerDashboard() {
  return (
    <div className="container page-block dashboard-page">
      <div className="section-heading">
        <span className="eyebrow">Wholesale portal</span>
        <h1>Welcome to your partner dashboard</h1>
      </div>

      <div className="dashboard-grid">
        {panels.map(({ label, value, icon: Icon }) => (
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
