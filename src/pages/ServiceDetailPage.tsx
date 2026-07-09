import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SERVICES as FALLBACK } from '@/data/site';
import SEO from '@/components/SEO';
import AppLayout from '@/components/AppLayout';
import Icon from '@/components/Icon';

interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  points: string[];
  icon: string;
  img: string;
}

const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    supabase.from('page_content').select('content').eq('page', 'services').eq('section', 'services_list').single()
      .then(({ data }) => {
        const list = (data?.content as ServiceItem[]) || FALLBACK;
        setService(list.find(s => s.id === id) || null);
      });
  }, [id]);

  if (!service) {
    return (
      <>
        <SEO title="Service Not Found" />
        <AppLayout>
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-slate-500">Service not found.</p>
          </div>
        </AppLayout>
      </>
    );
  }

  return (
    <>
      <SEO title={service.title} description={service.desc} path={`/services/${service.id}`} />
      <AppLayout>
      <div className="min-h-screen bg-slate-50">
        <div className="relative h-[40vh] overflow-hidden">
          <img src={service.img} alt={service.title} loading="lazy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 p-8 max-w-7xl mx-auto">
            <button onClick={() => navigate('/services')}
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-semibold mb-4 transition-colors">
              <ArrowLeft size={16} /> Back to Services
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur">
                <Icon name={service.icon} className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-extrabold text-white">{service.title}</h1>
                <p className="mt-1 text-white/80">{service.desc}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-bold text-[#1a1f3a] mb-6">What We Deliver</h2>
          <div className="space-y-4">
            {service.points.map((p, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-5 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[#4a90e2]/10 flex items-center justify-center shrink-0">
                  <Check size={16} className="text-[#4a90e2]" />
                </div>
                <div>
                  <p className="text-slate-800 font-medium">{p}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <button onClick={() => { navigate('/contact'); }}
              className="inline-flex items-center gap-2 bg-[#f39c12] hover:bg-[#e08e0b] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Request This Service <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate('/portfolio')}
              className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-[#4a90e2] text-slate-700 px-6 py-3 rounded-lg font-semibold transition-colors">
              View Related Work
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
    </>
  );
};

export default ServiceDetailPage;