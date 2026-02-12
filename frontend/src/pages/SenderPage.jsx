import { useState, useRef } from 'react';
import FloatingHearts from '../components/FloatingHearts';
import './SenderPage.css';

export default function SenderPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', message: '' }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/send-valentine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: `💕 ${data.message || 'Valentine sent successfully!'}<br/><small>Check ${email} for the magic ✨</small>`,
        });
        setName('');
        setEmail('');
        createSuccessHearts();
      } else {
        throw new Error(data.error || 'Something went wrong');
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: `😢 ${err.message}<br/><small>Make sure your email settings in .env are correct</small>`,
      });
    } finally {
      setLoading(false);
    }
  }

  function createSuccessHearts() {
    const hearts = ['💕', '💖', '💝', '💌', '🌹'];
    for (let i = 0; i < 15; i++) {
      const heart = document.createElement('div');
      heart.style.cssText = `
        position: fixed;
        font-size: ${Math.random() * 20 + 16}px;
        left: ${Math.random() * 100}%;
        top: 100%;
        z-index: 100;
        pointer-events: none;
        animation: successHeart ${Math.random() * 2 + 2}s ease-out forwards;
        animation-delay: ${Math.random() * 0.5}s;
      `;
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 3000);
    }
  }

  return (
    <>
      <FloatingHearts count={18} />
      <div className="main-container sender-container">
        {/* Header */}
        <div className="header">
          <div className="header-emoji">💘</div>
          <h1 className="header-title">Valentine's Cupid</h1>
          <p className="header-subtitle">Send a magical Valentine's message to your special someone</p>
        </div>

        {/* Card */}
        <div className="card">
          <div className="card-glow"></div>
          <div className="card-header">
            <span className="card-icon">✉️</span>
            <h2 className="card-title">Compose Your Valentine</h2>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                <span className="label-icon">💝</span> Her Name
              </label>
              <input
                type="text"
                id="name"
                className="form-input"
                placeholder="Enter her beautiful name..."
                required
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="input-glow"></div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                <span className="label-icon">📧</span> Her Email
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="Enter her email address..."
                required
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="input-glow"></div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {!loading ? (
                <span className="btn-content">
                  <span className="btn-icon">💌</span>
                  <span className="btn-text">Send Valentine</span>
                </span>
              ) : (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  <span>Sending love...</span>
                </span>
              )}
            </button>
          </form>

          {/* Status Message */}
          {status && (
            <div
              className={`status-message ${status.type}`}
              dangerouslySetInnerHTML={{ __html: status.message }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="footer">
          <p>Made with ❤️ for Valentine's Day 2026</p>
        </div>
      </div>
    </>
  );
}
