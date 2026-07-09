import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronDown, MessageCircle } from 'lucide-react';
import { FAQS } from '@/data/site';

interface FAQsModalProps {
  open: boolean;
  onClose: () => void;
}

const FAQsModal: React.FC<FAQsModalProps> = ({ open, onClose }) => {
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const toggle = useCallback((i: number) => {
    setExpanded(prev => (prev === i ? null : i));
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto animate-fade-in">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-xl font-extrabold text-[#1a1f3a]">Frequently Asked Questions</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
            <X size={16} className="text-slate-600" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-xl border border-slate-100 overflow-hidden">
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between p-4 text-left font-semibold text-[#1a1f3a] hover:bg-slate-50 transition-colors"
              >
                {faq.q}
                <ChevronDown size={18} className={`shrink-0 text-slate-400 transition-transform ${expanded === i ? 'rotate-180' : ''}`} />
              </button>
              {expanded === i && (
                <div className="px-4 pb-4 text-slate-600 text-sm leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-white p-5 border-t border-slate-100">
          <a
            href="https://wa.me/254721219359"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white w-full py-3.5 rounded-xl font-semibold transition-colors"
          >
            <MessageCircle size={20} /> Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQsModal;