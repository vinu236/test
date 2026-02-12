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
  const hasEscapedRef = useRef(false);
  const isEscapingRef = useRef(false); // debounce flag

  const noTexts = [
    'No', 'Are you sure?', 'Really?', 'Think again!',
    'Nope 🙅', "Can't catch me!", 'Try again!',
    "You can't!", 'Impossible!', 'Give up? 😏',
    'Say YES! 💕', 'Please? 🥺', 'Just say YES!',
  ];

  // Clamp button position to stay fully within viewport
  const clampToViewport = useCallback((noBtn) => {
    if (!noBtn) return;
    const rect = noBtn.getBoundingClientRect();
    const btnW = rect.width;
    const btnH = rect.height;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = rect.left;
    let top = rect.top;

    // Strict: keep entire button within viewport with 8px margin
    const margin = 8;
    left = Math.max(margin, Math.min(left, vw - btnW - margin));
    top = Math.max(margin, Math.min(top, vh - btnH - margin));

    noBtn.style.left = left + 'px';
    noBtn.style.top = top + 'px';
  }, []);

  const escapeNoButton = useCallback(() => {
    const noBtn = noBtnRef.current;
    const yesBtn = yesBtnRef.current;
    if (!noBtn || !yesBtn) return;

    hasEscapedRef.current = true;
    noEscapeCountRef.current += 1;
    const count = noEscapeCountRef.current;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Measure the button's actual rendered size (before transform scaling)
    const currentScale = Math.max(0.6, 1 - count * 0.04);
    // Get unscaled size from boundingRect / currentPreviousScale
    const prevScale = count > 1 ? Math.max(0.6, 1 - (count - 1) * 0.04) : 1;
    const rect = noBtn.getBoundingClientRect();
    const btnW = rect.width / prevScale; // approximate unscaled width
    const btnH = rect.height / prevScale;

    // Scaled dimensions
    const scaledW = btnW * currentScale;
    const scaledH = btnH * currentScale;

    // Strict margin from edges — button must stay fully visible
    const edgeMargin = 12;

    // Available area for the button's top-left corner
    const maxX = vw - scaledW - edgeMargin;
    const maxY = vh - scaledH - edgeMargin;
    const minX = edgeMargin;
    const minY = edgeMargin;

    // Generate random position within safe bounds
    let randomX = Math.floor(Math.random() * Math.max(1, maxX - minX)) + minX;
    let randomY = Math.floor(Math.random() * Math.max(1, maxY - minY)) + minY;

    // Final absolute clamp — never go outside viewport
    randomX = Math.max(edgeMargin, Math.min(randomX, vw - scaledW - edgeMargin));
    randomY = Math.max(edgeMargin, Math.min(randomY, vh - scaledH - edgeMargin));

    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    noBtn.style.right = 'auto';
    noBtn.style.bottom = 'auto';
    noBtn.style.zIndex = '100';
    noBtn.style.transition = 'all 0.2s ease-out';
    noBtn.style.margin = '0';
    noBtn.style.transform = `scale(${currentScale})`;
    noBtn.style.transformOrigin = 'top left';
    noBtn.style.pointerEvents = 'auto'; // keep events so hover/touch triggers escape

    // Grow the Yes button
    yesScaleRef.current = Math.min(1.8, 1 + count * 0.08);
    yesBtn.style.transform = `scale(${yesScaleRef.current})`;

    // Update button text
    const textIndex = Math.min(count - 1, noTexts.length - 1);
    const textEl = noBtn.querySelector('.btn-text');
    if (textEl) textEl.textContent = noTexts[textIndex];

    // Re-trigger Yes glow animation
    yesBtn.style.animation = 'none';
    setTimeout(() => {
      yesBtn.style.animation = 'yesGlow 2s ease-in-out infinite';
    }, 10);
  }, []);

  // Mouse proximity detection
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
      if (distance < 70) escapeNoButton();
    }
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [escapeNoButton]);

  // Touch move proximity detection (for mobile drag-toward behavior)
  useEffect(() => {
    function handleTouchMove(e) {
      const noBtn = noBtnRef.current;
      if (!noBtn) return;
      const touch = e.touches[0];
      if (!touch) return;
      const rect = noBtn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(touch.clientX - centerX, 2) +
        Math.pow(touch.clientY - centerY, 2)
      );
      if (distance < 80) escapeNoButton();
    }
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => document.removeEventListener('touchmove', handleTouchMove);
  }, [escapeNoButton]);

  // Re-clamp on window resize so button never ends up off-screen
  useEffect(() => {
    function handleResize() {
      if (hasEscapedRef.current && noBtnRef.current) {
        clampToViewport(noBtnRef.current);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [clampToViewport]);

  // Prevent No button click entirely
  function handleNoClick(e) {
    e.preventDefault();
    e.stopPropagation();
    escapeNoButton();
  }

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
            onClick={handleNoClick}
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
