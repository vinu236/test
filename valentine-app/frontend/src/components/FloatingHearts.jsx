import { useEffect, useRef } from 'react';

export default function FloatingHearts({ count = 18 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const hearts = ['💕', '💖', '💗', '❤️', '💝', '💘', '🌹', '✨', '💓', '♥️'];

    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = Math.random() * 100 + '%';
      heart.style.fontSize = (Math.random() * 20 + 14) + 'px';
      heart.style.animationDuration = (Math.random() * 8 + 6) + 's';
      heart.style.animationDelay = (Math.random() * 10) + 's';
      container.appendChild(heart);
    }

    return () => { container.innerHTML = ''; };
  }, [count]);

  return <div className="hearts-bg" ref={containerRef}></div>;
}
