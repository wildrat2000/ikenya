import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { SERVICES as FALLBACK } from '@/data/site';

interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  points: string[];
  icon: string;
  img: string;
}

const Services: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>(FALLBACK);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from('page_content').select('content').eq('page', 'services').eq('section', 'services_list').single()
      .then(({ data }) => {
        if (data?.content) setServices(data.content as ServiceItem[]);
      });
  }, []);

  return (
    <section id="services" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[#4a90e2] font-semibold uppercase tracking-wider text-sm">What We Do</span>
          <h1 className="mt-3 text-3xl lg:text-4xl font-extrabold text-[#1a1f3a]">
            End-to-end web & IT capabilities
          </h1>
          <p className="mt-4 text-slate-600">
            From modern web development to dependable infrastructure, we deliver technology that performs
            and stays easy to manage over time.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/services/${s.id}`)}
              className="group text-left bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="aspect-[16/9] overflow-hidden relative">
                <img src={s.img} alt={s.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-lg font-bold text-white">{s.title}</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[#4a90e2] font-semibold text-sm group-hover:gap-2.5 transition-all">
                  Learn More <ArrowRight size={15} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
