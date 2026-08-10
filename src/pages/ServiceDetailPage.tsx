import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SERVICES as FALLBACK, GalleryItem } from '@/data/site';
import SEO from '@/components/SEO';
import AppLayout from '@/components/AppLayout';
import Icon from '@/components/Icon';
import ImageCarousel from '@/components/ImageCarousel';

interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  points: string[];
  icon: string;
  img: string;
  gallery: GalleryItem[];
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
          {service.gallery?.length > 0 && (
            <>
              <div className="bg-[#1a1f3a] -mx-4 sm:-mx-6 px-4 sm:px-6 py-6 mb-6">
                <h2 className="text-2xl font-bold text-white">{service.id === 'hosting' ? 'Our Providers' : 'Our Work'}</h2>
              </div>
              <div className="-mx-4 sm:-mx-6 px-4 sm:px-6">
                <ImageCarousel images={service.gallery} />
              </div>
            </>
          )}

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