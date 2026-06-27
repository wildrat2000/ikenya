import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Check, X as XIcon } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

type Appointment = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  date: string;
  time: string;
  status: string;
  notes: string | null;
  created_at: string;
};

const AdminAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    const { data } = await supabase.from('appointments').select('*').order('date', { ascending: true }).order('time', { ascending: true });
    if (data) setAppointments(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('appointments').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    fetchAppointments();
  };

  const filtered = statusFilter === 'all' ? appointments : appointments.filter(a => a.status === statusFilter);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Appointments</h1>

      <div className="flex items-center gap-3 mb-6">
        {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map(f => (
          <button key={f} onClick={() => setStatusFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              statusFilter === f ? 'bg-[#1a1f3a] text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}>{f}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-[#4a90e2]" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-slate-500">No appointments found</div>
      ) : (
        <div className="bg-white rounded-xl overflow-hidden shadow">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Time</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Client</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Phone</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Service</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{new Date(a.date + 'T00:00:00').toLocaleDateString('en-KE')}</td>
                  <td className="px-4 py-3">{a.time.slice(0, 5)}</td>
                  <td className="px-4 py-3">{a.name}</td>
                  <td className="px-4 py-3 text-slate-500">{a.email}</td>
                  <td className="px-4 py-3 text-slate-500">{a.phone || '—'}</td>
                  <td className="px-4 py-3 text-slate-500">{a.service || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                      a.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      a.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      a.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      a.status === 'rescheduled' ? 'bg-purple-100 text-purple-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{a.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {a.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(a.id, 'confirmed')} title="Confirm" className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"><Check size={16} /></button>
                          <button onClick={() => updateStatus(a.id, 'cancelled')} title="Cancel" className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"><XIcon size={16} /></button>
                        </>
                      )}
                      {a.status === 'confirmed' && (
                        <button onClick={() => updateStatus(a.id, 'completed')} className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 text-xs font-medium transition-colors">Mark Complete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminAppointmentsPage;