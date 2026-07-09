import React, { useEffect, useMemo, useState } from 'react';
import { X, ArrowRight, Target, Lightbulb, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PORTFOLIO as FALLBACK, Project } from '@/data/site';

const ALL = 'All';

const Portfolio: React.FC = () => {
  const [portfolio, setPortfolio] = useState<Project[]>(FALLBACK);
  const [active, setActive] = useState<Project | null>(null);
  const [sector, setSector] = useState<string>(ALL);
  const [service, setService] = useState<string>(ALL);

  useEffect(() => {
    supabase.from('page_content').select('content').eq('page', 'portfolio').eq('section', 'portfolio_list').single()
      .then(({ data }) => {
        if (data?.content) setPortfolio(data.content as Project[]);
      });
  }, []);

  const sectors = useMemo(() => [ALL, ...Array.from(new Set(portfolio.map((p) => p.sector)))], [portfolio]);
  const services = useMemo(() => [ALL, ...Array.from(new Set(portfolio.map((p) => p.serviceType)))], [portfolio]);

  const filtered = useMemo(
    () =>
      portfolio.filter(
        (p) => (sector === ALL || p.sector === sector) && (service === ALL || p.serviceType === service)
      ),
    [sector, service]
  );

  return (
    <section id="portfolio" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[#4a90e2] font-semibold uppercase tracking-wider text-sm">Portfolio</span>
          <h1 className="mt-3 text-3xl lg:text-4xl font-extrabold text-[#1a1f3a]">
            Proof of delivered work
          </h1>
          <p className="mt-4 text-slate-600">
            Real projects across sectors—filter by sector or service type to see how we solve challenges and
            deliver measurable results.
          </p>
        </div>

        {/* Filters */}
        <div className="mt-10 space-y-4">
          <FilterRow label="Sector" options={sectors} value={sector} onChange={setSector} />
          <FilterRow label="Service" options={services} value={service} onChange={setService} />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="mt-12 text-center text-slate-500">No case studies match these filters.</p>
        ) : (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => setActive(p)}
                className="group text-left bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#1a1f3a]/5 text-[#1a1f3a]">
                      {p.sector}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#4a90e2]/10 text-[#4a90e2]">
                      {p.serviceType}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-[#1a1f3a]">{p.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{p.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[#4a90e2] font-semibold text-sm group-hover:gap-2.5 transition-all">
                    View Case Study <ArrowRight size={15} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
    </section>
  );
};

const FilterRow: React.FC<{
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}> = ({ label, options, value, onChange }) => (
  <div className="flex flex-wrap items-center gap-2">
    <span className="text-sm font-semibold text-slate-500 w-16 shrink-0">{label}:</span>
    {options.map((o) => (
      <button
        key={o}
        onClick={() => onChange(o)}
        className={`text-sm px-4 py-2 rounded-full font-medium transition-colors ${
          value === o
            ? 'bg-[#1a1f3a] text-white'
            : 'bg-white border border-slate-200 text-slate-600 hover:border-[#4a90e2] hover:text-[#4a90e2]'
        }`}
      >
        {o}
      </button>
    ))}
  </div>
);

const ProjectModal: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => {
  const go = () => {
    onClose();
    setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow"
          aria-label="Close"
        >
          <X size={20} className="text-[#1a1f3a]" />
        </button>

        <div className="aspect-[16/9] overflow-hidden rounded-t-2xl">
          <img src={project.img} alt={project.title} loading="lazy" className="w-full h-full object-cover" />
        </div>

        <div className="p-7">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#1a1f3a]/5 text-[#1a1f3a]">
              {project.sector}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#4a90e2]/10 text-[#4a90e2]">
              {project.serviceType}
            </span>
          </div>
          <h3 className="mt-3 text-2xl font-extrabold text-[#1a1f3a]">{project.title}</h3>

          <div className="mt-6 space-y-5">
            <Block icon={<Target size={18} />} title="The Challenge" text={project.challenge} />
            <Block icon={<Lightbulb size={18} />} title="Our Solution" text={project.solution} />
            <Block icon={<TrendingUp size={18} />} title="The Result" text={project.result} highlight />
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Technologies Used</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-medium text-[#1a1f3a]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={go}
            className="mt-7 inline-flex items-center gap-2 bg-[#f39c12] hover:bg-[#e08e0b] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Start a Similar Project <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Block: React.FC<{ icon: React.ReactNode; title: string; text: string; highlight?: boolean }> = ({
  icon,
  title,
  text,
  highlight,
}) => (
  <div className={`rounded-xl p-4 ${highlight ? 'bg-[#4a90e2]/8 border border-[#4a90e2]/20' : 'bg-slate-50'}`}>
    <div className="flex items-center gap-2 text-[#4a90e2] font-semibold">
      {icon} {title}
    </div>
    <p className="mt-2 text-slate-700 leading-relaxed text-sm">{text}</p>
  </div>
);

export default Portfolio;
