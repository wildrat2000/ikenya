import React from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { COMPANY } from '@/data/site';

const links = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Sectors', path: '/sectors' },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'About', path: '/about' },
  { label: 'Technology', path: '/technology' },
  { label: 'Contact', path: '/contact' },
];

const Header: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all ${
        scrolled ? 'bg-[#1a1f3a]/95 backdrop-blur shadow-lg' : 'bg-[#1a1f3a]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <img src={COMPANY.logo} alt="Itukarua Kenya" className="h-10 w-10 md:h-12 md:w-12 object-contain rounded-full bg-white" />
          <span className="text-white font-bold text-lg md:text-xl tracking-tight hidden sm:block">
            Itukarua <span className="text-[#4a90e2]">Kenya</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <button
              key={l.path}
              onClick={() => go(l.path)}
              className={`text-sm font-medium transition-colors ${
                location.pathname === l.path
                  ? 'text-[#4a90e2]'
                  : 'text-slate-200 hover:text-[#4a90e2]'
              }`}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => go('/contact')}
            className="bg-[#f39c12] hover:bg-[#e08e0b] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow"
          >
            Request Consult
          </button>
        </nav>

        <button className="md:hidden text-white" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#1a1f3a] border-t border-white/10 px-4 py-4 space-y-2">
          {links.map((l) => (
            <button
              key={l.path}
              onClick={() => go(l.path)}
              className={`block w-full text-left py-2.5 font-medium ${
                location.pathname === l.path ? 'text-[#4a90e2]' : 'text-slate-200'
              }`}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => go('/contact')}
            className="w-full bg-[#f39c12] text-white px-5 py-3 rounded-lg font-semibold mt-2"
          >
            Request Consult
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
