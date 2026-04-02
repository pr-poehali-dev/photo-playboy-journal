export interface Photo {
  id: number;
  src: string;
  title: string;
  category: string;
  date: string;
  year: number;
  month: number;
  tags: string[];
  aspect: 'tall' | 'wide' | 'square';
}

export const CATEGORIES = ['Все', 'Портрет', 'Будуар', 'Гламур', 'Арт', 'Студия'];
export const YEARS = [2024, 2025, 2026];
export const ALL_TAGS = ['золото', 'чб', 'цвет', 'студия', 'натура', 'шёлк', 'ночь', 'свет', 'тени', 'образ'];

export const photos: Photo[] = [
  {
    id: 1,
    src: 'https://cdn.poehali.dev/projects/4f15a58b-5ac8-4c43-94a8-6a8a72c791f8/files/5d7655fe-f455-4a46-85ca-7aa62ab4a34c.jpg',
    title: 'Силуэт в золоте',
    category: 'Портрет',
    date: 'Январь 2026',
    year: 2026,
    month: 1,
    tags: ['золото', 'тени', 'образ'],
    aspect: 'tall',
  },
  {
    id: 2,
    src: 'https://cdn.poehali.dev/projects/4f15a58b-5ac8-4c43-94a8-6a8a72c791f8/files/2d1212fd-2f7e-4dc8-8448-45e6bff32e1c.jpg',
    title: 'Бархат и шёлк',
    category: 'Будуар',
    date: 'Февраль 2025',
    year: 2025,
    month: 2,
    tags: ['шёлк', 'золото', 'студия'],
    aspect: 'wide',
  },
  {
    id: 3,
    src: 'https://cdn.poehali.dev/projects/4f15a58b-5ac8-4c43-94a8-6a8a72c791f8/files/cacfb827-ae5b-4715-8965-9824cb088669.jpg',
    title: 'Золотой час',
    category: 'Гламур',
    date: 'Март 2025',
    year: 2025,
    month: 3,
    tags: ['золото', 'свет', 'цвет'],
    aspect: 'square',
  },
  {
    id: 4,
    src: 'https://cdn.poehali.dev/projects/4f15a58b-5ac8-4c43-94a8-6a8a72c791f8/files/5d7655fe-f455-4a46-85ca-7aa62ab4a34c.jpg',
    title: 'Ночная элегия',
    category: 'Арт',
    date: 'Ноябрь 2024',
    year: 2024,
    month: 11,
    tags: ['ночь', 'чб', 'тени'],
    aspect: 'tall',
  },
  {
    id: 5,
    src: 'https://cdn.poehali.dev/projects/4f15a58b-5ac8-4c43-94a8-6a8a72c791f8/files/2d1212fd-2f7e-4dc8-8448-45e6bff32e1c.jpg',
    title: 'Студийный этюд',
    category: 'Студия',
    date: 'Август 2024',
    year: 2024,
    month: 8,
    tags: ['студия', 'свет', 'образ'],
    aspect: 'square',
  },
  {
    id: 6,
    src: 'https://cdn.poehali.dev/projects/4f15a58b-5ac8-4c43-94a8-6a8a72c791f8/files/cacfb827-ae5b-4715-8965-9824cb088669.jpg',
    title: 'Утро богини',
    category: 'Портрет',
    date: 'Апрель 2025',
    year: 2025,
    month: 4,
    tags: ['золото', 'натура', 'свет'],
    aspect: 'wide',
  },
  {
    id: 7,
    src: 'https://cdn.poehali.dev/projects/4f15a58b-5ac8-4c43-94a8-6a8a72c791f8/files/5d7655fe-f455-4a46-85ca-7aa62ab4a34c.jpg',
    title: 'Чёрная жемчужина',
    category: 'Гламур',
    date: 'Июль 2025',
    year: 2025,
    month: 7,
    tags: ['чб', 'тени', 'образ'],
    aspect: 'tall',
  },
  {
    id: 8,
    src: 'https://cdn.poehali.dev/projects/4f15a58b-5ac8-4c43-94a8-6a8a72c791f8/files/2d1212fd-2f7e-4dc8-8448-45e6bff32e1c.jpg',
    title: 'Тихий вечер',
    category: 'Будуар',
    date: 'Декабрь 2024',
    year: 2024,
    month: 12,
    tags: ['шёлк', 'ночь', 'натура'],
    aspect: 'square',
  },
  {
    id: 9,
    src: 'https://cdn.poehali.dev/projects/4f15a58b-5ac8-4c43-94a8-6a8a72c791f8/files/cacfb827-ae5b-4715-8965-9824cb088669.jpg',
    title: 'Огонь и свет',
    category: 'Арт',
    date: 'Март 2026',
    year: 2026,
    month: 3,
    tags: ['цвет', 'свет', 'образ'],
    aspect: 'tall',
  },
];
