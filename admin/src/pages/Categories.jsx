import { useState, useEffect } from 'react';
import API from '../services/api';
import { Tags, Plus, Trash2 } from 'lucide-react';

export default function Categories() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/products', { params: { limit: 200 } })
      .then(res => setProducts(res.data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Extract unique categories from products
  const categoryMap = {};
  products.forEach(p => {
    if (!categoryMap[p.category]) categoryMap[p.category] = 0;
    categoryMap[p.category]++;
  });

  const allCategories = ['Electronics','Fashion','Shoes','Mobiles','Laptops','Watches','Accessories','Home','Other'];

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Categories</h1>
      <p className="text-slate-500 mb-6">Product categories overview</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allCategories.map(cat => (
          <div key={cat} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Tags size={20} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-700">{cat}</h3>
                  <p className="text-sm text-slate-400">{categoryMap[cat] || 0} products</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}