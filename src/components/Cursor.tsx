import { useEffect, useRef } from 'react';

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const move = (e: MouseEvent) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    const addHover = () => cursor.classList.add('hover');
    const removeHover = () => cursor.classList.remove('hover');

    document.addEventListener('mousemove', move);

    const hoverEls = document.querySelectorAll('a, button, .photo-card, .filter-tag');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });

    return () => {
      document.removeEventListener('mousemove', move);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor hidden md:block" />;
}
