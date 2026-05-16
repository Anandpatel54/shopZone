import { useState, useEffect } from 'react';
import API from '../services/api';
import { Users as UsersIcon } from 'lucide-react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/users').then(res=>setUsers(res.data)).catch(console.error).finally(()=>setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Users</h1>
      <p className="text-slate-500 mb-6">{users.length} registered users</p>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
        {users.length===0 ? (
          <div className="p-12 text-center text-slate-400"><UsersIcon size={48} className="mx-auto mb-3 opacity-30"/><p>No users yet</p></div>
        ) : (
          <table className="w-full">
            <thead><tr className="text-left text-sm text-slate-500 border-b border-slate-100 bg-slate-50/50">
              <th className="px-6 py-4">#</th><th className="px-6 py-4">Name</th><th className="px-6 py-4">Email</th><th className="px-6 py-4">Joined</th>
            </tr></thead>
            <tbody>{users.map((u,i)=>(
              <tr key={u._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-6 py-4 text-sm text-slate-500">{i+1}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-700">{u.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{u.email}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}