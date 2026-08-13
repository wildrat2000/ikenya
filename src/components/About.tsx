import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Server, Wifi, Users, Zap, X, Calendar, Globe, Users2, MonitorPlay, Database, HardDrive, Building2, ExternalLink, Mail, FileText, Terminal, Phone, Wrench } from 'lucide-react';
import { SERVICE_SKILLS } from '@/data/site';
import { SIM_LOGO } from '@/data/simLogo';
import { ACT_LOGO } from '@/data/actLogo';
import { DAI_LOGO, AFEX_LOGO } from '@/data/workLogos';

const roles = [
  'Microsoft 365 & SharePoint Online Specialist',
  'Systems Administrator',
  'Connectivity Infrastructure Support',
  'Help Desk Specialist',
  'Remote Contractor',
];

const roleModals = {
  sim: {
    gradient: 'from-[#7c3aed] via-[#4f46e5] to-[#0ea5e9]',
    accent: 'from-[#7c3aed] to-[#0ea5e9]',
    positions: [
      {
        logo: SIM_LOGO,
        title: 'SharePoint Online Administrator',
        company: 'SIM International',
        dates: 'May 2023 – Nov 2024',
        summary:
          'Led the development of global intranet portals for 78 countries, trained over 80 regional trainers, and supported more than 400 SharePoint portals serving a user base of slightly over 3,000 users.',
        highlights: [
          { icon: Globe, title: '78 countries', desc: 'Global intranet portals deployed across SIM International.' },
          { icon: Users2, title: '80+ trainers', desc: 'Regional trainers empowered to own and operate their portals.' },
          { icon: MonitorPlay, title: '400+ portals', desc: 'SharePoint portal environments built and supported end-to-end.' },
          { icon: Zap, title: '3,000+ users', desc: 'A growing global user base supported every day.' },
        ],
        footer: 'A proven track record designing and scaling enterprise collaboration platforms for a worldwide non-profit organization.',
      },
    ],
  },
  pact: {
    gradient: 'from-[#dc2626] via-[#ea580c] to-[#f59e0b]',
    accent: 'from-[#dc2626] to-[#f59e0b]',
    positions: [
      {
        logo: ACT_LOGO,
        title: 'ICT Manager',
        company: 'PACT Inc / PACT Kenya (now ACT)',
        dates: 'Jan 2008 – Nov 2019',
        summary:
          'Administered Windows Server environments, SQL databases, ACCPAC, and Microsoft Dynamics HRM. Supported 60+ staff nationwide and managed the Office 365 full E1 solution for 200+ users.',
        highlights: [
          { icon: Server, title: 'Windows Servers', desc: 'Administered and maintained reliable Windows Server environments.' },
          { icon: Database, title: 'SQL & ACCPAC', desc: 'Managed SQL databases and the ACCPAC ERP accounting system.' },
          { icon: Building2, title: '60+ staff', desc: 'Nationwide support keeping teams productive and connected.' },
          { icon: HardDrive, title: 'Office 365 E1', desc: 'Full E1 solution managed for 200+ users across the organization.' },
        ],
        footer: 'Over a decade delivering dependable IT operations and enterprise systems for an international development organization.',
      },
    ],
  },
  helpdesk: {
    gradient: 'from-[#0e7490] via-[#0891b2] to-[#06b6d4]',
    accent: 'from-[#0e7490] to-[#06b6d4]',
    positions: [
      {
        logo: DAI_LOGO,
        location: '(South Sudan)',
        title: 'ICT Specialist',
        company: 'Development Alternatives Inc (USAID Contractor)',
        dates: 'Oct 2006 – Jan 2008',
        summary:
          'Administered Windows 2003 Server environments and Lotus Domino ERP systems for the Kenya and Sudan offices. Provided VPN and LAN/WAN support, remote connectivity, document management, and server/client email replication administration for 30+ users.',
        highlights: [
          { icon: Server, title: 'Windows 2003 Servers', desc: 'Administered and maintained Windows 2003 Server environments.' },
          { icon: Database, title: 'Lotus Domino ERP', desc: 'Managed Lotus Domino ERP systems for Kenya and Sudan offices.' },
          { icon: Wifi, title: 'VPN & LAN/WAN', desc: 'Remote connectivity, VPN, and LAN/WAN support across offices.' },
          { icon: Mail, title: '30+ users', desc: 'Server/client email replication administration for 30+ users.' },
        ],
        footer: 'Delivered dependable ICT operations and remote connectivity for a USAID-funded development contractor.',
      },
      {
        logo: AFEX_LOGO,
        title: 'VSAT Technician',
        company: 'Africa Expeditions (United Nations Operation LifeLine Sudan Contractor)',
        dates: 'Feb 2005 – Sept 2006',
        summary:
          'Maintained VSAT and ADSL connectivity for 20+ INGO clients under UN-OLS. Supported Fedora and Ubuntu Linux-based email and billing servers.',
        highlights: [
          { icon: Wifi, title: 'VSAT & ADSL', desc: 'Maintained VSAT and ADSL connectivity for 20+ INGO clients.' },
          { icon: Globe, title: 'UN-OLS', desc: 'Connectivity services delivered under the UN Operation LifeLine Sudan.' },
          { icon: Terminal, title: 'Linux Servers', desc: 'Supported Fedora and Ubuntu Linux-based email servers.' },
          { icon: FileText, title: 'Billing Servers', desc: 'Maintained Linux-based email and billing systems.' },
        ],
        footer: 'Kept humanitarian aid organizations online across South Sudan with reliable satellite and terrestrial connectivity.',
      },
    ],
  },
  wananchi: {
    gradient: 'from-[#059669] via-[#10b981] to-[#34d399]',
    accent: 'from-[#059669] to-[#34d399]',
    positions: [
      {
        title: 'Customer Service Coordinator / Network Technician',
        company: 'Wananchi Online',
        dates: 'Oct 2000 – Jan 2005',
        summary:
          'Delivered helpdesk and on-site technical support for dial-up and dedicated connectivity clients. Led a team of 10 service executives to keep customers connected and satisfied.',
        highlights: [
          { icon: Phone, title: 'Helpdesk', desc: 'First-line helpdesk delivery for internet connectivity clients.' },
          { icon: Wrench, title: 'On-site Support', desc: 'On-site technical support for dial-up and dedicated clients.' },
          { icon: Users2, title: 'Team of 10', desc: 'Led and coached a team of 10 service executives.' },
          { icon: Wifi, title: 'Dial-up & Dedicated', desc: 'Supported dial-up and dedicated customer connections.' },
        ],
        footer: 'Early-career grounding in ISP customer support and connectivity infrastructure service delivery.',
      },
    ],
  },
};

