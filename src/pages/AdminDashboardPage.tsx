import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, MessageSquare, Users, TrendingUp } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState({ appointments: 0, contacts: 0, subscribers: 0, pendingAppts: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from('appointments').select('*', { count: 'exact', head: true }),
      supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
      supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    ]).then(([appts, contacts, subs, pending]) => {
      setStats({
        appointments: appts.count ?? 0,
        contacts: contacts.count ?? 0,
        subscribers: subs.count ?? 0,
        pendingAppts: pending.count ?? 0,
      });
    });
  }, []);

  const cards = [
    { label: 'Total Appointments', value: stats.appointments, icon: Calendar, color: 'bg-blue-500' },
    { label: 'Pending', value: stats.pendingAppts, icon: TrendingUp, color: 'bg-yellow-500' },
    { label: 'Contact Submissions', value: stats.contacts, icon: MessageSquare, color: 'bg-green-500' },
    { label: 'Newsletter Subscribers', value: stats.subscribers, icon: Users, color: 'bg-purple-500' },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <Icon size={22} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;