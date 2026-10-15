import React, { useEffect, useRef } from 'react';
import { Sparkles, Trophy, X, Flame } from 'lucide-react';
import { playSiuuuRoarSound } from '../utils/audio';

interface SiuuuCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
  soundEnabled?: boolean;
}

export const SiuuuCelebrationModal: React.FC<SiuuuCelebrationModalProps> = ({
  isOpen,
  onClose,
  reason = 'Training Session / Matchday Goal Completed!',
  soundEnabled = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (soundEnabled) {
      playSiuuuRoarSound();
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Gold & Cyan Celebration Particles
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      alpha: number;
      decay: number;
      rotation: number;
      vRot: number;
    }

    const particles: Particle[] = [];
    const colors = ['#D4AF37', '#FFDF00', '#45B7FF', '#FFFFFF', '#0757C8', '#C8102E'];

    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      particles.push({
        x: width / 2,
        y: height / 2 - 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 7 + 3,
        alpha: 1,
        decay: Math.random() * 0.012 + 0.008,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
      });
    }

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.alpha -= p.decay;
        p.rotation += p.vRot;

        if (p.alpha > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });

      if (particles.some((p) => p.alpha > 0)) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    // Auto-dismiss after 6 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 6000);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      clearTimeout(timer);
    };
  }, [isOpen, onClose, soundEnabled]);

  if (!isOpen) return null;

  return (
    <div
      id="siuuu-celebration-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all animate-in fade-in duration-300 select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="SIUUU Celebration Banner"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* Floodlight Beam Flare in Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-600/30 via-sky-400/20 to-amber-400/25 blur-3xl animate-pulse" />
      </div>

      {/* Main Celebration Banner Card */}
      <div
        className="relative z-10 max-w-lg w-full rounded-3xl p-6 sm:p-8 text-center border shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-300"
        style={{
          background: 'linear-gradient(145deg, #06152E 0%, #0B2042 60%, #112A52 100%)',
          borderColor: 'rgba(212, 175, 55, 0.6)',
          boxShadow: '0 0 50px rgba(69, 183, 255, 0.4), 0 0 30px rgba(212, 175, 55, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close celebration banner"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Floating #7 Crest */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3 border shadow-lg font-black text-2xl text-white tracking-wider"
          style={{
            background: 'linear-gradient(135deg, #0757C8 0%, #45B7FF 50%, #D4AF37 100%)',
            borderColor: '#FFFFFF',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          }}
        >
          #7
        </div>

        {/* Main SIUUUUUU Banner Headline */}
        <h1
          id="siuuu-headline"
          className="text-4xl sm:text-5xl font-black italic tracking-tighter text-transparent bg-clip-text uppercase my-2 drop-shadow-md"
          style={{
            backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #45B7FF 55%, #D4AF37 100%)',
          }}
        >
          SIUUUUUU!
        </h1>

        {/* XP Gain Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-md my-2"
          style={{
            backgroundColor: 'rgba(212, 175, 55, 0.2)',
            borderColor: '#D4AF37',
            color: '#FFDF00',
          }}
        >
          <Trophy className="w-4 h-4 text-amber-300" />
          <span className="font-black text-sm sm:text-base tracking-wider">+70 PERFORMANCE XP</span>
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
        </div>

        {/* Reason */}
        <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-2">
          {reason}
        </p>

        {/* Cristiano Ronaldo Mindset Quote */}
        <div className="mt-4 pt-3 border-t border-white/15">
          <blockquote className="text-xs sm:text-sm font-medium italic text-sky-200">
            &ldquo;Greatness is a choice. Dedication, discipline, and no excuses.&rdquo;
          </blockquote>
          <span className="block text-[11px] font-bold text-amber-400 mt-1 uppercase tracking-widest">
            — Cristiano Ronaldo · CR7
          </span>
        </div>

        {/* Dismiss CTA */}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 px-6 py-2.5 rounded-2xl font-black text-xs sm:text-sm tracking-wider uppercase text-white shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #0757C8 0%, #45B7FF 100%)',
          }}
        >
          Continue Dominating ⚡
        </button>
      </div>
    </div>
  );
};
