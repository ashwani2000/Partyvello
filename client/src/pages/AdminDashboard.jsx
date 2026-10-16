import { ArrowUpRight, Package, ShoppingCart, Users } from 'lucide-react';

const metrics = [
  { label: 'Total products', value: '124', icon: Package },
  { label: 'Orders', value: '498', icon: ShoppingCart },
  { label: 'Users', value: '1,820', icon: Users },
  { label: 'Revenue', value: '₹12.8L', icon: ArrowUpRight },
];

export default function AdminDashboard() {
  return (
    <div className="container page-block dashboard-page">
      <div className="section-heading">
        <span className="eyebrow">Admin workspace</span>
        <h1>Welcome back, Admin</h1>
      </div>

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
        <div className="panel-card">
          <h3>Product management</h3>
          <ul>
            <li>Create new products</li>
            <li>Edit inventory</li>
            <li>Control category pricing</li>
          </ul>
        </div>
        <div className="panel-card">
          <h3>Wholesale approvals</h3>
          <ul>
            <li>Review pending applications</li>
            <li>Approve or reject partners</li>
            <li>Track business verification</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
