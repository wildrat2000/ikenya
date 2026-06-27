import React from 'react';
import { SECTORS } from '@/data/site';

const Sectors: React.FC = () => {
  return (
    <section id="sectors" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[#4a90e2] font-semibold uppercase tracking-wider text-sm">Who We Serve</span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold text-[#1a1f3a]">
            Trusted across Kenya's key sectors
          </h2>
          <p className="mt-4 text-slate-600">
            We support government institutions, businesses, NGOs, schools, and individuals with technology
            they can depend on.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECTORS.map((s) => (
            <div key={s.title} className="group relative rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={s.img}
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f3a]/90 via-[#1a1f3a]/30 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                <h3 className="text-lg font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-200">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sectors;
