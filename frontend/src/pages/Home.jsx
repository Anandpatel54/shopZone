import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Star, ArrowRight, Zap, Truck, Shield, Headphones } from 'lucide-react';

const categories = [
  { name:'Electronics', emoji:'🔌' }, { name:'Fashion', emoji:'👕' },
  { name:'Shoes', emoji:'👟' }, { name:'Mobiles', emoji:'📱' },
  { name:'Laptops', emoji:'💻' }, { name:'Watches', emoji:'⌚' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    API.get('/products', { params: { limit: 8 } })
      .then(res => setProducts(res.data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="-mx-4 -mt-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{background:'linear-gradient(135deg,#f97316 0%,#ef4444 50%,#ec4899 100%)'}}>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4">🔥 Big Sale Up To 50% OFF</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">Discover Amazing Products</h1>
            <p className="text-white/80 text-lg mb-8">Shop the latest trends with unbeatable prices. Free shipping on orders above ₹499.</p>
            <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-500 font-semibold rounded-xl hover:shadow-xl transition-all hover:-translate-y-0.5">
              Shop Now <ArrowRight size={18}/>
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full"></div>
          <div className="absolute bottom-10 right-40 w-40 h-40 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 -mt-8 relative z-20 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, label: 'Free Shipping', sub: 'On orders ₹499+' },
            { icon: Shield, label: 'Secure Payment', sub: '100% protected' },
            { icon: Zap, label: 'Fast Delivery', sub: '2-3 business days' },
            { icon: Headphones, label: '24/7 Support', sub: 'Dedicated support' },
          ].map(f => (
            <div key={f.label} className="bg-white rounded-xl p-4 shadow-md flex items-center gap-3 border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0"><f.icon size={20} className="text-orange-500"/></div>
              <div><p className="text-sm font-semibold text-slate-700">{f.label}</p><p className="text-xs text-slate-400">{f.sub}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map(c => (
            <Link key={c.name} to={`/products?category=${c.name}`} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all">
              <span className="text-3xl mb-2 block">{c.emoji}</span>
              <span className="text-sm font-medium text-slate-700">{c.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="container mx-auto px-4 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Featured Products</h2>
          <Link to="/products" className="text-orange-500 font-medium text-sm hover:underline flex items-center gap-1">View All <ArrowRight size={14}/></Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-slate-400"><p>No products yet. Admin needs to add products first!</p></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map(p => (
              <div key={p._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all group">
                <Link to={`/products/${p._id}`}>
                  <div className="relative aspect-square bg-slate-50 overflow-hidden">
                    {p.images?.[0] ? <img src={`http://localhost:5050${p.images[0]}`} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ShoppingCart size={40}/></div>}
                    {p.stock <= 0 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Out of Stock</span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/products/${p._id}`}><h3 className="font-medium text-slate-700 text-sm mb-1 truncate hover:text-orange-500">{p.title}</h3></Link>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_,i)=><Star key={i} size={12} className={i<(p.ratings||4)?'fill-amber-400 text-amber-400':'text-slate-200'}/>)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-slate-800">₹{p.price}</span>
                        {p.discountPrice > 0 && <span className="text-xs text-slate-400 line-through">₹{p.discountPrice}</span>}
                      </div>
                      {p.discountPrice > p.price && (
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">Save ₹{p.discountPrice - p.price}</span>
                      )}
                    </div>
                    <button 
                      onClick={()=>p.stock > 0 && addToCart(p)} 
                      disabled={p.stock <= 0}
                      className={`p-2 rounded-lg transition-colors ${p.stock > 0 ? 'text-orange-500 hover:bg-orange-50' : 'text-slate-300 cursor-not-allowed'}`}
                    >
                      <ShoppingCart size={16}/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}