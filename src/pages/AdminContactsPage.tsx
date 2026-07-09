import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Mail, ChevronDown, ChevronUp, Check, ReplyAll, Archive } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string | null;
  sms_opt_in: boolean;
  status: string;
  created_at: string;
}

const STATUSES = ['unread', 'read', 'replied', 'archived'] as const;
const STATUS_COLORS: Record<string, string> = {
  unread: 'bg-red-100 text-red-700',
  read: 'bg-blue-100 text-blue-700',
  replied: 'bg-green-100 text-green-700',
  archived: 'bg-slate-100 text-slate-500',
};

const AdminContactsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchData = () => {
    supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setSubmissions(data as Submission[]);
        setLoading(false);
      });
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('contact_submissions').update({ status }).eq('id', id);
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const expand = (s: Submission) => {
    setExpanded(expanded === s.id ? null : s.id);
    if (s.status === 'unread') updateStatus(s.id, 'read');
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Contact Submissions</h1>
        <button onClick={() => { setLoading(true); fetchData(); }}
          className="text-sm text-[#4a90e2] font-semibold hover:text-[#3a7bc8] transition-colors">
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-[#4a90e2]" /></div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <Mail size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="font-semibold text-slate-700">No submissions yet</p>
          <p className="text-sm mt-1">Contact form submissions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map(s => (
            <div key={s.id} className="bg-white rounded-xl shadow overflow-hidden">
              <button onClick={() => expand(s)} className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-slate-50 transition-colors">
                <span className={`shrink-0 w-2.5 h-2.5 rounded-full ${s.status === 'unread' ? 'bg-red-500' : 'bg-transparent'}`} />
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${STATUS_COLORS[s.status]}`}>
                  {s.status}
                </span>
                <span className="font-semibold text-slate-800 min-w-0 flex-1 truncate">{s.name}</span>
                <span className="text-slate-500 text-sm hidden sm:block truncate max-w-[200px]">{s.email}</span>
                <span className="text-slate-400 text-xs shrink-0">{formatDate(s.created_at)}</span>
                {expanded === s.id ? <ChevronUp size={16} className="shrink-0 text-slate-300" /> : <ChevronDown size={16} className="shrink-0 text-slate-300" />}
              </button>

              {expanded === s.id && (
                <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div><span className="text-slate-500">Email</span><p className="font-medium text-slate-800">{s.email}</p></div>
                    <div><span className="text-slate-500">Phone</span><p className="font-medium text-slate-800">{s.phone || '—'}</p></div>
                    <div><span className="text-slate-500">Service</span><p className="font-medium text-slate-800">{s.service || '—'}</p></div>
                    <div><span className="text-slate-500">Received</span><p className="font-medium text-slate-800">{formatDate(s.created_at)}</p></div>
                  </div>
                  {s.message && (
                    <div>
                      <span className="text-sm text-slate-500">Message</span>
                      <p className="mt-1 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-lg p-4">{s.message}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    {STATUSES.map(st => {
                      if (st === s.status) return null;
                      const icons: Record<string, React.ReactNode> = {
                        read: <Check size={14} />,
                        replied: <ReplyAll size={14} />,
                        archived: <Archive size={14} />,
                      };
                      return (
                        <button key={st} onClick={() => updateStatus(s.id, st)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                          {icons[st]} Mark {st}
                        </button>
                      );
                    })}
                    <a href={`mailto:${s.email}`}
                      className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#4a90e2]/10 text-[#4a90e2] hover:bg-[#4a90e2]/20 transition-colors">
                      <Mail size={14} /> Reply via Email
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminContactsPage;