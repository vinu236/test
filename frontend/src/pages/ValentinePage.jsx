import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import FloatingHearts from '../components/FloatingHearts';
import SparkleOverlay from '../components/SparkleOverlay';
import CelebrationOverlay from '../components/CelebrationOverlay';
import './ValentinePage.css';

export default function ValentinePage() {
  const [searchParams] = useSearchParams();
  const recipientName = searchParams.get('name') || 'SHAZEN';

  const [celebrating, setCelebrating] = useState(false);
  const noEscapeCountRef = useRef(0);
  const yesScaleRef = useRef(1);
  const noBtnRef = useRef(null);
  const yesBtnRef = useRef(null);

  const noTexts = [
    'No', 'Are you sure?', 'Really?', 'Think again!',
    'Nope 🙅', "Can't catch me!", 'Try again!',
    "You can't!", 'Impossible!', 'Give up? 😏',
    'Say YES! 💕', 'Please? 🥺', 'Just say YES!',
  ];

  const escapeNoButton = useCallback(() => {
    const noBtn = noBtnRef.current;
    const yesBtn = yesBtnRef.current;
    if (!noBtn || !yesBtn) return;

    noEscapeCountRef.current += 1;
    const count = noEscapeCountRef.current;

    // Get accurate button size from bounding rect
    const btnRect = noBtn.getBoundingClientRect();
    const btnW = Math.max(btnRect.width, 100); // fallback min width
    const btnH = Math.max(btnRect.height, 50);  // fallback min height

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Safe zone padding from edges
    const padding = 80;

    // Calculate safe bounds — button must stay fully visible
    const minX = padding;
    const minY = padding;
    const maxX = Math.max(minX + 10, vw - btnW - padding);
    const maxY = Math.max(minY + 10, vh - btnH - padding);

    // Random position within safe bounds
    const randomX = Math.floor(Math.random() * (maxX - minX)) + minX;
    const randomY = Math.floor(Math.random() * (maxY - minY)) + minY;

    // Clamp to make absolutely sure it stays on screen
    const clampedX = Math.max(10, Math.min(randomX, vw - btnW - 10));
    const clampedY = Math.max(10, Math.min(randomY, vh - btnH - 10));

    noBtn.style.position = 'fixed';
    noBtn.style.left = clampedX + 'px';
    noBtn.style.top = clampedY + 'px';
    noBtn.style.right = 'auto';
    noBtn.style.bottom = 'auto';
    noBtn.style.zIndex = '100';
    noBtn.style.transition = 'all 0.2s ease-out';
    noBtn.style.margin = '0';

    const shrinkFactor = Math.max(0.6, 1 - count * 0.04);
    noBtn.style.transform = `scale(${shrinkFactor})`;

    yesScaleRef.current = Math.min(1.8, 1 + count * 0.08);
    yesBtn.style.transform = `scale(${yesScaleRef.current})`;

    const textIndex = Math.min(count - 1, noTexts.length - 1);
    const textEl = noBtn.querySelector('.btn-text');
    if (textEl) textEl.textContent = noTexts[textIndex];

    yesBtn.style.animation = 'none';
    setTimeout(() => {
      yesBtn.style.animation = 'yesGlow 2s ease-in-out infinite';
    }, 10);
  }, []);

  useEffect(() => {
    function handleMouseMove(e) {
      const noBtn = noBtnRef.current;
      if (!noBtn) return;
      const rect = noBtn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) +
        Math.pow(e.clientY - centerY, 2)
      );
      if (distance < 60) escapeNoButton();
    }
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [escapeNoButton]);

  function handleYes() {
    setCelebrating(true);
  }

  function handleYesMouseOver() {
    const yesBtn = yesBtnRef.current;
    if (yesBtn) {
      yesBtn.style.transform = `scale(${Math.max(yesScaleRef.current, 1) * 1.12})`;
    }
  }

  function handleYesMouseOut() {
    const yesBtn = yesBtnRef.current;
    if (yesBtn) {
      yesBtn.style.transform = `scale(${Math.max(yesScaleRef.current, 1)})`;
    }
  }

  return (
    <>
      <FloatingHearts count={25} />
      <SparkleOverlay />

      <div className="main-container valentine-container" id="mainContainer">
        {/* Photo Section */}
        <div className="photo-section">
          <div className="photo-frame">
            <div className="photo-glow"></div>
            <img
              src="/images/shazen.jpg"
              alt={recipientName}
              className="photo"
              onError={(e) => {
                e.target.style.display = 'none';
                document.getElementById('photoPlaceholder').style.display = 'flex';
              }}
            />
            <div className="photo-placeholder" id="photoPlaceholder">
              <span className="placeholder-emoji">👩‍🦱</span>
              <span className="placeholder-text">{recipientName}</span>
            </div>
            <div className="photo-hearts">
              <span>💖</span><span>💕</span><span>💗</span>
            </div>
          </div>
        </div>

        {/* Question Section */}
        <div className="question-section">
          <div className="envelope-icon">💌</div>
          <h1 className="title">
            <span className="title-line-1">Will You Be My</span>
            <span className="title-line-2">Valentine?</span>
          </h1>
          <p className="subtitle">
            Dear <span className="name-highlight">{recipientName}</span>, you make my heart skip a beat every single day 💕
          </p>
        </div>

        {/* Buttons Section */}
        <div className="buttons-section" id="buttonsSection">
          <button
            className="btn btn-yes"
            ref={yesBtnRef}
            onClick={handleYes}
            onMouseOver={handleYesMouseOver}
            onMouseOut={handleYesMouseOut}
          >
            <span className="btn-icon">💖</span>
            <span className="btn-text">Yes!</span>
          </button>
          <button
            className="btn btn-no"
            ref={noBtnRef}
            onMouseOver={(e) => { e.preventDefault(); escapeNoButton(); }}
            onTouchStart={(e) => { e.preventDefault(); escapeNoButton(); }}
          >
            <span className="btn-icon">😢</span>
            <span className="btn-text">No</span>
          </button>
        </div>
      </div>

      <CelebrationOverlay active={celebrating} name={recipientName} />
    </>
  );
}
