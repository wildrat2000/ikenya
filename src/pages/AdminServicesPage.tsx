import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Save, Plus, X, GripVertical } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import Icon from '@/components/Icon';

interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  points: string[];
  icon: string;
  img: string;
}

const ICONS = ['code', 'globe', 'network', 'server', 'box', 'briefcase', 'shield', 'zap', 'wrench'];

const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('page_content').select('content').eq('page', 'services').eq('section', 'services_list').single()
      .then(({ data }) => {
        if (data?.content) setServices(data.content as ServiceItem[]);
        setLoading(false);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    await supabase.from('page_content').upsert(
      { page: 'services', section: 'services_list', content: services },
      { onConflict: 'page, section' }
    );
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const update = (id: string, field: keyof ServiceItem, value: any) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addPoint = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, points: [...s.points, ''] } : s));
  };

  const updatePoint = (id: string, idx: number, val: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, points: s.points.map((p, i) => i === idx ? val : p) } : s));
  };

  const removePoint = (id: string, idx: number) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, points: s.points.filter((_, i) => i !== idx) } : s));
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Services Page Content</h1>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-[#1a1f3a] hover:bg-[#252b4d] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-[#4a90e2]" /></div>
      ) : (
        <div className="space-y-4">
          {services.map(s => (
            <div key={s.id} className="bg-white rounded-xl shadow overflow-hidden">
              <button
                onClick={() => setEditingId(editingId === s.id ? null : s.id)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1a1f3a] flex items-center justify-center text-[#4a90e2]">
                    <Icon name={s.icon} className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-slate-800">{s.title}</span>
                </div>
                <GripVertical size={18} className="text-slate-300" />
              </button>

              {editingId === s.id && (
                <div className="px-6 pb-6 space-y-4 border-t border-slate-100 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Title</label>
                      <input value={s.title} onChange={e => update(s.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Icon</label>
                      <select value={s.icon} onChange={e => update(s.id, 'icon', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2] bg-white">
                        {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Image URL</label>
                      <input value={s.img} onChange={e => update(s.id, 'img', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Description</label>
                    <textarea value={s.desc} onChange={e => update(s.id, 'desc', e.target.value)} rows={2}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2] resize-none" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Points</span>
                      <button onClick={() => addPoint(s.id)}
                        className="flex items-center gap-1 text-xs text-[#4a90e2] font-semibold hover:text-[#3a7bc8]">
                        <Plus size={12} /> Add Point
                      </button>
                    </div>
                    <div className="space-y-2">
                      {s.points.map((p, i) => (
                        <div key={i} className="flex gap-2">
                          <input value={p} onChange={e => updatePoint(s.id, i, e.target.value)}
                            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2]" />
                          <button onClick={() => removePoint(s.id, i)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
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

export default AdminServicesPage;