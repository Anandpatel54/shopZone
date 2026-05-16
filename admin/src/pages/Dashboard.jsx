import { useState, useEffect } from 'react';
import API from '../services/api';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/orders'),
        ]);
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data.slice(0, 5));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: '#3b82f6', bg: '#eff6ff' },
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: '#8b5cf6', bg: '#f5f3ff' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: '#f97316', bg: '#fff7ed' },
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#10b981', bg: '#ecfdf5' },
  ];

  const statusColors = {
    'Pending': { bg: '#fef3c7', text: '#92400e' },
    'Confirmed': { bg: '#dbeafe', text: '#1e40af' },
    'Shipped': { bg: '#e9d5ff', text: '#6b21a8' },
    'Delivered': { bg: '#d1fae5', text: '#065f46' },
    'Out for Delivery': { bg: '#fce7f3', text: '#9d174d' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back! Here's your store overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <div key={card.title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.bg }}>
                <card.icon size={24} style={{ color: card.color }} />
              </div>
              <TrendingUp size={18} className="text-green-500" />
            </div>
            <p className="text-slate-500 text-sm">{card.title}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          {recentOrders.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <ShoppingCart size={48} className="mx-auto mb-3 opacity-30" />
              <p>No orders yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-500 border-b border-slate-100">
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Items</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-slate-600">#{order._id.slice(-6)}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{order.user?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{order.items?.length || 0} items</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">₹{order.totalAmount?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: statusColors[order.status]?.bg || '#f1f5f9',
                          color: statusColors[order.status]?.text || '#475569',
                        }}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}