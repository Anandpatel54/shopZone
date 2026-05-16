import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ShoppingBag } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{background:'linear-gradient(135deg,#f97316,#ef4444)'}}>
            <ShoppingBag size={32} color="white"/>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>
          <p className="text-slate-500 mt-2">Join ShopZone today</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="John Doe" required className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"/>
              </div>
            </div>
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"/>
              </div>
            </div>
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"/>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-50" style={{background:'linear-gradient(135deg,#f97316,#ef4444)'}}>
              {loading?'Creating account...':'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">Already have an account? <Link to="/login" className="text-orange-500 font-medium hover:underline">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}
