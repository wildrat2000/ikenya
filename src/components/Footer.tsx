import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COMPANY, SERVICES } from '@/data/site';
import { Mail, Phone, MapPin, Facebook, MessageCircle, ArrowUpRight } from 'lucide-react';

const SOCIALS = [
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61593200432627', icon: Facebook },
  { label: 'WhatsApp', href: `https://wa.me/${COMPANY.phone.replace(/[^0-9]/g, '')}`, icon: MessageCircle },
];

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
];

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#10142a] text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2">
            <img src={COMPANY.logo} alt="Itukarua Kenya" className="h-11 w-11 object-contain" />
            <span className="text-white font-bold text-lg">Itukarua <span className="text-[#4a90e2]">Kenya</span></span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            {COMPANY.tagline}. Secure, modern websites and IT infrastructure for organizations in Nairobi and across Kenya.
          </p>
          <div className="mt-5 flex gap-3">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#4a90e2] text-slate-300 hover:text-white flex items-center justify-center transition-colors">
                <s.icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            {QUICK_LINKS.map((l) => (
              <li key={l.label}>
                <button onClick={() => navigate(l.to)} className="hover:text-[#4a90e2] transition-colors text-left flex items-center gap-1.5 group">
                  <ArrowUpRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Services</h4>
          <ul className="space-y-2.5 text-sm">
            {SERVICES.slice(0, 5).map((s) => (
              <li key={s.id}>
                <button onClick={() => navigate(`/services/${s.id}`)} className="hover:text-[#4a90e2] transition-colors text-left">
                  {s.title}
                </button>
              </li>
            ))}
            <li>
              <button onClick={() => navigate('/services')} className="text-[#4a90e2] font-semibold hover:text-[#3a7bc8] transition-colors">
                View All Services
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Get In Touch</h4>
          <ul className="space-y-3.5 text-sm">
            <li>
              <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-3 hover:text-[#4a90e2] transition-colors">
                <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0"><Mail size={15} className="text-[#4a90e2]" /></span>
                {COMPANY.email}
              </a>
            </li>
            <li>
              <a href={`tel:${COMPANY.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-3 hover:text-[#4a90e2] transition-colors">
                <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0"><Phone size={15} className="text-[#4a90e2]" /></span>
                {COMPANY.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0"><MapPin size={15} className="text-[#4a90e2]" /></span>
              {COMPANY.location}
            </li>
          </ul>
          <a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}
            className="mt-5 inline-flex items-center gap-2 bg-[#4a90e2] hover:bg-[#3a7bc8] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
            Start a Project <ArrowUpRight size={16} />
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-sm text-slate-500 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</span>
          <span>Founded {COMPANY.founded} · {COMPANY.location}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
