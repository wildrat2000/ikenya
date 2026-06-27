import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2, LayoutDashboard, Calendar, MessageSquare, Users, LogOut, ChevronRight } from 'lucide-react';


const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Appointments', path: '/admin/appointments', icon: Calendar },
  { label: 'Contact Submissions', path: '/admin/contacts', icon: MessageSquare },
  { label: 'Subscribers', path: '/admin/subscribers', icon: Users },
];

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/admin');
        return;
      }
      supabase.from('profiles').select('role').eq('id', session.user.id).single().then(({ data }) => {
        if (data?.role !== 'super_admin') {
          navigate('/admin');
          return;
        }
        setUser(session.user);
        setChecking(false);
      });
    });
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#4a90e2]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-64 bg-[#1a1f3a] text-white flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-white/10">
          <h1 className="text-lg font-bold">Itukarua Admin</h1>
          <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  active
                    ? 'bg-[#4a90e2]/20 text-[#4a90e2]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {active && <ChevronRight size={16} className="ml-auto" />}
              </button>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;