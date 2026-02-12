import { useEffect, useRef } from 'react';

export default function SparkleOverlay() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < 30; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = Math.random() * 100 + '%';
      sparkle.style.top = Math.random() * 100 + '%';
      sparkle.style.animationDelay = (Math.random() * 3) + 's';
      sparkle.style.animationDuration = (Math.random() * 2 + 2) + 's';
      container.appendChild(sparkle);
    }

    return () => { container.innerHTML = ''; };
  }, []);

  return <div className="sparkle-overlay" ref={containerRef}></div>;
}
