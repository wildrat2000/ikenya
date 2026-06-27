import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) throw err;
      navigate('/admin/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full p-8">
        <h1 className="text-2xl font-bold text-[#1a1f3a] mb-2">Admin Login</h1>
        <p className="text-slate-600 mb-6">Sign in to manage appointments</p>
        <form onSubmit={login} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4a90e2] focus:ring-2 focus:ring-[#4a90e2]/20 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#4a90e2] focus:ring-2 focus:ring-[#4a90e2]/20 outline-none" />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-[#1a1f3a] hover:bg-[#252b4d] text-white px-6 py-3.5 rounded-lg font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading && <Loader2 size={18} className="animate-spin" />}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;