import React, { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Website {
  id: string;
  title: string;
  url: string;
  description: string;
  image_url?: string | null;
  sort_order?: number;
}

interface SliderSettings {
  effect: 'slide' | 'fade' | 'coverflow';
  interval: number;
  duration: number;
}

const DEFAULT_SETTINGS: SliderSettings = { effect: 'slide', interval: 5, duration: 0.8 };

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
  { id: 'prefetch', title: 'Prefetch Systems', url: 'https://prefetchsystems.co.ke', description: '' },
  { id: 'market-color', title: 'The Market Color Podcast', url: 'https://themarketcolorpodcast.com', description: '' },
  { id: 'alcdj', title: 'ALC DJ', url: 'https://alcdj.org', description: '' },
  { id: 'itukarua', title: 'Itukarua', url: 'https://itukarua3.vercel.app', description: '' },
  { id: 'future-launch', title: 'Future Launch', url: '', description: '' },
];

const WebsitePortfolioSlider: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [websites, setWebsites] = useState<Website[]>(FALLBACK_WEBSITES);
  const [settings, setSettings] = useState<SliderSettings>(DEFAULT_SETTINGS);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [perView, setPerView] = useState(3);

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
              url: site.url || '',
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

    supabase
      .from('ad_carousel_settings')
      .select('key,value')
      .then(({ data, error }) => {
        if (!error && data) {
          const map: Record<string, string> = {};
          data.forEach((r: any) => (map[r.key] = r.value));
          setSettings({
            effect: (map.web_effect as SliderSettings['effect']) || 'slide',
            interval: parseFloat(map.web_scroll_interval_seconds) || 5,
            duration: parseFloat(map.web_transition_duration_seconds) || 0.8,
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setPerView(w < 640 ? 1 : w < 768 ? 2 : 3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const pages = Math.max(1, Math.ceil(websites.length / perView));
  const currentPage = page >= pages ? 0 : page;

  useEffect(() => {
    if (paused || pages <= 1) return;
    const timer = setInterval(() => setPage((p) => (p + 1) % pages), settings.interval * 1000);
    return () => clearInterval(timer);
  }, [paused, pages, settings.interval]);

  const goPrev = useCallback(() => setPage((p) => (p - 1 + pages) % pages), [pages]);
  const goNext = useCallback(() => setPage((p) => (p + 1) % pages), [pages]);

  if (!isMounted) return null;

  const groups: Website[][] = [];
  for (let i = 0; i < websites.length; i += perView) {
    groups.push(websites.slice(i, i + perView));
  }

  const transitionStyle: React.CSSProperties = { transitionDuration: `${settings.duration}s` };

  return (
    <section id="portfolio-websites" className="py-20 lg:py-28 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-[#4a90e2]">
            Our Work
          </span>
        </div>

        <div
          className="w-full"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative group">
            <div
              className={`relative w-full overflow-hidden rounded-2xl bg-slate-200 aspect-[4/3] sm:aspect-[16/9] md:aspect-[7/2] ${
                settings.effect === 'fade' ? '' : 'ring-1 ring-slate-200'
              }`}
            >
              {settings.effect === 'fade' ? (
                <div className="relative h-full w-full">
                  {groups.map((group, gi) => (
                    <div
                      key={gi}
                      className={`absolute inset-0 flex transition-opacity ${
                        gi === currentPage ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                      style={transitionStyle}
                    >
                      {group.map((website) => (
                        <SlideCard key={website.id} website={website} />
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`flex h-full transition-transform ease-in-out ${
                    settings.effect === 'coverflow' ? 'items-center' : ''
                  }`}
                  style={{
                    transform: `translateX(-${currentPage * 100}%)`,
                    ...transitionStyle,
                  }}
                >
                  {groups.map((group, gi) => (
                    <div
                      key={gi}
                      className={`flex h-full min-w-0 shrink-0 grow-0 basis-full transition-all ${
                        settings.effect === 'coverflow' && gi !== currentPage
                          ? 'scale-[0.95] opacity-80'
                          : ''
                      }`}
                      style={settings.effect === 'coverflow' ? transitionStyle : undefined}
                    >
                      {group.map((website) => (
                        <SlideCard key={website.id} website={website} />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {pages > 1 && (
              <>
                <button
                  onClick={goPrev}
                  aria-label="Previous"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/85 hover:bg-white rounded-full p-2.5 shadow-md transition-colors"
                >
                  <ChevronLeft size={20} className="text-[#1a1f3a]" />
                </button>
                <button
                  onClick={goNext}
                  aria-label="Next"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/85 hover:bg-white rounded-full p-2.5 shadow-md transition-colors"
                >
                  <ChevronRight size={20} className="text-[#1a1f3a]" />
                </button>
              </>
            )}
          </div>

          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-5">
              {groups.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    i === currentPage ? 'w-7 bg-[#1a1f3a]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const SlideCard: React.FC<{ website: Website }> = ({ website }) => {
  const image = website.image_url ? (
    <img
      src={website.image_url}
      alt={website.title}
      loading="lazy"
      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
    />
  ) : (
    <div className={`h-full w-full bg-gradient-to-br ${getPreviewPalette(website.title)}`}>
      <div className="flex h-full items-center justify-center">
        <span className="text-5xl font-black tracking-tight text-white/90">
          {getInitials(website.title)}
        </span>
      </div>
    </div>
  );

  if (!website.url) {
    return (
      <div className="group relative h-full min-w-0 flex-1 overflow-hidden">{image}</div>
    );
  }

  return (
    <a
      href={website.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative h-full min-w-0 flex-1 overflow-hidden"
    >
      {image}
      <div className="absolute inset-0 bg-slate-950/0 transition-colors duration-300 group-hover:bg-slate-950/40" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="flex items-center justify-center rounded-full bg-white text-[#1a1f3a] shadow-lg">
          <ExternalLink size={22} className="m-3.5" />
        </span>
      </div>
    </a>
  );
};

export default WebsitePortfolioSlider;
