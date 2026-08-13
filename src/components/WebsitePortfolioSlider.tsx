import React, { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

interface Website {
  id: string;
  title: string;
  url: string;
  description: string;
  image_url?: string | null;
  sort_order?: number;
}

const previewPalette = [
  'from-[#4a90e2] via-[#1a1f3a] to-[#0f172a]',
  'from-[#0ea5e9] via-[#2563eb] to-[#111827]',
  'from-[#22c55e] via-[#0f766e] to-[#111827]',
  'from-[#f59e0b] via-[#ef4444] to-[#1f2937]',
  'from-[#8b5cf6] via-[#ec4899] to-[#111827]',
  'from-[#14b8a6] via-[#0f172a] to-[#1e293b]',
];

const getPreviewPalette = (title: string) => {
  const index = title.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % previewPalette.length;
  return previewPalette[index];
};

const getInitials = (title: string) =>
  title
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'IT';

const FALLBACK_WEBSITES: Website[] = [
  {
    id: 'prefetch',
    title: 'Prefetch Systems',
    url: 'https://prefetchsystems.co.ke',
    description: '',
  },
  {
    id: 'market-color',
    title: 'The Market Color Podcast',
    url: 'https://themarketcolorpodcast.com',
    description: '',
  },
  {
    id: 'alcdj',
    title: 'ALC DJ',
    url: 'https://alcdj.org',
    description: '',
  },
  {
    id: 'itukarua',
    title: 'Itukarua',
    url: 'https://itukarua3.vercel.app',
    description: '',
  },
  {
    id: 'portfolio-five',
    title: 'Future Launch',
    url: 'https://example.com',
    description: '',
  },
];

const WebsitePortfolioSlider: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [websites, setWebsites] = useState<Website[]>(FALLBACK_WEBSITES);
  const [api, setApi] = useState<CarouselApi>();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    supabase
      .from('portfolio_sites')
      .select('*')
      .order('sort_order', { ascending: true, nullsFirst: false })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          const mapped = data
            .map((site: any) => ({
              id: site.id || `${site.title}-${site.sort_order ?? 0}`,
              title: site.title,
              url: site.url || '#',
              description: site.description || '',
              image_url: site.image_url || null,
              sort_order: site.sort_order ?? 0,
            }))
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

          setWebsites(mapped);
          return;
        }

        setWebsites(FALLBACK_WEBSITES);
      })
      .catch(() => {
        setWebsites(FALLBACK_WEBSITES);
      });
  }, []);

  useEffect(() => {
    if (!api || paused || websites.length <= 1) return;

    const timer = setInterval(() => api.scrollNext(), 4000);
    return () => clearInterval(timer);
  }, [api, paused, websites.length]);

  if (!isMounted) return null;

  return (
    <section id="portfolio-websites" className="py-20 lg:py-28 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-[#4a90e2]">
            Our Work
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a1f3a] lg:text-5xl">
            Websites We've Built
          </h2>
          <p className="mt-4 text-base text-slate-600 lg:text-lg">
            Real sites crafted for speed, clarity, and performance.
          </p>
        </div>

        <div
          className="w-full"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <Carousel
            setApi={setApi}
            opts={{
              align: 'start',
              loop: true,
              slidesToScroll: 1,
            }}
            className="w-full"
          >
            <div className="relative group">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-[#f8fafc] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-[#f8fafc] to-transparent" />

              <CarouselContent className="-ml-3 md:-ml-4">
                {websites.map((website) => (
                  <CarouselItem
                    key={website.id}
                    className="pl-3 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/5"
                  >
                    <a
                      href={website.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block h-full overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 shadow-[0_20px_60px_-30px_rgba(26,31,58,0.45)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_30px_70px_-28px_rgba(26,31,58,0.55)]"
                    >
                      <div className="aspect-[4/3] w-full">
                        {website.image_url ? (
                          <img
                            src={website.image_url}
                            alt={website.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className={`h-full w-full bg-gradient-to-br ${getPreviewPalette(website.title)}`}
                          >
                            <div className="flex h-full items-center justify-center">
                              <span className="text-5xl font-black tracking-tight text-white/90">
                                {getInitials(website.title)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="absolute inset-0 bg-slate-950/0 transition-colors duration-300 group-hover:bg-slate-950/40" />

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="flex items-center justify-center rounded-full bg-white text-[#1a1f3a] shadow-lg">
                          <ExternalLink size={22} className="m-3.5" />
                        </span>
                      </div>
                    </a>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="mt-7 flex items-center justify-end gap-3">
                <CarouselPrevious className="static h-11 w-11 -translate-y-0 rounded-full border-0 bg-[#1a1f3a] text-white shadow-sm hover:bg-[#2d365d]" />
                <CarouselNext className="static h-11 w-11 translate-y-0 rounded-full border-0 bg-[#4a90e2] text-white shadow-sm hover:bg-[#3a7bc8]" />
              </div>
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default WebsitePortfolioSlider;
