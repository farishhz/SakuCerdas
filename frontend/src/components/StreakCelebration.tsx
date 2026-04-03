import React, { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';

interface StreakCelebrationProps {
  streak: number;
  onClose: () => void;
}

const StreakCelebration: React.FC<StreakCelebrationProps> = ({ streak, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Start animation
    const timer = setTimeout(() => setVisible(true), 100);
    
    // Auto close after 3 seconds
    const closeTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 500); // Wait for fade out
    }, 3500);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  return (
    <div 
      className={`streak-celebration-overlay ${visible ? 'visible' : ''}`}
      onClick={() => { setVisible(false); setTimeout(onClose, 500); }}
    >
      <div className={`streak-card ${visible ? 'animate' : ''}`}>
        <div className="streak-icon-wrapper">
          <div className="streak-glow" />
          <Flame size={80} className="streak-flame" fill="#FFA500" stroke="#FF4500" />
        </div>
        <div className="streak-text">
          <h2>SAVING STREAK!</h2>
          <div className="streak-number">{streak}</div>
          <p>Hari Tanpa Henti! 🔥</p>
          <div className="streak-message">Pertahankan kebiasaan baikmu!</div>
        </div>
      </div>

      <style>{`
        .streak-celebration-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          opacity: 0;
          visibility: hidden;
          transition: all 0.5s ease;
        }

        .streak-celebration-overlay.visible {
          opacity: 1;
          visibility: visible;
        }

        .streak-card {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 2px solid rgba(255, 165, 0, 0.3);
          border-radius: 2rem;
          padding: 3rem;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 165, 0, 0.1);
          transform: scale(0.8) translateY(20px);
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          max-width: 400px;
          width: 90%;
        }

        .streak-card.animate {
          transform: scale(1) translateY(0);
        }

        .streak-icon-wrapper {
          position: relative;
          margin-bottom: 1.5rem;
          display: inline-block;
        }

        .streak-flame {
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 0 15px rgba(255, 69, 0, 0.6));
          animation: flame-pulse 1.5s infinite alternate;
        }

        .streak-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 120px;
          height: 120px;
          background: radial-gradient(circle, rgba(255, 165, 0, 0.4) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          z-index: 1;
          animation: glow-rotate 4s linear infinite;
        }

        .streak-text h2 {
          color: #FFA500;
          font-size: 1.5rem;
          font-weight: 900;
          letter-spacing: 2px;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 10px rgba(255, 165, 0, 0.3);
        }

        .streak-number {
          font-size: 5rem;
          font-weight: 900;
          background: linear-gradient(to bottom, #FFFFFF, #FFA500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1;
          margin: 0.5rem 0;
        }

        .streak-text p {
          font-size: 1.25rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 1rem;
        }

        .streak-message {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          font-style: italic;
        }

        @keyframes flame-pulse {
          0% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(255, 69, 0, 0.6)); }
          100% { transform: scale(1.1); filter: drop-shadow(0 0 25px rgba(255, 69, 0, 0.8)); }
        }

        @keyframes glow-rotate {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default StreakCelebration;
