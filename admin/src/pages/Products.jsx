import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Plus, Pencil, Trash2, Package, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products', { params: { limit: 100 } });
      setProducts(res.data.products);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      toast.success('Product deleted');
    } catch (err) { toast.error('Delete failed'); }
  };

  const filtered = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Products</h1>
          <p className="text-slate-500 mt-1">{products.length} total products</p>
        </div>
        <button onClick={() => navigate('/products/new')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white" style={{background:'linear-gradient(135deg,#3b82f6,#8b5cf6)'}}>
          <Plus size={18}/> Add Product
        </button>
      </div>
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
        <input type="text" placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"/>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400"><Package size={48} className="mx-auto mb-3 opacity-30"/><p>No products found</p></div>
        ) : (
          <table className="w-full">
            <thead><tr className="text-left text-sm text-slate-500 border-b border-slate-100 bg-slate-50/50">
              <th className="px-6 py-4">Image</th><th className="px-6 py-4">Title</th><th className="px-6 py-4">Price</th><th className="px-6 py-4">Stock</th><th className="px-6 py-4">Category</th><th className="px-6 py-4">Actions</th>
            </tr></thead>
            <tbody>{filtered.map(p=>(
              <tr key={p._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-6 py-4"><div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden">{p.images?.[0]?<img src={`http://localhost:5050${p.images[0]}`} alt="" className="w-full h-full object-cover"/>:<Package size={20} className="m-auto mt-3 text-slate-300"/>}</div></td>
                <td className="px-6 py-4 text-sm font-medium text-slate-700 max-w-[200px] truncate">{p.title}</td>
                <td className="px-6 py-4 text-sm font-semibold">₹{p.price}{p.discountPrice>0&&<span className="text-slate-400 text-xs ml-1 line-through">₹{p.discountPrice}</span>}</td>
                <td className="px-6 py-4 text-sm"><span className={p.stock>0?'text-green-600':'text-red-500'}>{p.stock>0?p.stock:'Out of stock'}</span></td>
                <td className="px-6 py-4"><span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">{p.category}</span></td>
                <td className="px-6 py-4"><div className="flex gap-2">
                  <button onClick={()=>navigate(`/products/edit/${p._id}`)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={16}/></button>
                  <button onClick={()=>handleDelete(p._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                </div></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}