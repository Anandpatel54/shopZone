import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, LogOut, Package, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => { logout(); setDropdownOpen(false); navigate('/'); };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{background:'linear-gradient(135deg,#f97316,#ef4444)'}}>S</span>
          <span className="text-xl font-bold text-slate-800">ShopZone</span>
        </Link>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-xl">
          <div className="relative w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input type="text" placeholder="Search products..." onKeyDown={e=>{if(e.key==='Enter')navigate(`/products?search=${e.target.value}`)}} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"/>
          </div>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-2">
          <Link to="/wishlist" className="p-2 text-slate-500 hover:text-red-500 hover:bg-slate-50 rounded-xl transition-colors hidden sm:block">
            <Heart size={20}/>
          </Link>
          <Link to="/cart" className="p-2 text-slate-500 hover:text-orange-500 hover:bg-slate-50 rounded-xl transition-colors relative">
            <ShoppingCart size={20}/>
            {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{background:'linear-gradient(135deg,#f97316,#ef4444)'}}>{cartCount}</span>}
          </Link>

          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={()=>setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{background:'linear-gradient(135deg,#f97316,#ef4444)'}}>
                  {user?.name?.[0]?.toUpperCase()||'U'}
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:block">{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} className="text-slate-400"/>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
                  <Link to="/orders" onClick={()=>setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                    <Package size={16}/> My Orders
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left">
                    <LogOut size={16}/> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-orange-500 transition-colors">Login</Link>
              <Link to="/register" className="px-4 py-2 text-sm font-medium text-white rounded-xl" style={{background:'linear-gradient(135deg,#f97316,#ef4444)'}}>Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
