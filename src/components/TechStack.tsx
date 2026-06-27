import React from 'react';
import { TECH, TESTIMONIALS } from '@/data/site';
import { Quote } from 'lucide-react';

const TechStack: React.FC = () => {
  return (
    <section id="tech" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[#4a90e2] font-semibold uppercase tracking-wider text-sm">Technology Stack</span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold text-[#1a1f3a]">
            Built with proven, modern tools
          </h2>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {TECH.map((t) => (
            <span
              key={t}
              className="px-5 py-3 bg-white border border-slate-200 rounded-xl font-semibold text-[#1a1f3a] shadow-sm hover:border-[#4a90e2] hover:text-[#4a90e2] transition-colors"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-20 text-center max-w-2xl mx-auto">
          <span className="text-[#4a90e2] font-semibold uppercase tracking-wider text-sm">Testimonials</span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold text-[#1a1f3a]">
            What our clients say
          </h2>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm">
              <Quote className="text-[#f39c12]" size={28} />
              <p className="mt-4 text-slate-700 leading-relaxed">{t.quote}</p>
              <div className="mt-5 pt-5 border-t border-slate-100">
                <div className="font-bold text-[#1a1f3a]">{t.name}</div>
                <div className="text-sm text-slate-500">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
