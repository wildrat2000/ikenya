import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { TESTIMONIALS as FALLBACK_TESTS } from '@/data/site';
import { Quote } from 'lucide-react';

type Testimonial = { quote: string; name: string; role: string };

const TechStack: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK_TESTS);

  useEffect(() => {
    supabase.from('page_content').select('content').eq('page', 'technology').eq('section', 'testimonials').single()
      .then(({ data }) => {
        if (data?.content) setTestimonials(data.content as Testimonial[]);
      });
  }, []);

  return (
    <section id="tech" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-[#4a90e2] font-semibold uppercase tracking-wider text-sm">Testimonials</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold text-[#1a1f3a]">
              What our clients say
            </h2>
          </div>
          <a
            href="https://itukarua3.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-44 rounded-xl overflow-hidden shadow-sm hover:scale-105 transition-transform"
          >
            <div className="relative aspect-[16/9]">
              <img src="/electrician.jpg" alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center items-center p-2 text-center">
                <span className="text-white text-sm font-bold leading-tight">Looking for a Hustle?</span>
                <span className="text-[#00b894] text-xs font-semibold mt-1 flex items-center gap-1">
                  Jobs Portal &rarr;
                </span>
              </div>
            </div>
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
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
