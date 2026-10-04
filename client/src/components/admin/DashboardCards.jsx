import { formatINR } from '../../utils/format.js';

export default function DashboardCards({ orders = [], products = [] }) {
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const todayStr = new Date().toDateString();
  const ordersToday = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === todayStr
  ).length;

  const lowStockProducts = products.filter(
    (p) => typeof p.stock === 'number' && p.stock <= 5
  ).length;

  return (
    <div className="dashboard-cards">
      <div className="card dashboard-card">
        <span className="card-title">Total Revenue</span>
        <strong className="card-value">{formatINR(totalRevenue)}</strong>
        <span className="card-subtitle">Excluding cancelled</span>
      </div>

      <div className="card dashboard-card">
        <span className="card-title">Orders Today</span>
        <strong className="card-value">{ordersToday}</strong>
        <span className="card-subtitle">Placed today</span>
      </div>

      <div className="card dashboard-card">
        <span className="card-title">Low-Stock Products</span>
        <strong className="card-value">{lowStockProducts}</strong>
        <span className="card-subtitle">Stock ≤ 5 units</span>
      </div>
    </div>
  );
}
