import React, { useEffect, useState, useCallback } from 'react';
import { GraduationCap, Sparkles, Instagram, Youtube } from 'lucide-react';

interface StartupIntroProps {
  onComplete: () => void;
  forceShow?: boolean;
}

export const StartupIntro: React.FC<StartupIntroProps> = ({
  onComplete,
  forceShow = false,
}) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(3);

  const handleFinish = useCallback(() => {
    setIsExiting(true);
    sessionStorage.setItem('admission_intro_viewed_v1', 'true');
    setTimeout(() => {
      onComplete();
    }, 350);
  }, [onComplete]);

  useEffect(() => {
    // If not forced and already seen in this session, complete immediately
    if (!forceShow && sessionStorage.getItem('admission_intro_viewed_v1')) {
      onComplete();
      return;
    }

    const startTime = Date.now();
    const duration = 2600; // ~2.6 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, (elapsed / duration) * 100);
      setProgress(currentProgress);

      const remaining = Math.max(1, Math.ceil((duration - elapsed) / 1000));
      setSecondsRemaining(remaining);

      if (elapsed >= duration) {
        clearInterval(interval);
        handleFinish();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [forceShow, handleFinish, onComplete]);

  return (
    <div
      id="startup-intro-overlay"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center p-4 sm:p-6 select-none transition-all duration-400 ease-out overflow-hidden ${
        isExiting ? 'opacity-0 scale-98 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: 'var(--bg-page)',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="ADMISSION 2026 Startup Screen"
    >
      {/* Ambient Radial Gradient Aura */}
      <div
        className="absolute w-[360px] sm:w-[540px] h-[360px] sm:h-[540px] rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-700 animate-pulse"
        style={{
          background: 'var(--accent-gradient)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Main Content Modal Card */}
      <div
        className="relative z-10 max-w-lg w-full rounded-3xl border shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center backdrop-blur-xl transition-all"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Top Floating Badge */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border mb-5 transition-transform animate-bounce"
          style={{
            background: 'var(--accent-gradient)',
            borderColor: 'var(--border-color)',
            color: '#ffffff',
          }}
        >
          <GraduationCap className="w-8 h-8" />
        </div>

        {/* 1. Main Title: ADMISSION 2026 */}
        <h1
          id="intro-brand-title"
          className="text-3xl sm:text-4xl font-black tracking-tight flex items-center justify-center gap-2 mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          <span>ADMISSION</span>
          <span
            className="px-2.5 py-0.5 text-sm sm:text-base font-black rounded-lg text-white shadow-xs"
            style={{
              background: 'var(--accent-gradient)',
            }}
          >
            2026
          </span>
        </h1>

        {/* 2. Subtitle: FOCUS • STUDY • PRAY • REPEAT */}
        <h3
          id="intro-slogan"
          className="text-xs sm:text-sm font-extrabold tracking-widest uppercase mb-3"
          style={{ color: 'var(--accent)' }}
        >
          FOCUS • STUDY • PRAY • REPEAT
        </h3>

        {/* 3. Description: Your personal admission command center */}
        <p
          id="intro-tagline"
          className="text-sm sm:text-base font-medium max-w-sm mb-6 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          Your personal admission command center.
        </p>

        {/* 4. Subtle Loading Progress Bar */}
        <div className="w-full max-w-xs mt-2 mb-3">
          <div className="w-full h-1.5 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full transition-all duration-75 ease-out"
              style={{
                width: `${progress}%`,
                background: 'var(--accent-gradient)',
              }}
            />
          </div>
        </div>

        {/* 5. Quick Skip / Enter Button */}
        <button
          type="button"
          onClick={handleFinish}
          className="mt-2 text-xs font-semibold px-4 py-1.5 rounded-full border shadow-2xs transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 opacity-90 hover:opacity-100"
          style={{
            backgroundColor: 'var(--bg-card-subtle)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
          }}
        >
          <span>Enter Command Center</span>
          <span className="opacity-60 text-[10px]">({secondsRemaining}s)</span>
        </button>

        {/* 6. Bottom Branding: Developed by Tahsan Sharif + AI & Socials */}
        <div
          id="intro-developer-credits"
          className="mt-6 pt-4 border-t w-full flex flex-col items-center justify-center gap-2 text-[11px] font-mono tracking-wide"
          style={{
            borderColor: 'var(--border-color)',
            color: 'var(--text-muted)',
          }}
        >
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Developed by Tahsan Sharif + AI</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/___t_a_h_s_a_n__/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-pink-500 hover:underline font-bold"
              title="Instagram @___t_a_h_s_a_n__"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@___t_a_h_s_a_n__</span>
            </a>
            <span className="opacity-30">•</span>
            <a
              href="https://www.youtube.com/@tahsansharif17"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-red-500 hover:underline font-bold"
              title="YouTube @tahsansharif17"
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>@tahsansharif17</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
