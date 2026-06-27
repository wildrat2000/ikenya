import { COMPANY } from '@/data/site';

const WhatsAppButton: React.FC = () => (
  <a
    href="https://wa.me/254721219359"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] text-white pl-3.5 pr-5 py-3 rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-all group"
    aria-label="Chat with Itukarua Kenya on WhatsApp"
  >
    <svg viewBox="0 0 32 32" className="w-6 h-6 fill-white shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.004 0h-.008C7.172 0 0 7.176 0 16.004c0 3.496 1.124 6.732 3.028 9.328L2.084 32l6.836-2.876A15.926 15.926 0 0016.004 32C24.828 32 32 24.824 32 16S24.828 0 16.004 0zm9.292 22.62c-.392 1.104-2.332 2.112-3.808 2.392-1.016.192-2.344.34-6.816-1.464-5.716-2.312-9.396-7.976-9.68-8.344-.276-.368-2.304-3.072-2.304-5.86s1.46-4.16 2.004-4.724c.472-.476 1.024-.596 1.364-.596.34 0 .68.004.98.016.312.012.732-.12 1.144.876.412.996 1.404 3.444 1.528 3.696.124.252.208.544.04.876-.164.332-.248.536-.496.828-.248.292-.52.652-.744.876-.248.248-.504.516-.216 1.012.288.496 1.28 2.112 2.748 3.416 1.888 1.68 3.476 2.204 3.972 2.448.496.244.788.204 1.076-.124.288-.328 1.22-1.428 1.548-1.916.328-.492.656-.408 1.108-.244.452.164 2.864 1.352 3.356 1.596.492.244.82.364.944.568.124.204.124 1.176-.268 2.28z" />
    </svg>
    <span className="text-sm font-semibold whitespace-nowrap">{COMPANY.name}</span>
  </a>
);

export default WhatsAppButton;