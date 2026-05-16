import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { Package, ShoppingBag } from 'lucide-react';

const statusColors = {
  'Pending':'bg-yellow-100 text-yellow-800','Confirmed':'bg-blue-100 text-blue-800',
  'Shipped':'bg-purple-100 text-purple-800','Out for Delivery':'bg-pink-100 text-pink-800',
  'Delivered':'bg-green-100 text-green-800',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { navigate('/login'); return; }
    API.get('/orders/my').then(res=>setOrders(res.data)).catch(console.error).finally(()=>setLoading(false));
  }, [isAuthenticated, authLoading]);

  if (authLoading || loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag size={64} className="mx-auto text-slate-200 mb-4"/>
          <h2 className="text-xl font-bold text-slate-700 mb-2">No orders yet</h2>
          <p className="text-slate-400 mb-6">Start shopping to see your orders here.</p>
          <Link to="/products" className="px-6 py-3 rounded-xl font-medium text-white inline-block" style={{background:'linear-gradient(135deg,#f97316,#ef4444)'}}>Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm text-slate-400">Order <span className="font-mono">#{order._id.slice(-6)}</span></p>
                  <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString('en-IN',{year:'numeric',month:'long',day:'numeric'})}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-slate-800">₹{order.totalAmount.toLocaleString()}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]||'bg-slate-100 text-slate-600'}`}>{order.status}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {order.items.map((item,i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 pr-5">
                    <div className="w-12 h-12 rounded-lg bg-white overflow-hidden border border-slate-100">
                      {item.image?<img src={`http://localhost:5050${item.image}`} alt="" className="w-full h-full object-cover"/>:<Package size={18} className="m-auto mt-3 text-slate-300"/>}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 truncate max-w-[150px]">{item.title}</p>
                      <p className="text-xs text-slate-400">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Order Progress */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  {['Pending','Confirmed','Shipped','Delivered'].map((step,i,arr)=>{
                    const statusIndex = ['Pending','Confirmed','Shipped','Out for Delivery','Delivered'].indexOf(order.status);
                    const stepIndex = [0,1,2,4][i];
                    const active = statusIndex >= stepIndex;
                    return (
                      <div key={step} className="flex items-center flex-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${active?'bg-orange-500 text-white':'bg-slate-200 text-slate-400'}`}>{i+1}</div>
                        <span className={`text-xs ml-1 hidden sm:inline ${active?'text-orange-600 font-medium':'text-slate-400'}`}>{step}</span>
                        {i<arr.length-1 && <div className={`flex-1 h-0.5 mx-2 ${active?'bg-orange-500':'bg-slate-200'}`}></div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}