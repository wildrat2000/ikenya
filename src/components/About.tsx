import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Server, Wifi, Users, Zap, X, Calendar, Globe, Users2, MonitorPlay, ExternalLink } from 'lucide-react';
import { SERVICE_SKILLS } from '@/data/site';
import { SIM_LOGO } from '@/data/simLogo';

const roles = [
  'Microsoft 365 & SharePoint Online Specialist',
  'Systems Administrator',
  'Infrastructure Consultant',
  'Help Desk Specialist',
  'Remote Contractor',
];

const values = [
  { icon: Zap, title: 'Performance', desc: 'Speed, security, and maintainability in every build' },
  { icon: ShieldCheck, title: 'Reliability', desc: 'Reduced downtime and dependable IT service delivery' },
  { icon: Server, title: 'Best Practices', desc: 'Modern web development and infrastructure standards' },
  { icon: Users, title: 'Client Focus', desc: 'Professional support and partnership over time' },
];

const roleHighlights = [
  { icon: Globe, title: '78 countries', desc: 'Global intranet portals deployed across SIM International.' },
  { icon: Users2, title: '80+ trainers', desc: 'Regional trainers empowered to own and operate their portals.' },
  { icon: MonitorPlay, title: '400+ portals', desc: 'SharePoint portal environments built and supported end-to-end.' },
  { icon: Zap, title: '3,000+ users', desc: 'A growing global user base supported every day.' },
];

const About: React.FC = () => {
  const navigate = useNavigate();
  const [showRole, setShowRole] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowRole(false);
    };
    if (showRole) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showRole]);

  return (
    <section id="about" className="py-20 lg:py-28 bg-[#1a1f3a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div className="relative">
            <img
              src="/director.jpg"
              alt="Samuel Mbugua Wambaa – Director"
              loading="lazy"
              className="w-full rounded-2xl object-cover max-h-[500px] ring-4 ring-[#4a90e2]/30 shadow-2xl"
            />
            <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-[#f39c12] to-[#e67e22] text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3">
              <span className="text-2xl font-extrabold">20+</span>
              <div className="text-xs font-medium leading-tight">
                Years<br />Experience
              </div>
            </div>
          </div>

          <div>
            <span className="text-[#4a90e2] font-semibold uppercase tracking-wider text-sm">About Us</span>
            <h1 className="mt-3 text-3xl lg:text-4xl font-extrabold leading-tight">
              Director &amp; Lead Consultant
            </h1>
            <p className="mt-2 text-lg font-semibold text-slate-300">
              Samuel Mbugua Wambaa
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {roles.map((r, i) => (
                <button
                  key={r}
                  onClick={() => i === 0 && setShowRole(true)}
                  disabled={i !== 0}
                  className={`bg-white/10 border border-white/10 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                    i === 0
                      ? 'bg-gradient-to-r from-[#7c3aed]/30 to-[#0ea5e9]/30 border-[#7c3aed]/40 text-white hover:from-[#7c3aed]/50 hover:to-[#0ea5e9]/50 cursor-pointer inline-flex items-center gap-1.5'
                      : ''
                  }`}
                >
                  {r}
                  {i === 0 && <ExternalLink size={12} />}
                </button>
              ))}
            </div>

            <div className="mt-6 border-l-4 border-[#4a90e2] pl-5">
              <p className="text-slate-300 leading-relaxed text-base">
                Samuel Mbugua Wambaa is a seasoned ICT Professional with over 20 years experience
                spanning from network management, systems administration, to enterprise-level solution
                deployments. My career has been defined by a hands-on approach to architecting,
                deploying, and supporting critical IT infrastructure for organizations ranging from
                local to international NGOs and private sector enterprises across East Africa.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {SERVICE_SKILLS.map((s) => (
                <button
                  key={s}
                  onClick={() => navigate(`/contact?service=${encodeURIComponent(s)}`)}
                  className="bg-[#4a90e2]/10 border border-[#4a90e2]/20 text-[#4a90e2] text-xs px-3 py-1.5 rounded-md hover:bg-[#4a90e2] hover:text-white transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-[#4a90e2]/20 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#4a90e2]" />
                </div>
                <h3 className="text-lg font-bold text-white">{v.title}</h3>
                <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>

      </div>

      {showRole && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowRole(false)} />
          <div className="relative w-full max-w-lg bg-[#0f172a] rounded-3xl shadow-2xl border border-white/10 animate-fade-in max-h-[85vh] overflow-y-auto">
            <div className="bg-gradient-to-br from-[#7c3aed] via-[#4f46e5] to-[#0ea5e9] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center">
                    <img src={SIM_LOGO} alt="SIM International logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-white font-extrabold text-lg leading-tight">SharePoint Online Administrator</h3>
                    <p className="text-indigo-200 text-sm font-semibold mt-0.5">SIM International</p>
                    <span className="inline-flex items-center gap-1.5 mt-2 bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                      <Calendar size={12} /> May 2023 – Nov 2024
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowRole(false)}
                  aria-label="Close"
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-slate-300 text-sm leading-relaxed">
                Led the development of global intranet portals for <strong className="text-white">78 countries</strong>,
                trained over <strong className="text-white">80 regional trainers</strong>, and supported
                more than <strong className="text-white">400 SharePoint portals</strong> serving a user base
                of slightly over <strong className="text-white">3,000 users</strong>.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {roleHighlights.map((h) => {
                  const Icon = h.icon;
                  return (
                    <div key={h.title} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#0ea5e9] flex items-center justify-center mb-3">
                        <Icon size={18} className="text-white" />
                      </div>
                      <p className="text-white font-bold">{h.title}</p>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">{h.desc}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl bg-gradient-to-r from-[#7c3aed]/20 to-[#0ea5e9]/20 border border-white/10 p-4 text-sm text-slate-300">
                A proven track record designing and scaling enterprise collaboration platforms for a
                worldwide non-profit organization.
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default About;
