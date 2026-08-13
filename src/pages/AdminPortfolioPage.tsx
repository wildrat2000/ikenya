import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Loader2,
  Save,
  Plus,
  X,
  Upload,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Trash2,
  Camera,
} from 'lucide-react';
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

interface SliderSite {
  id: string;
  title: string;
  url: string;
  description: string;
  image_url: string;
  sort_order: number;
}

interface SliderSettings {
  web_effect: 'slide' | 'fade' | 'coverflow';
  web_scroll_interval_seconds: string;
  web_transition_duration_seconds: string;
}

const AdminPortfolioPage: React.FC = () => {
  const [tab, setTab] = useState<'projects' | 'slider'>('projects');
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [sliderSites, setSliderSites] = useState<SliderSite[]>([]);
  const [sliderSettings, setSliderSettings] = useState<SliderSettings>({
    web_effect: 'slide',
    web_scroll_interval_seconds: '5',
    web_transition_duration_seconds: '0.8',
  });
  const [deletedSiteIds, setDeletedSiteIds] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from('page_content').select('content').eq('page', 'portfolio').eq('section', 'portfolio_list').single(),
      supabase.from('portfolio_sites').select('*').order('sort_order', { ascending: true, nullsFirst: false }),
      supabase.from('ad_carousel_settings').select('key,value'),
    ]).then(([projectRes, sitesRes, settingsRes]) => {
      if (projectRes.data?.content) setProjects(projectRes.data.content as ProjectItem[]);

      if (!sitesRes.error && sitesRes.data) {
        const mapped = sitesRes.data
          .map((site: any) => ({
            id: site.id as string,
            title: site.title || '',
            url: site.url || '',
            description: site.description || '',
            image_url: site.image_url || '',
            sort_order: site.sort_order ?? 0,
          }))
          .sort((a, b) => a.sort_order - b.sort_order);
        setSliderSites(mapped);
      }

      if (!settingsRes.error && settingsRes.data) {
        const map: Record<string, string> = {};
        settingsRes.data.forEach((r: any) => (map[r.key] = r.value));
        setSliderSettings({
          web_effect: (map.web_effect as SliderSettings['web_effect']) || 'slide',
          web_scroll_interval_seconds: map.web_scroll_interval_seconds || '5',
          web_transition_duration_seconds: map.web_transition_duration_seconds || '0.8',
        });
      }

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

  const saveSlider = async () => {
    setSaving(true);
    const errors: string[] = [];

    const { error: settingsError } = await supabase.from('ad_carousel_settings').upsert(
      [
        { key: 'web_effect', value: sliderSettings.web_effect },
        { key: 'web_scroll_interval_seconds', value: sliderSettings.web_scroll_interval_seconds },
        { key: 'web_transition_duration_seconds', value: sliderSettings.web_transition_duration_seconds },
      ],
      { onConflict: 'key' }
    );
    if (settingsError) errors.push(`Settings: ${settingsError.message}`);

    const updatedSites = [...sliderSites];
    for (let i = 0; i < updatedSites.length; i++) {
      const site = updatedSites[i];
      if (site.id.startsWith('new-')) {
        const { data, error } = await supabase
          .from('portfolio_sites')
          .insert({
            title: site.title,
            url: site.url || null,
            description: site.description,
            image_url: site.image_url || null,
            sort_order: site.sort_order,
          })
          .select()
          .single();
        if (error) {
          errors.push(`${site.title || 'New site'}: ${error.message}`);
        } else if (data) {
          updatedSites[i] = { ...site, id: data.id as string };
        }
      } else {
        const { error } = await supabase
          .from('portfolio_sites')
          .update({
            title: site.title,
            url: site.url || null,
            description: site.description,
            image_url: site.image_url || null,
            sort_order: site.sort_order,
          })
          .eq('id', site.id);
        if (error) errors.push(`${site.title || site.id}: ${error.message}`);
      }
    }

    for (const id of deletedSiteIds) {
      if (!id.startsWith('new-')) {
        const { error } = await supabase.from('portfolio_sites').delete().eq('id', id);
        if (error) errors.push(`Delete ${id}: ${error.message}`);
      }
    }

    setDeletedSiteIds([]);
    setSliderSites(updatedSites);
    setSaving(false);

    if (errors.length > 0) {
      alert('Some changes were not saved:\n\n' + errors.join('\n'));
      return;
    }

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
    const { error } = await supabase.storage.from('portfolio-images').upload(path, file);
    if (error) { alert('Upload failed: ' + error.message); return; }
    const { data: { publicUrl } } = supabase.storage.from('portfolio-images').getPublicUrl(path);
    updateField(id, 'img', publicUrl);
  };

  const uploadSliderImage = async (id: string, file: File) => {
    const ext = file.name.split('.').pop();
    const path = `slider/${id}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('portfolio-images').upload(path, file);
    if (error) { alert('Upload failed: ' + error.message); return; }
    const { data: { publicUrl } } = supabase.storage.from('portfolio-images').getPublicUrl(path);
    updateSliderField(id, 'image_url', publicUrl);
  };

  const capturePreview = async (id: string) => {
    const site = sliderSites.find(s => s.id === id);
    if (!site?.url) { alert('Enter a website URL first, then capture its preview.'); return; }
    try {
      const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(site.url)}&screenshot=true&viewport=1280x800&meta=false`);
      const json = await res.json();
      const shot = json?.data?.screenshot?.url;
      if (!shot) { alert('Could not capture a preview for this site.'); return; }
      updateSliderField(id, 'image_url', shot);
    } catch {
      alert('Could not capture a preview for this site.');
    }
  };

  const updateSliderField = (id: string, field: keyof SliderSite, value: string | number) => {
    setSliderSites(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addSliderSite = () => {
    const id = `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setSliderSites(prev => [
      ...prev,
      { id, title: '', url: '', description: '', image_url: '', sort_order: prev.length },
    ]);
  };

  const removeSliderSite = (id: string) => {
    setSliderSites(prev => prev.filter(s => s.id !== id));
    setDeletedSiteIds(prev => [...prev, id]);
  };

  const moveSliderSite = (index: number, dir: -1 | 1) => {
    setSliderSites(prev => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      const tmp = next[index];
      next[index] = next[target];
      next[target] = tmp;
      return next.map((s, i) => ({ ...s, sort_order: i }));
    });
  };

  const showSaved = () => (
    <span className="inline-flex items-center gap-2 text-green-600 text-sm font-semibold">Saved!</span>
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Portfolio Content</h1>
        {saved && showSaved()}
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <button onClick={() => setTab('projects')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === 'projects' ? 'bg-[#1a1f3a] text-white' : 'bg-white text-slate-700 hover:bg-slate-100'}`}>
          Projects
        </button>
        <button onClick={() => setTab('slider')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === 'slider' ? 'bg-[#1a1f3a] text-white' : 'bg-white text-slate-700 hover:bg-slate-100'}`}>
          Website Slider
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-[#4a90e2]" /></div>
      ) : tab === 'projects' ? (
        <>
          <div className="flex justify-end mb-4">
            <button onClick={save} disabled={saving}
              className="flex items-center gap-2 bg-[#1a1f3a] hover:bg-[#252b4d] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Changes
            </button>
          </div>
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
        </>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Slider Settings</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Effect</label>
                <select
                  value={sliderSettings.web_effect}
                  onChange={e => setSliderSettings(s => ({ ...s, web_effect: e.target.value as SliderSettings['web_effect'] }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2] bg-white"
                >
                  <option value="slide">Scroll / Slide</option>
                  <option value="fade">Fade</option>
                  <option value="coverflow">Coverflow</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Oscillation time (seconds)</label>
                <input
                  type="number"
                  min={1}
                  step="0.5"
                  value={sliderSettings.web_scroll_interval_seconds}
                  onChange={e => setSliderSettings(s => ({ ...s, web_scroll_interval_seconds: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Transition duration (seconds)</label>
                <input
                  type="number"
                  min={0.1}
                  step="0.1"
                  value={sliderSettings.web_transition_duration_seconds}
                  onChange={e => setSliderSettings(s => ({ ...s, web_transition_duration_seconds: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2]"
                />
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Oscillation time is how long each slide stays before moving. Transition duration is the speed of the animation.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Sites & Apps</h3>
              <button onClick={addSliderSite}
                className="flex items-center gap-1.5 bg-[#4a90e2] hover:bg-[#3a7bc8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <Plus size={16} /> Add Site / App
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Add a website URL, or leave it empty and just add an image for apps or projects that aren't online.
            </p>

            <div className="space-y-3">
              {sliderSites.map((site, index) => (
                <div key={site.id} className="flex gap-3 items-start bg-slate-50 rounded-lg p-3">
                  <div className="flex flex-col gap-1 pt-1">
                    <button onClick={() => moveSliderSite(index, -1)} disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-[#4a90e2] disabled:opacity-30 transition-colors">
                      <ArrowUp size={14} />
                    </button>
                    <button onClick={() => moveSliderSite(index, 1)} disabled={index === sliderSites.length - 1}
                      className="p-1 text-slate-400 hover:text-[#4a90e2] disabled:opacity-30 transition-colors">
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  {site.image_url && (
                    <img src={site.image_url} alt="" className="w-24 h-16 rounded object-cover shrink-0 border border-slate-200" />
                  )}

                  <div className="flex-1 space-y-2 min-w-0">
                    <input value={site.title} onChange={e => updateSliderField(site.id, 'title', e.target.value)}
                      placeholder="Title (e.g. Prefetch Systems)"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2]" />
                    <input value={site.url} onChange={e => updateSliderField(site.id, 'url', e.target.value)}
                      placeholder="Website URL (optional — leave empty for apps not online)"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2]" />
                    <div className="flex gap-2 flex-wrap">
                      <input value={site.image_url} onChange={e => updateSliderField(site.id, 'image_url', e.target.value)}
                        placeholder="Image URL (optional)"
                        className="flex-1 min-w-[160px] px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2]" />
                      <label className="flex items-center gap-2 bg-white border border-slate-200 hover:border-[#4a90e2] text-slate-700 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors shrink-0">
                        <Upload size={16} /> Upload
                        <input type="file" accept="image/*" className="hidden"
                          onChange={e => { const f = e.target.files?.[0]; if (f) uploadSliderImage(site.id, f); }} />
                      </label>
                      <button onClick={() => capturePreview(site.id)}
                        className="flex items-center gap-2 bg-white border border-slate-200 hover:border-[#4a90e2] text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors shrink-0">
                        <Camera size={16} /> Capture Preview
                      </button>
                    </div>
                  </div>

                  <button onClick={() => removeSliderSite(site.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={saveSlider} disabled={saving}
              className="flex items-center gap-2 bg-[#1a1f3a] hover:bg-[#252b4d] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Changes
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPortfolioPage;
