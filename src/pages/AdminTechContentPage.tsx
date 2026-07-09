import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Save, Plus, Trash2, X } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

type Testimonial = { quote: string; name: string; role: string };

const AdminTechContentPage: React.FC = () => {
  const [tab, setTab] = useState<'tech' | 'testimonials'>('tech');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newTech, setNewTech] = useState('');
  const [newTest, setNewTest] = useState<Testimonial>({ quote: '', name: '', role: '' });

  useEffect(() => {
    Promise.all([
      supabase.from('page_content').select('content').eq('page', 'technology').eq('section', 'tech_stack').single(),
      supabase.from('page_content').select('content').eq('page', 'technology').eq('section', 'testimonials').single(),
    ]).then(([techRes, testRes]) => {
      if (techRes.data?.content) setTechStack(techRes.data.content);
      if (testRes.data?.content) setTestimonials(testRes.data.content);
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    await Promise.all([
      supabase.from('page_content').upsert({ page: 'technology', section: 'tech_stack', content: techStack }, { onConflict: 'page, section' }),
      supabase.from('page_content').upsert({ page: 'technology', section: 'testimonials', content: testimonials }, { onConflict: 'page, section' }),
    ]);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addTech = () => {
    if (!newTech.trim()) return;
    setTechStack(prev => [...prev, newTech.trim()]);
    setNewTech('');
  };

  const removeTech = (i: number) => setTechStack(prev => prev.filter((_, idx) => idx !== i));

  const addTest = () => {
    if (!newTest.quote.trim() || !newTest.name.trim()) return;
    setTestimonials(prev => [...prev, { ...newTest }]);
    setNewTest({ quote: '', name: '', role: '' });
  };

  const removeTest = (i: number) => setTestimonials(prev => prev.filter((_, idx) => idx !== i));

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Technology Page Content</h1>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-[#1a1f3a] hover:bg-[#252b4d] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <button onClick={() => setTab('tech')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === 'tech' ? 'bg-[#1a1f3a] text-white' : 'bg-white text-slate-700 hover:bg-slate-100'}`}>
          Tech Stack
        </button>
        <button onClick={() => setTab('testimonials')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === 'testimonials' ? 'bg-[#1a1f3a] text-white' : 'bg-white text-slate-700 hover:bg-slate-100'}`}>
          Testimonials
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-[#4a90e2]" /></div>
      ) : tab === 'tech' ? (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex gap-2 mb-4">
            <input value={newTech} onChange={e => setNewTech(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTech()}
              placeholder="Add new technology..."
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2]"
            />
            <button onClick={addTech}
              className="flex items-center gap-1.5 bg-[#4a90e2] hover:bg-[#3a7bc8] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
              <Plus size={16} /> Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {techStack.map((t, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                {t}
                <button onClick={() => removeTech(i)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={14} /></button>
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Add Testimonial</h3>
            <div className="space-y-3">
              <textarea value={newTest.quote} onChange={e => setNewTest(p => ({ ...p, quote: e.target.value }))}
                placeholder="Quote..." rows={2}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2] resize-none" />
              <div className="flex gap-3">
                <input value={newTest.name} onChange={e => setNewTest(p => ({ ...p, name: e.target.value }))}
                  placeholder="Name" className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2]" />
                <input value={newTest.role} onChange={e => setNewTest(p => ({ ...p, role: e.target.value }))}
                  placeholder="Role / Organization" className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2]" />
              </div>
              <button onClick={addTest}
                className="flex items-center gap-1.5 bg-[#4a90e2] hover:bg-[#3a7bc8] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                <Plus size={16} /> Add Testimonial
              </button>
            </div>
          </div>

          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-5 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-slate-700 text-sm leading-relaxed">&quot;{t.quote}&quot;</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-semibold text-slate-800 text-sm">{t.name}</span>
                  <span className="text-slate-400 text-sm">{t.role}</span>
                </div>
              </div>
              <button onClick={() => removeTest(i)} className="p-2 text-slate-400 hover:text-red-500 transition-colors shrink-0">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminTechContentPage;