import React, { useEffect, useState } from 'react';
import { ArrowRight, X, Globe, Server, BadgeCheck, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { SERVICES as FALLBACK } from '@/data/site';

interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  points: string[];
  icon: string;
  img: string;
}

const HOSTING_HIGHLIGHTS = [
  { icon: Globe, title: 'Domain strategy & setup', desc: 'Right domain names, registrars, and DNS configuration for your brand.' },
  { icon: Server, title: 'Hosting selection & migration', desc: 'The right hosting tier, moved without downtime or email disruption.' },
  { icon: RefreshCcw, title: 'Renewals & support guidance', desc: 'Timely renewals and ongoing advice so your site never lapses.' },
  { icon: BadgeCheck, title: 'Reliable uptime', desc: 'Stable hosting and business email with SSL and backups in place.' },
];

const Services: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>(FALLBACK);
  const [activeHosting, setActiveHosting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from('page_content').select('content').eq('page', 'services').eq('section', 'services_list').single()
      .then(({ data }) => {
        if (data?.content) setServices(data.content as ServiceItem[]);
      });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveHosting(false);
    };
    if (activeHosting) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [activeHosting]);

  const hosting = services.find((s) => s.id === 'hosting');

  return (
    <section id="services" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[#4a90e2] font-semibold uppercase tracking-wider text-sm">What We Do</span>
          <h1 className="mt-3 text-3xl lg:text-4xl font-extrabold text-[#1a1f3a]">
            End-to-end web & IT capabilities
          </h1>
          <p className="mt-4 text-slate-600">
            From modern web development to dependable infrastructure, we deliver technology that performs
            and stays easy to manage over time.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                if (s.id === 'hosting') setActiveHosting(true);
                else navigate(`/contact?service=${encodeURIComponent(s.title)}`);
              }}
              className="group text-left bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="aspect-[16/9] rounded-xl overflow-hidden relative">
                <img src={s.img} alt={s.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-lg font-bold text-white">{s.title}</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[#4a90e2] font-semibold text-sm group-hover:gap-2.5 transition-all">
                  {s.id === 'hosting' ? 'Explore Details' : 'Enquire'} <ArrowRight size={15} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeHosting && hosting && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setActiveHosting(false)} />
          <div className="relative w-full max-w-lg bg-[#0f172a] rounded-3xl shadow-2xl border border-white/10 animate-fade-in max-h-[85vh] overflow-y-auto">
            <div className="bg-gradient-to-br from-[#0ea5e9] via-[#3b82f6] to-[#6366f1] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center shrink-0">
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#6366f1] flex items-center justify-center">
                      <Globe size={28} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-extrabold text-lg leading-tight">{hosting.title}</h3>
                    <p className="text-indigo-200 text-sm font-semibold mt-0.5">Domain, hosting & renewals</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveHosting(false)}
                  aria-label="Close"
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-slate-300 text-sm leading-relaxed">{hosting.desc}</p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {HOSTING_HIGHLIGHTS.map((h) => {
                  const Icon = h.icon;
                  return (
                    <div key={h.title} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#6366f1] flex items-center justify-center mb-3">
                        <Icon size={18} className="text-white" />
                      </div>
                      <p className="text-white font-bold">{h.title}</p>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">{h.desc}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl bg-gradient-to-r from-[#0ea5e9]/20 to-[#6366f1]/20 border border-white/10 p-4 text-sm text-slate-300">
                Let us handle your domain, hosting, and renewals so your website stays fast, secure, and always online.
              </div>

              <button
                onClick={() => { setActiveHosting(false); navigate(`/contact?service=${encodeURIComponent(hosting.title)}`); }}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-[#f39c12] hover:bg-[#e08e0b] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Enquire About This Service <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Services;