const values = [
  { icon: Zap, title: 'Performance', desc: 'Speed, security, and maintainability in every build' },
  { icon: ShieldCheck, title: 'Reliability', desc: 'Reduced downtime and dependable IT service delivery' },
  { icon: Server, title: 'Best Practices', desc: 'Modern web development and infrastructure standards' },
  { icon: Users, title: 'Client Focus', desc: 'Professional support and partnership over time' },
];

const About: React.FC = () => {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState<'sim' | 'pact' | 'helpdesk' | 'wananchi' | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveRole(null);
    };
    if (activeRole) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [activeRole]);

  const roleKeyForIndex = (i: number): 'sim' | 'pact' | 'helpdesk' | 'wananchi' | null =>
    i === 0 ? 'sim' : i === 1 ? 'pact' : i === 2 ? 'wananchi' : i === 3 ? 'helpdesk' : null;

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
                  onClick={() => roleKeyForIndex(i) && setActiveRole(roleKeyForIndex(i))}
                  disabled={!roleKeyForIndex(i)}
                  className={`bg-white/10 border border-white/10 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                    roleKeyForIndex(i)
                      ? 'bg-gradient-to-r from-[#7c3aed]/30 to-[#0ea5e9]/30 border-[#7c3aed]/40 text-white hover:from-[#7c3aed]/50 hover:to-[#0ea5e9]/50 cursor-pointer inline-flex items-center gap-1.5'
                      : ''
                  }`}
                >
                  {r}
                  {roleKeyForIndex(i) && <ExternalLink size={12} />}
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

      {activeRole && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setActiveRole(null)} />
          <div className="relative w-full max-w-lg bg-[#0f172a] rounded-3xl shadow-2xl border border-white/10 animate-fade-in max-h-[85vh] overflow-y-auto">
            {roleModals[activeRole].positions.map((pos, pi) => (
              <div key={pi} className={pi > 0 ? 'border-t border-white/10' : ''}>
                <div className={`bg-gradient-to-br ${roleModals[activeRole].gradient} p-6 ${pi === 0 ? '' : 'pb-4'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center shrink-0">
                        {pos.logo ? (
                          <img src={pos.logo} alt={`${pos.company} logo`} className="w-full h-full object-contain" />
                        ) : (
                          <div className={`w-full h-full rounded-xl bg-gradient-to-br ${roleModals[activeRole].accent} flex items-center justify-center`}>
                            <Wifi size={28} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        {pos.location && (
                          <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">{pos.location}</p>
                        )}
                        <h3 className="text-white font-extrabold text-lg leading-tight">{pos.title}</h3>
                        <p className="text-indigo-200 text-sm font-semibold mt-0.5">{pos.company}</p>
                        <span className="inline-flex items-center gap-1.5 mt-2 bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                          <Calendar size={12} /> {pos.dates}
                        </span>
                      </div>
                    </div>
                    {pi === 0 && (
                      <button
                        onClick={() => setActiveRole(null)}
                        aria-label="Close"
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-slate-300 text-sm leading-relaxed">{pos.summary}</p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {pos.highlights.map((h) => {
                      const Icon = h.icon;
                      return (
                        <div key={h.title} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${roleModals[activeRole].accent} flex items-center justify-center mb-3`}>
                            <Icon size={18} className="text-white" />
                          </div>
                          <p className="text-white font-bold">{h.title}</p>
                          <p className="text-slate-400 text-xs mt-1 leading-relaxed">{h.desc}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className={`mt-5 rounded-2xl bg-gradient-to-r ${roleModals[activeRole].accent}/20 border border-white/10 p-4 text-sm text-slate-300`}>
                    {pos.footer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default About;
