import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Star, Minus, Plus, Heart, Truck, Shield, RotateCcw } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    API.get(`/products/${id}`).then(res=>setProduct(res.data)).catch(console.error).finally(()=>setLoading(false));
  }, [id]);

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(()=>setAdded(false), 2000);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!product) return <div className="text-center py-20 text-slate-400">Product not found</div>;

  const price = product.price;
  const originalPrice = product.discountPrice;
  const discount = originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 aspect-square">
            {product.images?.[0] ? <img src={`http://localhost:5050${product.images[0]}`} alt={product.title} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-slate-200"><ShoppingCart size={80}/></div>}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.images.map((img,i) => (
                <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-200 hover:border-orange-400 cursor-pointer">
                  <img src={`http://localhost:5050${img}`} alt="" className="w-full h-full object-cover"/>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Details */}
        <div>
          <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs rounded-full font-medium">{product.category}</span>
          <h1 className="text-2xl font-bold text-slate-800 mt-3 mb-2">{product.title}</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">{[...Array(5)].map((_,i)=><Star key={i} size={16} className={i<(product.ratings||4)?'fill-amber-400 text-amber-400':'text-slate-200'}/>)}</div>
            <span className="text-sm text-slate-400">({product.numReviews||0} reviews)</span>
          </div>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-slate-800">₹{price.toLocaleString()}</span>
            {originalPrice > 0 && <>
              <span className="text-lg text-slate-400 line-through">₹{originalPrice.toLocaleString()}</span>
              {discount > 0 && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-sm rounded-lg font-medium">{discount}% off</span>}
            </>}
          </div>
          <p className="text-slate-600 mb-6 leading-relaxed">{product.description}</p>
          <div className="mb-6">
            <span className={`text-sm font-medium ${product.stock>0?'text-green-600':'text-red-500'}`}>
              {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}
            </span>
          </div>
          {product.stock > 0 && (
            <>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                  <button onClick={()=>setQuantity(Math.max(1,quantity-1))} className="px-3 py-2 hover:bg-slate-50"><Minus size={16}/></button>
                  <span className="px-4 py-2 font-medium text-slate-700 min-w-[40px] text-center">{quantity}</span>
                  <button onClick={()=>setQuantity(Math.min(product.stock,quantity+1))} className="px-3 py-2 hover:bg-slate-50"><Plus size={16}/></button>
                </div>
              </div>
              <div className="flex gap-3 mb-8">
                <button onClick={handleAdd} className="flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2" style={{background:'linear-gradient(135deg,#f97316,#ef4444)'}}>
                  <ShoppingCart size={18}/> {added ? '✓ Added!' : 'Add to Cart'}
                </button>
                <button className="p-3 rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200"><Heart size={20}/></button>
              </div>
            </>
          )}
          <div className="grid grid-cols-3 gap-3">
            {[{icon:Truck,label:'Free Delivery'},{icon:RotateCcw,label:'7 Day Return'},{icon:Shield,label:'Warranty'}].map(f=>(
              <div key={f.label} className="text-center p-3 bg-slate-50 rounded-xl">
                <f.icon size={18} className="mx-auto text-slate-400 mb-1"/><span className="text-xs text-slate-500">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}