import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Star, Search, SlidersHorizontal } from 'lucide-react';

const allCategories = ['All','Electronics','Fashion','Shoes','Mobiles','Laptops','Watches','Accessories','Home','Other'];

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('newest');
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    const params = { limit: 50, sort };
    if (search) params.search = search;
    if (category !== 'All') params.category = category;
    API.get('/products', { params })
      .then(res => setProducts(res.data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    const params = { limit: 50, sort };
    if (search) params.search = search;
    if (category !== 'All') params.category = category;
    API.get('/products', { params })
      .then(res => setProducts(res.data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">All Products</h1>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 bg-white"/>
        </form>
        <select value={category} onChange={e=>setCategory(e.target.value)} className="px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/30">
          {allCategories.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={e=>setSort(e.target.value)} className="px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/30">
          <option value="newest">Newest</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
        </select>
      </div>
      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-slate-400"><SlidersHorizontal size={48} className="mx-auto mb-3 opacity-30"/><p>No products found</p></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => (
            <div key={p._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all group">
              <Link to={`/products/${p._id}`}>
                <div className="relative aspect-square bg-slate-50 overflow-hidden">
                  {p.images?.[0]?<img src={`http://3.110.161.19:5050${p.images[0]}`} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>:<div className="w-full h-full flex items-center justify-center text-slate-300"><ShoppingCart size={40}/></div>}
                  {p.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Out of Stock</span>
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/products/${p._id}`}><h3 className="font-medium text-slate-700 text-sm mb-1 truncate hover:text-orange-500">{p.title}</h3></Link>
                <div className="flex items-center gap-1 mb-2">{[...Array(5)].map((_,i)=><Star key={i} size={12} className={i<(p.ratings||4)?'fill-amber-400 text-amber-400':'text-slate-200'}/>)}</div>
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
  );
}