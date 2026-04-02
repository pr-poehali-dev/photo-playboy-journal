import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { photos, CATEGORIES, YEARS, ALL_TAGS, type Photo } from '@/data/photos';

interface LightboxProps {
  photo: Photo;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ photo, onClose, onPrev, onNext }: LightboxProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-noir/97 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        className="absolute top-6 right-6 text-gold/50 hover:text-gold transition-colors cursor-none z-10"
        onClick={onClose}
      >
        <Icon name="X" size={24} />
      </button>

      <button
        className="absolute left-6 top-1/2 -translate-y-1/2 text-gold/50 hover:text-gold transition-colors cursor-none z-10"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
      >
        <Icon name="ChevronLeft" size={32} />
      </button>

      <div
        className="max-w-4xl max-h-[85vh] mx-auto px-16 flex flex-col items-center gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.src}
          alt={photo.title}
          className="max-h-[70vh] max-w-full object-contain"
          style={{ boxShadow: '0 0 80px rgba(201,168,76,0.1)' }}
        />
        <div className="text-center">
          <h3 className="font-cormorant text-2xl gold-text font-light">{photo.title}</h3>
          <div className="flex items-center justify-center gap-4 mt-2">
            <span className="text-[9px] tracking-[0.3em] text-gold/40 uppercase font-montserrat">{photo.category}</span>
            <span className="text-gold/20">·</span>
            <span className="text-[9px] tracking-[0.3em] text-gold/40 uppercase font-montserrat">{photo.date}</span>
          </div>
          <div className="flex gap-2 justify-center mt-3">
            {photo.tags.map(tag => (
              <span key={tag} className="tag-badge">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <button
        className="absolute right-6 top-1/2 -translate-y-1/2 text-gold/50 hover:text-gold transition-colors cursor-none z-10"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
      >
        <Icon name="ChevronRight" size={32} />
      </button>
    </div>
  );
}

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [lightboxId, setLightboxId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredPhotos = useMemo(() => {
    return photos.filter(p => {
      if (selectedCategory !== 'Все' && p.category !== selectedCategory) return false;
      if (selectedYear && p.year !== selectedYear) return false;
      if (selectedTags.length > 0 && !selectedTags.some(t => p.tags.includes(t))) return false;
      return true;
    });
  }, [selectedCategory, selectedYear, selectedTags]);

  const lightboxPhoto = filteredPhotos.find(p => p.id === lightboxId);
  const lightboxIndex = filteredPhotos.findIndex(p => p.id === lightboxId);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('Все');
    setSelectedYear(null);
    setSelectedTags([]);
  };

  const hasFilters = selectedCategory !== 'Все' || selectedYear !== null || selectedTags.length > 0;

  return (
    <div className="min-h-screen bg-noir pt-24 pb-16">
      {lightboxPhoto && (
        <Lightbox
          photo={lightboxPhoto}
          onClose={() => setLightboxId(null)}
          onPrev={() => {
            const prev = filteredPhotos[(lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length];
            setLightboxId(prev.id);
          }}
          onNext={() => {
            const next = filteredPhotos[(lightboxIndex + 1) % filteredPhotos.length];
            setLightboxId(next.id);
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <span className="text-[9px] tracking-[0.5em] text-gold/40 uppercase font-montserrat block mb-3">
              Коллекция
            </span>
            <h1 className="font-cormorant text-5xl md:text-6xl gold-text font-light">
              Галерея
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[9px] tracking-[0.3em] text-gold/30 font-montserrat uppercase">
              {filteredPhotos.length} работ
            </span>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border border-gold/20 px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-montserrat text-gold/60 hover:text-gold hover:border-gold/50 transition-all cursor-none"
            >
              <Icon name="SlidersHorizontal" size={12} />
              Фильтры
              {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />}
            </button>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="mb-10 p-6 border border-gold/10 bg-noir-card/50 animate-fade-in-up">
            <div className="flex flex-wrap gap-y-6 gap-x-10">
              {/* Category */}
              <div>
                <p className="text-[8px] tracking-[0.4em] text-gold/30 uppercase font-montserrat mb-3">Категория</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`filter-tag text-[9px] tracking-[0.15em] uppercase font-montserrat px-3 py-1.5 cursor-none ${
                        selectedCategory === cat ? 'active' : ''
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year */}
              <div>
                <p className="text-[8px] tracking-[0.4em] text-gold/30 uppercase font-montserrat mb-3">Год</p>
                <div className="flex flex-wrap gap-2">
                  {YEARS.map(year => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                      className={`filter-tag text-[9px] tracking-[0.15em] font-montserrat px-3 py-1.5 cursor-none ${
                        selectedYear === year ? 'active' : ''
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="w-full">
                <p className="text-[8px] tracking-[0.4em] text-gold/30 uppercase font-montserrat mb-3">Теги</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_TAGS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`filter-tag text-[9px] tracking-[0.15em] font-montserrat px-3 py-1.5 cursor-none ${
                        selectedTags.includes(tag) ? 'active' : ''
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-6 flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase font-montserrat text-gold/30 hover:text-gold/60 transition-colors cursor-none"
              >
                <Icon name="X" size={10} />
                Сбросить фильтры
              </button>
            )}
          </div>
        )}

        {/* Active filters display */}
        {hasFilters && !showFilters && (
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <span className="text-[8px] tracking-[0.3em] text-gold/30 uppercase font-montserrat">Фильтры:</span>
            {selectedCategory !== 'Все' && (
              <span className="tag-badge cursor-none" onClick={() => setSelectedCategory('Все')}>
                {selectedCategory} ×
              </span>
            )}
            {selectedYear && (
              <span className="tag-badge cursor-none" onClick={() => setSelectedYear(null)}>
                {selectedYear} ×
              </span>
            )}
            {selectedTags.map(t => (
              <span key={t} className="tag-badge cursor-none" onClick={() => toggleTag(t)}>
                #{t} ×
              </span>
            ))}
          </div>
        )}

        {/* Masonry grid */}
        {filteredPhotos.length === 0 ? (
          <div className="py-32 text-center">
            <div className="font-cormorant text-2xl text-gold/30 font-light">Ничего не найдено</div>
            <button
              onClick={clearFilters}
              className="mt-6 text-[10px] tracking-[0.3em] uppercase font-montserrat text-gold/40 hover:text-gold transition-colors cursor-none"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="masonry-grid">
            {filteredPhotos.map((photo, i) => (
              <div
                key={photo.id}
                className="masonry-item photo-card group cursor-none relative"
                onClick={() => setLightboxId(photo.id)}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full block"
                />
                <div className="overlay absolute inset-0 bg-gradient-to-t from-noir/90 via-transparent to-transparent flex flex-col justify-end p-4">
                  <div className="flex gap-1.5 mb-2 flex-wrap">
                    {photo.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="tag-badge text-[8px]">{tag}</span>
                    ))}
                  </div>
                  <h3 className="font-cormorant text-lg text-gold font-light leading-tight">{photo.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[9px] tracking-[0.15em] text-gold/40 uppercase font-montserrat">{photo.category}</span>
                    <span className="text-gold/20 text-xs">·</span>
                    <span className="text-[9px] tracking-[0.1em] text-gold/30 font-montserrat">{photo.date}</span>
                  </div>
                </div>
                <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/30 transition-all duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
