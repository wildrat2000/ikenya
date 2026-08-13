import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Wrench, X, Phone } from 'lucide-react';
import { COMPANY, STATS } from '@/data/site';
import FAQsModal from './FAQsModal';

const Hero: React.FC = () => {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);
  const [showFAQs, setShowFAQs] = useState(false);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => setVisible(false), 400);
  }, []);

  useEffect(() => {
    const timer = setTimeout(handleClose, 5000);
    return () => clearTimeout(timer);
  }, [handleClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [handleClose]);

  return (
    <section id="hero" className="min-h-screen flex items-center bg-[#1a1f3a] relative">
      {visible && (
        <div
          className={`fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 z-50 w-[230px] lg:w-[300px] rounded-xl overflow-hidden shadow-2xl ${closing ? 'animate-fly-out-right' : 'animate-fly-in-right'}`}
        >
          <button onClick={handleClose}
            className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
          <a href="https://itukarua3.vercel.app/" target="_blank" rel="noopener noreferrer" className="block">
            <div className="relative aspect-[16/10]">
              <img src="/electrician.jpg" alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 flex flex-col justify-center items-center px-3 text-center">
                <span className="text-white text-xl lg:text-2xl font-['Changa_One'] tracking-wide leading-snug">Looking for a Hustle?</span>
                <span className="text-[#00b894] text-sm lg:text-base font-['Changa_One'] mt-2">Jobs Portal &rarr;</span>
              </div>
            </div>
          </a>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16 w-full grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <span className="inline-flex items-center gap-2 bg-[#4a90e2]/15 border border-[#4a90e2]/30 text-[#4a90e2] px-4 py-1.5 rounded-full text-sm font-medium">
            <ShieldCheck size={16} /> Nairobi-based IT & Web Partner Since {COMPANY.founded}
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            {COMPANY.tagline}
          </h1>
          <p className="mt-6 text-lg text-slate-300 max-w-xl leading-relaxed">{COMPANY.positioning}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => setShowFAQs(true)}
              className="inline-flex items-center gap-2 bg-[#f39c12] hover:bg-[#e08e0b] text-white px-7 py-3.5 rounded-lg font-semibold transition-colors shadow-lg"
            >
              <Phone size={18} /> Call / Help
            </button>
            <button
              onClick={() => navigate('/services')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3.5 rounded-lg font-semibold transition-colors backdrop-blur"
            >
              View Services
            </button>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-slate-300 text-sm">
            <span className="flex items-center gap-2"><Zap size={16} className="text-[#4a90e2]" /> Performance-focused</span>
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#4a90e2]" /> Security-first</span>
            <span className="flex items-center gap-2"><Wrench size={16} className="text-[#4a90e2]" /> Maintainable</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <img src="/Homepage.png" alt="" loading="lazy" className="w-full rounded-2xl object-cover" />
          <div className="grid grid-cols-4 gap-3">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 text-center"
              >
                <div className="text-lg font-extrabold text-[#4a90e2]">{s.value}</div>
                <div className="mt-0.5 text-xs text-slate-300">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <FAQsModal open={showFAQs} onClose={() => setShowFAQs(false)} />
    </section>
  );
};

export default Hero;
