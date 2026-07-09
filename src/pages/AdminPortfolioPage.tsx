import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Save, Plus, X, Upload, GripVertical } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

interface ProjectItem {
  id: string;
  title: string;
  sector: string;
  serviceType: string;
  img: string;
  summary: string;
  challenge: string;
  solution: string;
  tech: string[];
  result: string;
}

const AdminPortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('page_content').select('content').eq('page', 'portfolio').eq('section', 'portfolio_list').single()
      .then(({ data }) => {
        if (data?.content) setProjects(data.content as ProjectItem[]);
        setLoading(false);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    await supabase.from('page_content').upsert(
      { page: 'portfolio', section: 'portfolio_list', content: projects },
      { onConflict: 'page, section' }
    );
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateField = (id: string, field: keyof ProjectItem, value: any) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const addTech = (id: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, tech: [...p.tech, ''] } : p));
  };

  const updateTech = (id: string, idx: number, val: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, tech: p.tech.map((t, i) => i === idx ? val : t) } : p));
  };

  const removeTech = (id: string, idx: number) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, tech: p.tech.filter((_, i) => i !== idx) } : p));
  };

  const uploadImage = async (id: string, file: File) => {
    const ext = file.name.split('.').pop();
    const path = `${id}-${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from('portfolio-images').upload(path, file);
    if (error) { alert('Upload failed: ' + error.message); return; }
    const { data: { publicUrl } } = supabase.storage.from('portfolio-images').getPublicUrl(path);
    updateField(id, 'img', publicUrl);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Portfolio Page Content</h1>
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
          {projects.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow overflow-hidden">
              <button
                onClick={() => setEditingId(editingId === p.id ? null : p.id)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-slate-800">{p.title}</span>
                <GripVertical size={18} className="text-slate-300" />
              </button>

              {editingId === p.id && (
                <div className="px-6 pb-6 space-y-4 border-t border-slate-100 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Title</label>
                      <input value={p.title} onChange={e => updateField(p.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Sector</label>
                      <input value={p.sector} onChange={e => updateField(p.id, 'sector', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Service Type</label>
                      <input value={p.serviceType} onChange={e => updateField(p.id, 'serviceType', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2]" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Image</label>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <input value={p.img} onChange={e => updateField(p.id, 'img', e.target.value)}
                            placeholder="Image URL..."
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2]" />
                        </div>
                        <label className="flex items-center gap-2 bg-white border border-slate-200 hover:border-[#4a90e2] text-slate-700 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors shrink-0">
                          <Upload size={16} /> Upload
                          <input type="file" accept="image/*" className="hidden"
                            onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(p.id, f); }} />
                        </label>
                      </div>
                      {p.img && (
                        <img src={p.img} alt="" className="mt-2 h-28 w-full object-cover rounded-lg border border-slate-200" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Summary</label>
                    <textarea value={p.summary} onChange={e => updateField(p.id, 'summary', e.target.value)} rows={2}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2] resize-none" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Challenge</label>
                    <textarea value={p.challenge} onChange={e => updateField(p.id, 'challenge', e.target.value)} rows={3}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2] resize-none" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Solution</label>
                    <textarea value={p.solution} onChange={e => updateField(p.id, 'solution', e.target.value)} rows={3}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2] resize-none" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Result</label>
                    <textarea value={p.result} onChange={e => updateField(p.id, 'result', e.target.value)} rows={3}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2] resize-none" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Technologies</span>
                      <button onClick={() => addTech(p.id)}
                        className="flex items-center gap-1 text-xs text-[#4a90e2] font-semibold hover:text-[#3a7bc8]">
                        <Plus size={12} /> Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {p.tech.map((t, i) => (
                        <span key={i} className="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg text-sm">
                          <input value={t} onChange={e => updateTech(p.id, i, e.target.value)}
                            className="bg-transparent w-24 outline-none text-sm" />
                          <button onClick={() => removeTech(p.id, i)} className="text-slate-400 hover:text-red-500"><X size={12} /></button>
                        </span>
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

export default AdminPortfolioPage;