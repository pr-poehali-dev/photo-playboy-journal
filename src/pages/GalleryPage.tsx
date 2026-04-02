import { useState, useMemo, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { CATEGORIES, YEARS, ALL_TAGS } from '@/data/photos';
import { listPhotos, uploadPhoto, deletePhoto, type PhotoItem } from '@/api';

interface LightboxProps {
  photo: PhotoItem;
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
      <button className="absolute top-6 right-6 text-gold/50 hover:text-gold transition-colors cursor-none z-10" onClick={onClose}>
        <Icon name="X" size={24} />
      </button>
      <button
        className="absolute left-6 top-1/2 -translate-y-1/2 text-gold/50 hover:text-gold transition-colors cursor-none z-10"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
      >
        <Icon name="ChevronLeft" size={32} />
      </button>
      <div className="max-w-4xl max-h-[85vh] mx-auto px-16 flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
        <img src={photo.src} alt={photo.title} className="max-h-[70vh] max-w-full object-contain" style={{ boxShadow: '0 0 80px rgba(201,168,76,0.1)' }} />
        <div className="text-center">
          <h3 className="font-cormorant text-2xl gold-text font-light">{photo.title}</h3>
          <div className="flex items-center justify-center gap-4 mt-2">
            <span className="text-[9px] tracking-[0.3em] text-gold/40 uppercase font-montserrat">{photo.category}</span>
            <span className="text-gold/20">·</span>
            <span className="text-[9px] tracking-[0.3em] text-gold/40 uppercase font-montserrat">{photo.date}</span>
          </div>
          <div className="flex gap-2 justify-center mt-3">
            {photo.tags.map(tag => <span key={tag} className="tag-badge">{tag}</span>)}
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

const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

interface UploadModalProps {
  onClose: () => void;
  onUploaded: () => void;
}

function UploadModal({ onClose, onUploaded }: UploadModalProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileB64, setFileB64] = useState<string>('');
  const [filename, setFilename] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Портрет');
  const [aspect, setAspect] = useState('square');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPreview(result);
      setFileB64(result);
    };
    reader.readAsDataURL(file);
  };

  const toggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = async () => {
    if (!fileB64) return;
    setLoading(true);
    await uploadPhoto({
      file: fileB64,
      filename,
      title: title || 'Без названия',
      category,
      tags,
      aspect,
      year,
      month,
      date_label: `${MONTHS[month - 1]} ${year}`,
    });
    setLoading(false);
    onUploaded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-noir/95 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl border border-gold/20 bg-noir-card p-8 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[8px] tracking-[0.5em] text-gold/30 uppercase font-montserrat block mb-1">Добавить</span>
            <h2 className="font-cormorant text-3xl gold-text font-light">Новое фото</h2>
          </div>
          <button className="text-gold/30 hover:text-gold cursor-none" onClick={onClose}>
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* File drop */}
        <div
          className="border border-dashed border-gold/20 hover:border-gold/50 transition-colors cursor-none mb-6 flex items-center justify-center overflow-hidden"
          style={{ minHeight: 200 }}
          onClick={() => fileRef.current?.click()}
        >
          {preview ? (
            <img src={preview} alt="preview" className="max-h-64 object-contain" />
          ) : (
            <div className="text-center py-12 px-6">
              <Icon name="Upload" size={28} className="text-gold/30 mx-auto mb-3" />
              <p className="text-[10px] tracking-[0.3em] text-gold/30 uppercase font-montserrat">Нажмите чтобы выбрать фото</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Title */}
          <div className="col-span-2">
            <label className="text-[8px] tracking-[0.4em] text-gold/30 uppercase font-montserrat block mb-2">Название</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Название фото..."
              className="w-full bg-noir border border-gold/15 px-4 py-3 text-gold/80 font-montserrat text-sm focus:outline-none focus:border-gold/40 placeholder:text-gold/20"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-[8px] tracking-[0.4em] text-gold/30 uppercase font-montserrat block mb-2">Категория</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-noir border border-gold/15 px-4 py-3 text-gold/80 font-montserrat text-sm focus:outline-none focus:border-gold/40 cursor-none"
            >
              {CATEGORIES.filter(c => c !== 'Все').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Aspect */}
          <div>
            <label className="text-[8px] tracking-[0.4em] text-gold/30 uppercase font-montserrat block mb-2">Формат</label>
            <select
              value={aspect}
              onChange={e => setAspect(e.target.value)}
              className="w-full bg-noir border border-gold/15 px-4 py-3 text-gold/80 font-montserrat text-sm focus:outline-none focus:border-gold/40 cursor-none"
            >
              <option value="square">Квадрат</option>
              <option value="tall">Вертикальное</option>
              <option value="wide">Горизонтальное</option>
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="text-[8px] tracking-[0.4em] text-gold/30 uppercase font-montserrat block mb-2">Год</label>
            <select
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="w-full bg-noir border border-gold/15 px-4 py-3 text-gold/80 font-montserrat text-sm focus:outline-none focus:border-gold/40 cursor-none"
            >
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Month */}
          <div>
            <label className="text-[8px] tracking-[0.4em] text-gold/30 uppercase font-montserrat block mb-2">Месяц</label>
            <select
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
              className="w-full bg-noir border border-gold/15 px-4 py-3 text-gold/80 font-montserrat text-sm focus:outline-none focus:border-gold/40 cursor-none"
            >
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-8">
          <label className="text-[8px] tracking-[0.4em] text-gold/30 uppercase font-montserrat block mb-3">Теги</label>
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`filter-tag text-[9px] tracking-[0.1em] font-montserrat px-3 py-1.5 cursor-none ${tags.includes(tag) ? 'active' : ''}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!fileB64 || loading}
          className="w-full py-4 text-[11px] tracking-[0.3em] uppercase font-montserrat font-medium transition-all cursor-none
            bg-gold text-noir hover:bg-gold-light disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {loading ? 'Загружаю...' : 'Добавить в галерею'}
        </button>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [lightboxId, setLightboxId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await listPhotos();
    setPhotos(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filteredPhotos = useMemo(() => {
    return photos.filter(p => {
      if (selectedCategory !== 'Все' && p.category !== selectedCategory) return false;
      if (selectedYear && p.year !== selectedYear) return false;
      if (selectedTags.length > 0 && !selectedTags.some(t => p.tags.includes(t))) return false;
      return true;
    });
  }, [photos, selectedCategory, selectedYear, selectedTags]);

  const lightboxPhoto = filteredPhotos.find(p => p.id === lightboxId);
  const lightboxIndex = filteredPhotos.findIndex(p => p.id === lightboxId);

  const toggleTag = (tag: string) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  const clearFilters = () => { setSelectedCategory('Все'); setSelectedYear(null); setSelectedTags([]); };
  const hasFilters = selectedCategory !== 'Все' || selectedYear !== null || selectedTags.length > 0;

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    await deletePhoto(id);
    setPhotos(prev => prev.filter(p => p.id !== id));
    setDeletingId(null);
  };

  return (
    <div className="min-h-screen bg-noir pt-24 pb-16">
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onUploaded={load} />}

      {lightboxPhoto && (
        <Lightbox
          photo={lightboxPhoto}
          onClose={() => setLightboxId(null)}
          onPrev={() => setLightboxId(filteredPhotos[(lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length].id)}
          onNext={() => setLightboxId(filteredPhotos[(lightboxIndex + 1) % filteredPhotos.length].id)}
        />
      )}

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="text-[9px] tracking-[0.5em] text-gold/40 uppercase font-montserrat block mb-3">Коллекция</span>
            <h1 className="font-cormorant text-5xl md:text-6xl gold-text font-light">Галерея</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[9px] tracking-[0.3em] text-gold/30 font-montserrat uppercase">{filteredPhotos.length} работ</span>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border border-gold/20 px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-montserrat text-gold/60 hover:text-gold hover:border-gold/50 transition-all cursor-none"
            >
              <Icon name="SlidersHorizontal" size={12} />
              Фильтры
              {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />}
            </button>
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 bg-gold text-noir px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-montserrat font-medium hover:bg-gold-light transition-all cursor-none"
            >
              <Icon name="Plus" size={12} />
              Добавить фото
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-10 p-6 border border-gold/10 bg-noir-card/50 animate-fade-in-up">
            <div className="flex flex-wrap gap-y-6 gap-x-10">
              <div>
                <p className="text-[8px] tracking-[0.4em] text-gold/30 uppercase font-montserrat mb-3">Категория</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)}
                      className={`filter-tag text-[9px] tracking-[0.15em] uppercase font-montserrat px-3 py-1.5 cursor-none ${selectedCategory === cat ? 'active' : ''}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[8px] tracking-[0.4em] text-gold/30 uppercase font-montserrat mb-3">Год</p>
                <div className="flex flex-wrap gap-2">
                  {YEARS.map(y => (
                    <button key={y} onClick={() => setSelectedYear(selectedYear === y ? null : y)}
                      className={`filter-tag text-[9px] tracking-[0.15em] font-montserrat px-3 py-1.5 cursor-none ${selectedYear === y ? 'active' : ''}`}>
                      {y}
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-full">
                <p className="text-[8px] tracking-[0.4em] text-gold/30 uppercase font-montserrat mb-3">Теги</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_TAGS.map(tag => (
                    <button key={tag} onClick={() => toggleTag(tag)}
                      className={`filter-tag text-[9px] tracking-[0.15em] font-montserrat px-3 py-1.5 cursor-none ${selectedTags.includes(tag) ? 'active' : ''}`}>
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-6 flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase font-montserrat text-gold/30 hover:text-gold/60 transition-colors cursor-none">
                <Icon name="X" size={10} /> Сбросить фильтры
              </button>
            )}
          </div>
        )}

        {/* Active filters pills */}
        {hasFilters && !showFilters && (
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <span className="text-[8px] tracking-[0.3em] text-gold/30 uppercase font-montserrat">Фильтры:</span>
            {selectedCategory !== 'Все' && <span className="tag-badge cursor-none" onClick={() => setSelectedCategory('Все')}>{selectedCategory} ×</span>}
            {selectedYear && <span className="tag-badge cursor-none" onClick={() => setSelectedYear(null)}>{selectedYear} ×</span>}
            {selectedTags.map(t => <span key={t} className="tag-badge cursor-none" onClick={() => toggleTag(t)}>#{t} ×</span>)}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="py-32 text-center">
            <div className="inline-block w-8 h-8 border border-gold/30 border-t-gold rounded-full animate-spin" />
            <p className="text-[9px] tracking-[0.4em] text-gold/30 uppercase font-montserrat mt-4">Загрузка...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredPhotos.length === 0 && (
          <div className="py-32 text-center">
            <Icon name="Images" size={40} className="text-gold/20 mx-auto mb-4" />
            <div className="font-cormorant text-2xl text-gold/30 font-light mb-2">
              {photos.length === 0 ? 'Галерея пуста' : 'Ничего не найдено'}
            </div>
            {photos.length === 0 ? (
              <button onClick={() => setShowUpload(true)} className="mt-6 text-[10px] tracking-[0.3em] uppercase font-montserrat text-gold/40 hover:text-gold transition-colors cursor-none">
                Добавить первое фото →
              </button>
            ) : (
              <button onClick={clearFilters} className="mt-4 text-[10px] tracking-[0.3em] uppercase font-montserrat text-gold/40 hover:text-gold transition-colors cursor-none">
                Сбросить фильтры
              </button>
            )}
          </div>
        )}

        {/* Masonry grid */}
        {!loading && filteredPhotos.length > 0 && (
          <div className="masonry-grid">
            {filteredPhotos.map((photo) => (
              <div key={photo.id} className="masonry-item photo-card group cursor-none relative">
                <img src={photo.src} alt={photo.title} className="w-full block" onClick={() => setLightboxId(photo.id)} />
                <div className="overlay absolute inset-0 bg-gradient-to-t from-noir/90 via-transparent to-transparent flex flex-col justify-end p-4" onClick={() => setLightboxId(photo.id)}>
                  <div className="flex gap-1.5 mb-2 flex-wrap">
                    {photo.tags.slice(0, 2).map(tag => <span key={tag} className="tag-badge text-[8px]">{tag}</span>)}
                  </div>
                  <h3 className="font-cormorant text-lg text-gold font-light leading-tight">{photo.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[9px] tracking-[0.15em] text-gold/40 uppercase font-montserrat">{photo.category}</span>
                    <span className="text-gold/20 text-xs">·</span>
                    <span className="text-[9px] tracking-[0.1em] text-gold/30 font-montserrat">{photo.date}</span>
                  </div>
                </div>
                {/* Delete button */}
                <button
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-noir/80 p-1.5 text-gold/50 hover:text-red-400 cursor-none"
                  onClick={() => handleDelete(photo.id)}
                  disabled={deletingId === photo.id}
                >
                  <Icon name={deletingId === photo.id ? 'Loader' : 'Trash2'} size={14} />
                </button>
                <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/30 transition-all duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
