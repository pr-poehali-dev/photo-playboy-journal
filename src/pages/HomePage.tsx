import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { listPhotos, type PhotoItem } from '@/api';

interface HomePageProps {
  onNavigate: (page: 'home' | 'gallery') => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);

  useEffect(() => {
    listPhotos().then(setPhotos);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      heroRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  const featured = photos.slice(0, 3);

  return (
    <div className="min-h-screen bg-noir noise-bg">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          ref={heroRef}
          className="absolute inset-0 scale-110 transition-transform duration-100 ease-out"
          style={{
            background: `
              radial-gradient(ellipse 60% 80% at 30% 50%, rgba(201,168,76,0.06) 0%, transparent 60%),
              radial-gradient(ellipse 40% 60% at 70% 30%, rgba(201,168,76,0.04) 0%, transparent 50%),
              linear-gradient(180deg, #0a0a0a 0%, #0f0d08 50%, #0a0a0a 100%)
            `
          }}
        />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
          <div className="absolute bottom-[15%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
          <div className="absolute top-0 bottom-0 left-[15%] w-px bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
          <div className="absolute top-0 bottom-0 right-[15%] w-px bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
        </div>

        <div className="absolute top-1/4 left-8 md:left-16 text-gold/10 font-cormorant text-6xl md:text-9xl select-none pointer-events-none">I</div>
        <div className="absolute bottom-1/4 right-8 md:right-16 text-gold/10 font-cormorant text-6xl md:text-9xl select-none pointer-events-none">X</div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="opacity-0 animate-fade-in-up delay-100">
            <span className="text-[10px] tracking-[0.6em] text-gold/50 uppercase font-montserrat font-light">Персональный фотожурнал</span>
          </div>
          <h1 className="opacity-0 animate-fade-in-up delay-200 font-cormorant font-light mt-6 leading-none">
            <span className="block text-7xl md:text-[120px] lg:text-[160px] gold-text tracking-tight">NOIR</span>
          </h1>
          <div className="opacity-0 animate-fade-in-up delay-300 gold-divider my-8 max-w-xs mx-auto" />
          <p className="opacity-0 animate-fade-in-up delay-400 font-cormorant italic text-xl md:text-2xl text-gold/70 font-light tracking-wide leading-relaxed">
            Красота — это тайна, которую нельзя объяснить,<br className="hidden md:block" />
            только почувствовать
          </p>
          <div className="opacity-0 animate-fade-in-up delay-500 mt-12 flex items-center justify-center">
            <button
              onClick={() => onNavigate('gallery')}
              className="group flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase font-montserrat text-gold border border-gold/40 px-8 py-4 hover:bg-gold hover:text-noir transition-all duration-300 cursor-none"
            >
              Открыть галерею
              <Icon name="ArrowRight" size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[9px] tracking-[0.4em] text-gold uppercase font-montserrat">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent animate-pulse" />
        </div>
      </section>

      {/* Featured */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <div>
            <span className="text-[9px] tracking-[0.5em] text-gold/40 uppercase font-montserrat block mb-3">Избранное</span>
            <h2 className="font-cormorant text-4xl md:text-5xl gold-text font-light">Последние работы</h2>
          </div>
          <button
            onClick={() => onNavigate('gallery')}
            className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-montserrat text-gold/50 hover:text-gold transition-colors cursor-none group"
          >
            Вся галерея
            <Icon name="ArrowRight" size={12} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featured.map((photo, i) => (
              <div
                key={photo.id}
                className="photo-card relative group cursor-none"
                onClick={() => onNavigate('gallery')}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`overflow-hidden ${photo.aspect === 'tall' ? 'aspect-[3/4]' : photo.aspect === 'wide' ? 'aspect-[4/3]' : 'aspect-square'}`}>
                  <img src={photo.src} alt={photo.title} className="w-full h-full object-cover" />
                  <div className="overlay absolute inset-0 bg-gradient-to-t from-noir/90 via-noir/20 to-transparent flex flex-col justify-end p-5">
                    <div className="flex gap-2 mb-3">
                      {photo.tags.slice(0, 2).map(tag => <span key={tag} className="tag-badge">{tag}</span>)}
                    </div>
                    <h3 className="font-cormorant text-xl text-gold font-light">{photo.title}</h3>
                    <p className="text-[10px] tracking-[0.2em] text-gold/40 uppercase font-montserrat mt-1">{photo.date}</p>
                  </div>
                </div>
                <div className="gold-border absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center border border-gold/10">
            <Icon name="Images" size={36} className="text-gold/20 mx-auto mb-4" />
            <p className="font-cormorant text-xl text-gold/30 font-light mb-4">Галерея пуста</p>
            <button
              onClick={() => onNavigate('gallery')}
              className="text-[10px] tracking-[0.3em] uppercase font-montserrat text-gold/40 hover:text-gold transition-colors cursor-none"
            >
              Добавить первое фото →
            </button>
          </div>
        )}
      </section>

      {/* Quote + stats */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-noir via-noir-light/30 to-noir" />
        <div className="gold-divider mb-24" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <p className="font-cormorant italic text-3xl md:text-5xl text-gold/80 font-light leading-relaxed">
            «Каждый кадр — это момент, застывший в вечности»
          </p>
          <div className="gold-divider mt-16 max-w-xs mx-auto" />
          <div className="mt-16 grid grid-cols-3 gap-8">
            {[
              { num: photos.length > 0 ? `${photos.length}` : '0', label: 'Фотографий' },
              { num: '5', label: 'Категорий' },
              { num: '3', label: 'Года' },
            ].map(({ num, label }) => (
              <div key={label} className="text-center">
                <div className="font-cormorant text-4xl md:text-5xl gold-text font-light">{num}</div>
                <div className="text-[9px] tracking-[0.4em] text-gold/40 uppercase font-montserrat mt-2">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="gold-divider mt-24" />
      </section>

      <footer className="py-12 px-6 text-center">
        <div className="font-cormorant text-2xl tracking-[0.3em] gold-text font-light mb-2">NOIR</div>
        <p className="text-[9px] tracking-[0.4em] text-gold/25 uppercase font-montserrat">
          Персональный фотожурнал · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
