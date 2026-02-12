import { useEffect, useRef } from 'react';
import './CelebrationOverlay.css';

export default function CelebrationOverlay({ active, name }) {
  const heartsRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    createCelebrationHearts();
    createConfetti();
    const interval = setInterval(createConfetti, 2000);
    const timeout = setTimeout(() => clearInterval(interval), 10000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [active]);

  function createCelebrationHearts() {
    const container = heartsRef.current;
    if (!container) return;
    const hearts = ['💕', '💖', '💗', '❤️', '💝', '💘', '🌹', '💓', '♥️', '🥰'];
    for (let i = 0; i < 40; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = Math.random() * 100 + '%';
      heart.style.fontSize = (Math.random() * 24 + 16) + 'px';
      heart.style.animationDuration = (Math.random() * 6 + 4) + 's';
      heart.style.animationDelay = (Math.random() * 5) + 's';
      container.appendChild(heart);
    }
  }

  function createConfetti() {
    const colors = ['#ff6b81', '#ff4757', '#ffb8c6', '#ff9ff3', '#feca57', '#fff', '#ff6348', '#ee5a24'];
    const shapes = ['circle', 'square', 'heart'];
    for (let i = 0; i < 60; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const size = Math.random() * 10 + 5;
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = '-10px';
      confetti.style.width = size + 'px';
      confetti.style.height = size + 'px';
      if (shape === 'circle') {
        confetti.style.borderRadius = '50%';
        confetti.style.background = color;
      } else if (shape === 'square') {
        confetti.style.background = color;
        confetti.style.borderRadius = '2px';
      } else {
        confetti.textContent = '❤️';
        confetti.style.fontSize = size + 'px';
        confetti.style.background = 'none';
        confetti.style.width = 'auto';
        confetti.style.height = 'auto';
      }
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
      confetti.style.animationDelay = (Math.random() * 1) + 's';
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 6000);
    }
  }

  if (!active) return null;

  return (
    <div className={`celebration-overlay ${active ? 'active' : ''}`}>
      <div className="celebration-content">
        <div className="celebration-hearts" ref={heartsRef}></div>
        <div className="celebration-emoji">🥰💕</div>
        <h1 className="celebration-title">Yaaay!</h1>
        <p className="celebration-text">
          I knew you'd say yes, <span className="name-highlight">{name}</span>! 💕<br />
          You just made me the happiest person alive!
        </p>
        <div className="celebration-roses">🌹🌹🌹🌹🌹</div>
        <p className="celebration-love">I Love You Forever & Always 💝</p>
      </div>
    </div>
  );
}
