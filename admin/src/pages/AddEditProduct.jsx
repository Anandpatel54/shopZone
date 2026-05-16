import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import { Upload, ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const categories = ['Electronics','Fashion','Shoes','Mobiles','Laptops','Watches','Accessories','Home','Other'];

export default function AddEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title:'', description:'', price:'', discountPrice:'', category:'Electronics', stock:'' });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      API.get(`/products/${id}`).then(res => {
        const p = res.data;
        setForm({ title:p.title, description:p.description, price:p.price, discountPrice:p.discountPrice||'', category:p.category, stock:p.stock });
        setExistingImages(p.images||[]);
      }).catch(()=>navigate('/products')).finally(()=>setLoading(false));
    }
  }, [id]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(k => formData.append(k, form[k]));
      images.forEach(img => formData.append('images', img));

      if (isEdit) {
        await API.put(`/products/${id}`, formData, { headers:{'Content-Type':'multipart/form-data'} });
      } else {
        await API.post('/products', formData, { headers:{'Content-Type':'multipart/form-data'} });
      }
      toast.success(isEdit ? 'Product updated!' : 'Product created!');
      navigate('/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={()=>navigate('/products')} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6">
        <ArrowLeft size={18}/> Back to Products
      </button>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">{isEdit?'Edit Product':'Add New Product'}</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input type="text" required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea required value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={4} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Selling Price (₹)</label>
              <input type="number" required min="0" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Discount Price (₹)</label>
              <input type="number" min="0" value={form.discountPrice} onChange={e=>setForm({...form,discountPrice:e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white">
                {categories.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
              <input type="number" required min="0" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product Images</label>
            <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              <Upload size={32} className="mx-auto text-slate-300 mb-2"/>
              <p className="text-sm text-slate-500 mb-2">Click or drag images here</p>
            </div>
            {(previews.length > 0 || existingImages.length > 0) && (
              <div className="flex gap-3 mt-3 flex-wrap">
                {existingImages.map((img,i)=><img key={`ex-${i}`} src={`http://localhost:5050${img}`} className="w-20 h-20 object-cover rounded-lg border"/>)}
                {previews.map((p,i)=><img key={`pr-${i}`} src={p} className="w-20 h-20 object-cover rounded-lg border"/>)}
              </div>
            )}
          </div>
          <button type="submit" disabled={saving} className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50" style={{background:'linear-gradient(135deg,#3b82f6,#8b5cf6)'}}>
            <Save size={18}/> {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
}