import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { SERVICES } from '@/data/site';
import Icon from './Icon';

const Services: React.FC = () => {
  const go = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="services" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[#4a90e2] font-semibold uppercase tracking-wider text-sm">What We Do</span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold text-[#1a1f3a]">
            End-to-end web & IT capabilities
          </h2>
          <p className="mt-4 text-slate-600">
            From modern web development to dependable infrastructure, we deliver technology that performs
            and stays easy to manage over time.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <div
              key={s.id}
              className="group bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-[#1a1f3a] flex items-center justify-center text-[#4a90e2] group-hover:bg-[#4a90e2] group-hover:text-white transition-colors">
                <Icon name={s.icon} className="w-7 h-7" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-[#1a1f3a]">{s.title}</h3>
              <p className="mt-2 text-slate-600 text-sm leading-relaxed">{s.desc}</p>
              <ul className="mt-4 space-y-2">
                {s.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check size={16} className="text-[#f39c12] mt-0.5 shrink-0" /> {p}
                  </li>
                ))}
              </ul>
              <button
                onClick={go}
                className="mt-5 inline-flex items-center gap-1.5 text-[#4a90e2] font-semibold text-sm hover:gap-2.5 transition-all"
              >
                Learn More <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
