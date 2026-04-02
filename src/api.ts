const UPLOAD_URL = 'https://functions.poehali.dev/13c84c32-b8bc-4b43-be8e-79e74f956056';
const LIST_URL = 'https://functions.poehali.dev/9a15486a-827f-4279-bd19-6de8412f9e35';
const DELETE_URL = 'https://functions.poehali.dev/882f2ac3-82f0-4b0d-a030-0b63fb69e2f7';

export interface PhotoItem {
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

export async function listPhotos(): Promise<PhotoItem[]> {
  const res = await fetch(LIST_URL);
  const data = await res.json();
  return data.photos || [];
}

export async function uploadPhoto(payload: {
  file: string;
  filename: string;
  title: string;
  category: string;
  tags: string[];
  aspect: string;
  year: number;
  month: number;
  date_label: string;
}): Promise<{ id: number; cdn_url: string }> {
  const res = await fetch(UPLOAD_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function deletePhoto(id: number): Promise<void> {
  await fetch(DELETE_URL, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
}
