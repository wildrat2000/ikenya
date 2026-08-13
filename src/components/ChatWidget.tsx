import React, { useEffect, useState, useCallback } from 'react';
import { X, ChevronDown, MessageCircle } from 'lucide-react';
import { COMPANY, FAQS } from '@/data/site';

const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  const toggle = (i: number) => setExpanded((prev) => (prev === i ? null : i));

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40" onClick={close} />
          <div className="absolute bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh] animate-fly-in-bottom">
            <div className="flex items-center justify-between p-4 bg-[#1a1f3a]">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#25D366]">
                  <MessageCircle size={18} className="text-white" />
                </span>
                <div>
                  <p className="text-white font-bold leading-tight">{COMPANY.name}</p>
                  <p className="text-slate-300 text-xs">We usually reply within a few hours</p>
                </div>
              </div>
              <button
                onClick={close}
                aria-label="Close chat"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50">
              <div className="bg-white rounded-xl rounded-tl-sm border border-slate-100 px-4 py-3 text-sm text-slate-700 shadow-sm">
                Hi! Browse our FAQ below for quick answers.
              </div>
              <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                {FAQS.map((faq, i) => (
                  <div key={i} className="border-b border-slate-100 last:border-b-0">
                    <button
                      onClick={() => toggle(i)}
                      className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left text-sm font-semibold text-[#1a1f3a] hover:bg-slate-50 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        size={16}
                        className={`shrink-0 text-slate-400 transition-transform ${expanded === i ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {expanded === i && (
                      <div className="px-4 pb-3 text-slate-600 text-sm leading-relaxed">{faq.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-white">
              <a
                href={`https://wa.me/254721219359?text=${encodeURIComponent('Hello Itukarua Kenya, I need help with a service.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white w-full py-3 rounded-xl font-semibold transition-colors"
              >
                <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.004 0h-.008C7.172 0 0 7.176 0 16.004c0 3.496 1.124 6.732 3.028 9.328L2.084 32l6.836-2.876A15.926 15.926 0 0016.004 32C24.828 32 32 24.824 32 16S24.828 0 16.004 0zm9.292 22.62c-.392 1.104-2.332 2.112-3.808 2.392-1.016.192-2.344.34-6.816-1.464-5.716-2.312-9.396-7.976-9.68-8.344-.276-.368-2.304-3.072-2.304-5.86s1.46-4.16 2.004-4.724c.472-.476 1.024-.596 1.364-.596.34 0 .68.004.98.016.312.012.732-.12 1.144.876.412.996 1.404 3.444 1.528 3.696.124.252.208.544.04.876-.164.332-.248.536-.496.828-.248.292-.52.652-.744.876-.248.248-.504.516-.216 1.012.288.496 1.28 2.112 2.748 3.416 1.888 1.68 3.476 2.204 3.972 2.448.496.244.788.204 1.076-.124.288-.328 1.22-1.428 1.548-1.916.328-.492.656-.408 1.108-.244.452.164 2.864 1.352 3.356 1.596.492.244.82.364.944.568.124.204.124 1.176-.268 2.28z" />
                </svg>
                No solution? Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat with Itukarua Kenya"
        className="fixed bottom-6 right-6 z-[60] flex items-center gap-2.5 bg-[#25D366] text-white pl-3.5 pr-5 py-3 rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-all group"
      >
        {open ? (
          <X size={24} className="shrink-0" />
        ) : (
          <>
            <svg viewBox="0 0 32 32" className="w-6 h-6 fill-white shrink-0" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.004 0h-.008C7.172 0 0 7.176 0 16.004c0 3.496 1.124 6.732 3.028 9.328L2.084 32l6.836-2.876A15.926 15.926 0 0016.004 32C24.828 32 32 24.824 32 16S24.828 0 16.004 0zm9.292 22.62c-.392 1.104-2.332 2.112-3.808 2.392-1.016.192-2.344.34-6.816-1.464-5.716-2.312-9.396-7.976-9.68-8.344-.276-.368-2.304-3.072-2.304-5.86s1.46-4.16 2.004-4.724c.472-.476 1.024-.596 1.364-.596.34 0 .68.004.98.016.312.012.732-.12 1.144.876.412.996 1.404 3.444 1.528 3.696.124.252.208.544.04.876-.164.332-.248.536-.496.828-.248.292-.52.652-.744.876-.248.248-.504.516-.216 1.012.288.496 1.28 2.112 2.748 3.416 1.888 1.68 3.476 2.204 3.972 2.448.496.244.788.204 1.076-.124.288-.328 1.22-1.428 1.548-1.916.328-.492.656-.408 1.108-.244.452.164 2.864 1.352 3.356 1.596.492.244.82.364.944.568.124.204.124 1.176-.268 2.28z" />
            </svg>
            <span className="text-sm font-semibold whitespace-nowrap">{COMPANY.name}</span>
          </>
        )}
      </button>
    </>
  );
};

export default ChatWidget;
