import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, ShoppingCart, Users, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/categories', label: 'Categories', icon: Tags },
  { path: '/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/users', label: 'Users', icon: Users },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`} 
      style={{background:'linear-gradient(180deg,#0f172a,#1e293b)'}}
    >
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{background:'linear-gradient(135deg,#3b82f6,#8b5cf6)'}}>S</span>
            ShopZone
          </h1>
          <p className="text-slate-400 text-xs mt-1">Admin Panel</p>
        </div>
        <button 
          onClick={() => setIsOpen(false)} 
          className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
          return (
            <Link 
              key={item.path} 
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active?'text-white shadow-lg':'text-slate-400 hover:text-white hover:bg-white/5'}`}
              style={active?{background:'linear-gradient(135deg,#3b82f6,#8b5cf6)'}:{}}>
              <item.icon size={18}/> {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-white/5 w-full transition-all">
          <LogOut size={18}/> Logout
        </button>
      </div>
    </div>
  );
}
