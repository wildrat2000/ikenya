import React from 'react';
import { ShieldCheck, Server, Wifi, Users, Zap } from 'lucide-react';

const roles = [
  'Microsoft 365 & SharePoint Online Specialist',
  'Systems Administrator',
  'Infrastructure Consultant',
  'Help Desk Specialist',
  'Remote Contractor',
];

const skills = [
  'Microsoft 365', 'SharePoint', 'Network Infrastructure',
  'Systems Administration', 'Help Desk', 'Cloud Solutions',
  'Security & Compliance', 'Server Deployment',
];

const values = [
  { icon: Zap, title: 'Performance', desc: 'Speed, security, and maintainability in every build' },
  { icon: ShieldCheck, title: 'Reliability', desc: 'Reduced downtime and dependable IT service delivery' },
  { icon: Server, title: 'Best Practices', desc: 'Modern web development and infrastructure standards' },
  { icon: Users, title: 'Client Focus', desc: 'Professional support and partnership over time' },
];

const About: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#1a1f3a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div className="relative">
            <img
              src="/director.jpg"
              alt="Samuel Mbugua Wambaa – Director"
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
            <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold leading-tight">
              Director &amp; Lead Consultant
            </h2>
            <p className="mt-2 text-lg font-semibold text-slate-300">
              Samuel Mbugua Wambaa
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {roles.map((r) => (
                <span key={r} className="bg-white/10 border border-white/10 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-full">
                  {r}
                </span>
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
              {skills.map((s) => (
                <span key={s} className="bg-[#4a90e2]/10 border border-[#4a90e2]/20 text-[#4a90e2] text-xs px-3 py-1.5 rounded-md">
                  {s}
                </span>
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
    </section>
  );
};

export default About;
