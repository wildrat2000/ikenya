import React, { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
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
  const [lightbox, setLightbox] = useState<Website | null>(null);

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
      setPerView(w < 640 ? 1 : w < 768 ? 2 : w < 1024 ? 3 : 4);
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

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightbox]);

  const goPrev = useCallback(() => setPage((p) => (p - 1 + pages) % pages), [pages]);
  const goNext = useCallback(() => setPage((p) => (p + 1) % pages), [pages]);

  if (!isMounted) return null;

  const groups: Website[][] = [];
  for (let i = 0; i < websites.length; i += perView) {
    groups.push(websites.slice(i, i + perView));
  }

  const transitionStyle: React.CSSProperties = { transitionDuration: `${settings.duration}s` };

  return (
    <section id="portfolio-websites" className="pt-2 pb-14 lg:pt-4 lg:pb-16 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mx-auto mb-6 max-w-3xl text-center">
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
            <div className="relative w-full aspect-[5/3] sm:aspect-[2/1] md:aspect-[3/1]">
              {settings.effect === 'fade' ? (
                <div className="relative h-full w-full">
                  {groups.map((group, gi) => (
                    <div
                      key={gi}
                      className={`absolute inset-0 flex items-center justify-center -mx-1.5 sm:-mx-2 transition-opacity ${
                        gi === currentPage ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                      style={transitionStyle}
                    >
                      {group.map((website) => (
                        <SlideCard key={website.id} website={website} onPreview={setLightbox} />
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
                      className={`flex h-full min-w-0 shrink-0 grow-0 basis-full items-center justify-center -mx-1.5 sm:-mx-2 transition-all ${
                        settings.effect === 'coverflow' && gi !== currentPage
                          ? 'scale-[0.95] opacity-80'
                          : ''
                      }`}
                      style={settings.effect === 'coverflow' ? transitionStyle : undefined}
                    >
                      {group.map((website) => (
                        <SlideCard key={website.id} website={website} onPreview={setLightbox} />
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

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-8"
          onClick={() => setLightbox(null)}
        >
          <button
            aria-label="Close preview"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/15 p-2.5 text-white hover:bg-white/30 transition-colors"
          >
            <X size={22} />
          </button>
          <div
            className="max-h-full w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-h-[75vh] overflow-auto">
              <img
                src={lightbox.image_url || undefined}
                alt={lightbox.title}
                className="w-full object-contain"
              />
            </div>
            <div className="border-t border-slate-100 px-5 py-3.5 flex items-center justify-between gap-4">
              <p className="font-semibold text-[#1a1f3a]">{lightbox.title}</p>
              {lightbox.description && (
                <p className="hidden sm:block text-sm text-slate-500 truncate">{lightbox.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const SlideCard: React.FC<{ website: Website; onPreview?: (w: Website) => void }> = ({
  website,
  onPreview,
}) => {
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
        <span className="text-4xl font-black tracking-tight text-white/90">
          {getInitials(website.title)}
        </span>
      </div>
    </div>
  );

  const caption = (
    <span className="shrink-0 block border-t border-slate-100 bg-white px-3 py-2 sm:py-2.5">
      <span className="block truncate text-xs sm:text-sm font-semibold text-[#1a1f3a]">
        {website.title}
      </span>
    </span>
  );

  if (!website.url) {
    return (
      <button
        type="button"
        onClick={() => onPreview?.(website)}
        aria-label={`Preview ${website.title}`}
        className="relative h-full w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-1.5 sm:px-2 text-left"
      >
        <span className="group flex h-full w-full flex-col overflow-hidden rounded-xl sm:rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl group-hover:ring-slate-300">
          <span className="relative min-h-0 flex-1 overflow-hidden">{image}</span>
          {caption}
        </span>
      </button>
    );
  }

  return (
    <a
      href={website.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative h-full w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-1.5 sm:px-2 block"
    >
      <div className="flex h-full w-full flex-col overflow-hidden rounded-xl sm:rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl group-hover:ring-slate-300">
        <div className="relative min-h-0 flex-1 overflow-hidden">{image}</div>
        {caption}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 bottom-auto flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="flex items-center justify-center rounded-full bg-[#1a1f3a]/85 text-white shadow-lg backdrop-blur-sm">
          <ExternalLink size={20} className="m-3" />
        </span>
      </div>
    </a>
  );
};

export default WebsitePortfolioSlider;
