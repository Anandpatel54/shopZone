import { useState, useEffect } from 'react';
import API from '../services/api';
import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

const statusOptions = ['Pending','Confirmed','Shipped','Out for Delivery','Delivered'];
const statusColors = {
  'Pending':{bg:'#fef3c7',text:'#92400e'},'Confirmed':{bg:'#dbeafe',text:'#1e40af'},
  'Shipped':{bg:'#e9d5ff',text:'#6b21a8'},'Delivered':{bg:'#d1fae5',text:'#065f46'},
  'Out for Delivery':{bg:'#fce7f3',text:'#9d174d'},
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders').then(res=>setOrders(res.data)).catch(console.error).finally(()=>setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      setOrders(orders.map(o => o._id===id ? {...o, status} : o));
      toast.success(`Order status updated to ${status}`);
    } catch (err) { toast.error('Status update failed'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Orders</h1>
      <p className="text-slate-500 mb-6">{orders.length} total orders</p>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
        {orders.length===0 ? (
          <div className="p-12 text-center text-slate-400"><ShoppingCart size={48} className="mx-auto mb-3 opacity-30"/><p>No orders yet</p></div>
        ) : (
          <table className="w-full">
            <thead><tr className="text-left text-sm text-slate-500 border-b border-slate-100 bg-slate-50/50">
              <th className="px-6 py-4">Order ID</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Items</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Date</th>
            </tr></thead>
            <tbody>{orders.map(o=>(
              <tr key={o._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-6 py-4 text-sm font-mono text-slate-600">#{o._id.slice(-6)}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{o.user?.name||'N/A'}<br/><span className="text-xs text-slate-400">{o.user?.email}</span></td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <div className="flex flex-col gap-1">
                    {o.items?.map((item, i) => (
                      <div key={i} className="text-xs">
                        <span className="font-medium">{item.title}</span> x{item.quantity} (₹{item.price})
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-800">₹{o.totalAmount?.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <select value={o.status} onChange={e=>updateStatus(o._id,e.target.value)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                    style={{backgroundColor:statusColors[o.status]?.bg,color:statusColors[o.status]?.text}}>
                    {statusOptions.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}