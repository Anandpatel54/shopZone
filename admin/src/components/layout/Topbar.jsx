import { Bell, UserCircle, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ setIsOpen }) {
  const { user } = useAuth();
  return (
    <div className="bg-white shadow-sm px-4 md:px-6 py-4 flex items-center justify-between border-b border-slate-100">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsOpen(true)}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors relative">
          <Bell size={20}/>
        </button>
        <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{background:'linear-gradient(135deg,#3b82f6,#8b5cf6)'}}>
            {user?.name?.[0] || 'A'}
          </div>
          <span className="hidden sm:inline text-sm font-medium text-slate-700">{user?.name || 'Admin'}</span>
        </div>
      </div>
    </div>
  );
}
