import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, cartTotal, totalSavings } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag size={64} className="mx-auto text-slate-200 mb-4"/>
        <h2 className="text-xl font-bold text-slate-700 mb-2">Your cart is empty</h2>
        <p className="text-slate-400 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white" style={{background:'linear-gradient(135deg,#f97316,#ef4444)'}}>
          Continue Shopping <ArrowRight size={16}/>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Shopping Cart ({items.length} items)</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.product} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4">
              <div className="w-24 h-24 rounded-xl bg-slate-50 overflow-hidden flex-shrink-0">
                {item.image ? <img src={`http://3.110.161.19:5050${item.image}`} alt={item.title} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ShoppingBag size={24}/></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <h3 className="font-medium text-slate-700 truncate pr-4">{item.title}</h3>
                  <button onClick={()=>removeFromCart(item.product)} className="text-slate-300 hover:text-red-500 flex-shrink-0"><X size={18}/></button>
                </div>
                <p className="text-lg font-bold text-slate-800 mt-1">₹{item.price.toLocaleString()}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                    <button onClick={()=>updateQuantity(item.product,item.quantity-1)} className="px-2.5 py-1.5 hover:bg-slate-50"><Minus size={14}/></button>
                    <span className="px-3 py-1.5 text-sm font-medium min-w-[32px] text-center">{item.quantity}</span>
                    <button onClick={()=>updateQuantity(item.product,item.quantity+1)} className="px-2.5 py-1.5 hover:bg-slate-50"><Plus size={14}/></button>
                  </div>
                  <span className="text-sm text-slate-400">Total: <span className="font-semibold text-slate-700">₹{(item.price*item.quantity).toLocaleString()}</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
            <h3 className="font-semibold text-slate-800 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-slate-500"><span>Shipping</span><span className="text-green-600">{cartTotal>=499?'FREE':'₹49'}</span></div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-green-600 font-medium"><span>Total Savings</span><span>-₹{totalSavings.toLocaleString()}</span></div>
              )}
              <hr className="border-slate-100"/>
              <div className="flex justify-between font-bold text-slate-800 text-base"><span>Total</span><span>₹{(cartTotal+(cartTotal>=499?0:49)).toLocaleString()}</span></div>
              {totalSavings > 0 && (
                <p className="text-[10px] text-green-600 text-center mt-2 bg-green-50 py-1 rounded-lg font-medium">Yippee! You are saving ₹{totalSavings.toLocaleString()} on this order!</p>
              )}
            </div>
            <Link to="/checkout" className="block w-full py-3 rounded-xl font-semibold text-white text-center mt-6" style={{background:'linear-gradient(135deg,#f97316,#ef4444)'}}>
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}