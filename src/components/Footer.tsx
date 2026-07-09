import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COMPANY, SERVICES } from '@/data/site';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const goHome = (id: string) => { navigate('/'); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100); };

  return (
    <footer className="bg-[#10142a] text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2">
            <img src={COMPANY.logo} alt="Itukarua Kenya" className="h-11 w-11 object-contain" />
            <span className="text-white font-bold text-lg">Itukarua <span className="text-[#4a90e2]">Kenya</span></span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Secure, modern websites and IT infrastructure for organizations in Nairobi and across Kenya.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Services</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
            {SERVICES.map((s) => (
              <button key={s.id} onClick={() => go('services')} className="hover:text-[#4a90e2] transition-colors text-left">
                {s.title}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
            <button onClick={() => go('about')} className="hover:text-[#4a90e2] text-left">About Us</button>
            <button onClick={() => go('services')} className="hover:text-[#4a90e2] text-left">Who We Serve</button>
            <button onClick={() => go('portfolio')} className="hover:text-[#4a90e2] text-left">Portfolio</button>
            <button onClick={() => goHome('tech')} className="hover:text-[#4a90e2] text-left">Technology</button>
            <button onClick={() => go('contact')} className="hover:text-[#4a90e2] text-left">Contact</button>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Get In Touch</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3"><Mail size={16} className="text-[#4a90e2]" /> {COMPANY.email}</li>
            <li className="flex items-center gap-3"><Phone size={16} className="text-[#4a90e2]" /> {COMPANY.phone}</li>
            <li className="flex items-center gap-3"><MapPin size={16} className="text-[#4a90e2]" /> {COMPANY.location}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-sm text-slate-500 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} Itukarua Kenya. All rights reserved.</span>
          <span>Founded {COMPANY.founded} · Nairobi, Kenya</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
