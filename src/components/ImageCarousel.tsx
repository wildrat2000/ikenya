import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import { GalleryItem } from '@/data/site';

interface Props {
  images: GalleryItem[];
  vertical?: boolean;
  contain?: boolean;
}

const ImageCarousel: React.FC<Props> = ({ images, vertical = false, contain = false }) => {
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const perPage = vertical ? 4 : 3;
  const pages = Math.ceil(images.length / perPage);

  const next = useCallback(() => {
    setPage(p => (p + 1) % pages);
  }, [pages]);

  const prev = useCallback(() => {
    setPage(p => (p - 1 + pages) % pages);
  }, [pages]);

  useEffect(() => {
    if (pages <= 1 || paused) return;
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [pages, paused, next]);

  if (!images.length) return null;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="h-full"
    >
      <div className={`relative overflow-hidden rounded-xl ${vertical ? 'h-full' : ''}`}>
        <div
          className={`flex transition-transform duration-500 ease-in-out ${vertical ? 'flex-col' : ''}`}
          style={{ transform: vertical ? `translateY(-${page * 100}%)` : `translateX(-${page * 100}%)` }}
        >
          {Array.from({ length: pages }).map((_, pIdx) => (
            <div key={pIdx} className={`min-w-0 min-h-0 shrink-0 grow-0 basis-full ${vertical ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-3 gap-4'}`}>
              {images.slice(pIdx * perPage, pIdx * perPage + perPage).map((item, i) => (
                item.link ? (
                  <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
                    className="group relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <img src={item.url} alt={`Gallery ${pIdx * perPage + i + 1}`} loading="lazy"
                      className={`w-full aspect-[4/3] ${contain ? 'object-contain p-2 bg-white' : 'object-cover'} ${vertical ? 'rounded-lg' : ''}`} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <ExternalLink size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </a>
                ) : (
                  <div key={i} className="rounded-lg overflow-hidden shadow-sm">
                    <img src={item.url} alt={`Gallery ${pIdx * perPage + i + 1}`} loading="lazy"
                      className={`w-full aspect-[4/3] ${contain ? 'object-contain p-2 bg-white' : 'object-cover'} ${vertical ? 'rounded-lg' : ''}`} />
                  </div>
                )
              ))}
            </div>
          ))}
        </div>

        {pages > 1 && (
          <>
            {vertical ? (
              <>
                <button onClick={prev}
                  className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900/80 hover:bg-slate-900 rounded-full p-1.5 shadow-md transition-colors z-10">
                  <ChevronUp size={16} className="text-white" />
                </button>
                <button onClick={next}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-slate-900/80 hover:bg-slate-900 rounded-full p-1.5 shadow-md transition-colors z-10">
                  <ChevronDown size={16} className="text-white" />
                </button>
              </>
            ) : (
              <>
                <button onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors z-10">
                  <ChevronLeft size={20} className="text-[#1a1f3a]" />
                </button>
                <button onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors z-10">
                  <ChevronRight size={20} className="text-[#1a1f3a]" />
                </button>
              </>
            )}
          </>
        )}
      </div>

      {pages > 1 && (
        <div className={`flex justify-center gap-2 mt-4 ${vertical ? 'flex-col absolute -right-4 top-1/2 -translate-y-1/2' : ''}`}>
          {Array.from({ length: pages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === page ? 'bg-[#1a1f3a] scale-110' : 'bg-slate-300 hover:bg-slate-400'}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
