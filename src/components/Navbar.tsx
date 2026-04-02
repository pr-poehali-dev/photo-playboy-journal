import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface NavbarProps {
  currentPage: 'home' | 'gallery';
  onNavigate: (page: 'home' | 'gallery') => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3 bg-noir/95 backdrop-blur-md border-b border-gold/10' : 'py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="flex flex-col items-start group cursor-none"
        >
          <span className="font-cormorant text-2xl tracking-[0.3em] gold-text font-light">NOIR</span>
          <span className="text-[8px] tracking-[0.5em] text-gold/50 font-montserrat font-light uppercase -mt-1">Personal Journal</span>
        </button>

        <div className="hidden md:flex items-center gap-10">
          <button
            onClick={() => onNavigate('home')}
            className={`nav-link text-[11px] tracking-[0.2em] uppercase font-montserrat font-light transition-colors cursor-none ${
              currentPage === 'home' ? 'text-gold active' : 'text-gold/60 hover:text-gold'
            }`}
          >
            Главная
          </button>
          <button
            onClick={() => onNavigate('gallery')}
            className={`nav-link text-[11px] tracking-[0.2em] uppercase font-montserrat font-light transition-colors cursor-none ${
              currentPage === 'gallery' ? 'text-gold active' : 'text-gold/60 hover:text-gold'
            }`}
          >
            Галерея
          </button>
        </div>

        <button
          className="md:hidden text-gold cursor-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name={menuOpen ? 'X' : 'Menu'} size={20} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-noir/98 border-t border-gold/10 px-6 py-6 flex flex-col gap-5">
          <button
            onClick={() => { onNavigate('home'); setMenuOpen(false); }}
            className={`nav-link text-left text-[11px] tracking-[0.2em] uppercase font-montserrat font-light cursor-none ${
              currentPage === 'home' ? 'text-gold' : 'text-gold/60'
            }`}
          >
            Главная
          </button>
          <button
            onClick={() => { onNavigate('gallery'); setMenuOpen(false); }}
            className={`nav-link text-left text-[11px] tracking-[0.2em] uppercase font-montserrat font-light cursor-none ${
              currentPage === 'gallery' ? 'text-gold' : 'text-gold/60'
            }`}
          >
            Галерея
          </button>
        </div>
      )}
    </nav>
  );
}
