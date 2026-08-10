import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Save, Plus, X, GripVertical, Upload } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import Icon from '@/components/Icon';
import { GalleryItem } from '@/data/site';

interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  points: string[];
  icon: string;
  img: string;
  gallery: GalleryItem[];
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleImgInputRef = useRef<HTMLInputElement>(null);
  const [uploadingGalleryId, setUploadingGalleryId] = useState<string | null>(null);

  const addGalleryItem = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, gallery: [...(s.gallery || []), { url: '', link: '' }] } : s));
  };

  const removeGalleryItem = (id: string, idx: number) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, gallery: (s.gallery || []).filter((_, i) => i !== idx) } : s));
  };

  const updateGalleryItem = (id: string, idx: number, field: keyof GalleryItem, value: string) => {
    setServices(prev => prev.map(s => s.id === id ? {
      ...s, gallery: (s.gallery || []).map((item, i) => i === idx ? { ...item, [field]: value } : item)
    } : s));
  };

  const uploadTitleImage = async (id: string, file: File) => {
    const ext = file.name.split('.').pop();
    const path = `service-title/${id}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('portfolio-images').upload(path, file);
    if (error) { alert('Upload failed: ' + error.message); return; }
    const { data: { publicUrl } } = supabase.storage.from('portfolio-images').getPublicUrl(path);
    update(id, 'img', publicUrl);
  };

  const uploadGalleryImage = async (id: string, file: File) => {
    const ext = file.name.split('.').pop();
    const path = `service-gallery/${id}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('portfolio-images').upload(path, file);
    if (error) { alert('Upload failed: ' + error.message); return; }
    const { data: { publicUrl } } = supabase.storage.from('portfolio-images').getPublicUrl(path);
    setServices(prev => prev.map(s => s.id === id ? { ...s, gallery: [...(s.gallery || []), { url: publicUrl, link: '' }] } : s));
    setUploadingGalleryId(null);
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
                      <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Image</label>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <input value={s.img} onChange={e => update(s.id, 'img', e.target.value)}
                            placeholder="Image URL..."
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2]" />
                        </div>
                        <label className="flex items-center gap-2 bg-white border border-slate-200 hover:border-[#4a90e2] text-slate-700 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors shrink-0">
                          <Upload size={16} /> Upload
                          <input type="file" accept="image/*" className="hidden"
                            ref={titleImgInputRef}
                            onChange={e => { const f = e.target.files?.[0]; if (f) uploadTitleImage(s.id, f); e.target.value = ''; }} />
                        </label>
                      </div>
                      {s.img && (
                        <img src={s.img} alt="" className="mt-2 h-28 w-full object-cover rounded-lg border border-slate-200" />
                      )}
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

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Gallery Images <span className="text-slate-300 normal-case">({(s.gallery?.length || 0)}/4)</span>
                      </span>
                      <div className="flex gap-2">
                        <input type="file" accept="image/*" className="hidden"
                          ref={fileInputRef}
                          onChange={e => {
                            const f = e.target.files?.[0];
                            if (f) { setUploadingGalleryId(s.id); uploadGalleryImage(s.id, f); }
                            e.target.value = '';
                          }} />
                        <button onClick={() => fileInputRef.current?.click()} disabled={uploadingGalleryId === s.id}
                          className="flex items-center gap-1 text-xs text-[#4a90e2] font-semibold hover:text-[#3a7bc8] disabled:opacity-50">
                          <Upload size={12} /> Upload Image
                        </button>
                        <button onClick={() => addGalleryItem(s.id)} disabled={(s.gallery?.length || 0) >= 4}
                          className="flex items-center gap-1 text-xs text-[#4a90e2] font-semibold hover:text-[#3a7bc8] disabled:opacity-50">
                          <Plus size={12} /> Add Image
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {(s.gallery || []).map((item, i) => (
                        <div key={i} className="flex gap-3 items-start bg-slate-50 rounded-lg p-3">
                          {item.url && (
                            <img src={item.url} alt="" className="w-20 h-16 rounded object-cover shrink-0 border border-slate-200" />
                          )}
                          <div className="flex-1 space-y-2">
                            <input value={item.url} onChange={e => updateGalleryItem(s.id, i, 'url', e.target.value)}
                              placeholder="Image URL..."
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2]" />
                            <input value={item.link || ''} onChange={e => updateGalleryItem(s.id, i, 'link', e.target.value)}
                              placeholder="Optional link URL..."
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4a90e2]" />
                          </div>
                          <button onClick={() => removeGalleryItem(s.id, i)} className="p-2 text-slate-400 hover:text-red-500 transition-colors shrink-0">
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