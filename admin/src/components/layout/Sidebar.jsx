import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, ShoppingCart, Users, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/categories', label: 'Categories', icon: Tags },
  { path: '/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/users', label: 'Users', icon: Users },
];

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="w-64 min-h-screen flex flex-col" style={{background:'linear-gradient(180deg,#0f172a,#1e293b)'}}>
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{background:'linear-gradient(135deg,#3b82f6,#8b5cf6)'}}>S</span>
          ShopZone
        </h1>
        <p className="text-slate-400 text-xs mt-1">Admin Panel</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const isActive = location.pathname === item.path || (item.path!=='/'+'' && location.pathname.startsWith(item.path));
          const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
          return (
            <Link key={item.path} to={item.path}
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
