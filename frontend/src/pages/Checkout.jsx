import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { MapPin, CreditCard, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { items, cartTotal, clearCart, totalSavings } = useCart();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name:'', phone:'', address:'', city:'', pincode:'' });

  if (authLoading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;

  if (!isAuthenticated) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 mb-4">Please login to continue checkout</p>
        <button onClick={()=>navigate('/login')} className="px-6 py-3 rounded-xl font-medium text-white" style={{background:'linear-gradient(135deg,#f97316,#ef4444)'}}>Login</button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag size={64} className="mx-auto text-slate-200 mb-4"/>
        <p className="text-slate-500">Your cart is empty</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/orders', {
        items: items.map(i => ({ product: i.product, quantity: i.quantity })),
        shippingAddress: form,
        paymentMethod: 'Cash on Delivery',
      });
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (err) { toast.error(err.response?.data?.message || 'Order failed'); }
    finally { setLoading(false); }
  };

  const shipping = cartTotal >= 499 ? 0 : 49;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} id="checkout-form" className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6"><MapPin size={20} className="text-orange-500"/><h2 className="font-semibold text-slate-800">Shipping Address</h2></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm text-slate-600 mb-1">Full Name</label>
                <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"/>
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-slate-600 mb-1">Phone</label>
                <input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"/>
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-slate-600 mb-1">Address</label>
                <textarea required value={form.address} onChange={e=>setForm({...form,address:e.target.value})} rows={2} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 resize-none"/>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">City</label>
                <input required value={form.city} onChange={e=>setForm({...form,city:e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"/>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Pincode</label>
                <input required value={form.pincode} onChange={e=>setForm({...form,pincode:e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"/>
              </div>
            </div>
            <div className="mt-6 p-4 bg-slate-50 rounded-xl flex items-center gap-3">
              <CreditCard size={20} className="text-slate-400"/>
              <div><p className="text-sm font-medium text-slate-700">Cash on Delivery</p><p className="text-xs text-slate-400">Pay when you receive</p></div>
            </div>
          </form>
        </div>
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
            <h3 className="font-semibold text-slate-800 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">{items.map(i=>(
              <div key={i.product} className="flex justify-between text-sm">
                <span className="text-slate-500 truncate max-w-[150px]">{i.title} x{i.quantity}</span>
                <span className="text-slate-700 font-medium">₹{(i.price*i.quantity).toLocaleString()}</span>
              </div>
            ))}</div>
            <hr className="border-slate-100 mb-3"/>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-slate-500"><span>Shipping</span><span className={shipping===0?'text-green-600':''}>{shipping===0?'FREE':`₹${shipping}`}</span></div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-green-600 font-medium"><span>Total Savings</span><span>-₹{totalSavings.toLocaleString()}</span></div>
              )}
              <hr className="border-slate-100"/>
              <div className="flex justify-between font-bold text-slate-800 text-base"><span>Total</span><span>₹{(cartTotal+shipping).toLocaleString()}</span></div>
            </div>
            <button type="submit" form="checkout-form" disabled={loading} className="w-full py-3 rounded-xl font-semibold text-white mt-6 disabled:opacity-50" style={{background:'linear-gradient(135deg,#f97316,#ef4444)'}}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}