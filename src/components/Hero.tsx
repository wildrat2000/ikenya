import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Wrench } from 'lucide-react';
import { COMPANY, STATS } from '@/data/site';

const Hero: React.FC = () => {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="hero" className="min-h-screen flex items-center bg-[#1a1f3a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16 w-full grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <a
            href="http://localhost:8081/"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-[170px] hover:scale-105 transition-transform"
          >
            <div className="relative rounded-xl overflow-hidden shadow-xl aspect-[4/5]">
              <img src="/electrician.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-3">
                <span className="text-white text-sm font-bold leading-tight">Looking for a Hustle?</span>
                <span className="text-[#00b894] text-xs font-semibold mt-1 flex items-center gap-1">
                  Jobs Portal &rarr;
                </span>
              </div>
            </div>
          </a>
          <span className="inline-flex items-center gap-2 bg-[#4a90e2]/15 border border-[#4a90e2]/30 text-[#4a90e2] px-4 py-1.5 rounded-full text-sm font-medium">
            <ShieldCheck size={16} /> Nairobi-based IT & Web Partner Since {COMPANY.founded}
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            {COMPANY.tagline}
          </h1>
          <p className="mt-6 text-lg text-slate-300 max-w-xl leading-relaxed">{COMPANY.positioning}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => go('contact')}
              className="inline-flex items-center gap-2 bg-[#f39c12] hover:bg-[#e08e0b] text-white px-7 py-3.5 rounded-lg font-semibold transition-colors shadow-lg"
            >
              Get Started <ArrowRight size={18} />
            </button>
            <button
              onClick={() => go('services')}
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
          <img src="/Homepage.png" alt="" className="w-full rounded-2xl object-cover" />
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
    </section>
  );
};

export default Hero;
