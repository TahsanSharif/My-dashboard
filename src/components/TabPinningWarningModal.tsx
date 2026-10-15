import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface TabPinningWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TabPinningWarningModal: React.FC<TabPinningWarningModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      // Small timeout to allow DOM mounting before trigger transition
      const enterTimer = setTimeout(() => {
        setIsAnimatingIn(true);
      }, 20);
      return () => clearTimeout(enterTimer);
    } else {
      setIsAnimatingIn(false);
      const exitTimer = setTimeout(() => {
        setIsRendered(false);
      }, 250);
      return () => clearTimeout(exitTimer);
    }
  }, [isOpen]);

  // Handle ESC key to dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isRendered) return null;

  return (
    <div
      id="tab-pinning-warning-overlay"
      className={`fixed inset-0 z-[99990] flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ease-out ${
        isAnimatingIn ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        // Semi-transparent backdrop with strong blur to de-emphasize dashboard
        backgroundColor: 'rgba(5, 10, 20, 0.45)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pin-warning-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Ambient Theme-Colored Glow Aura behind the modal */}
      <div
        className="absolute w-[320px] sm:w-[460px] h-[320px] sm:h-[460px] rounded-full blur-3xl opacity-35 pointer-events-none transition-all duration-500"
        style={{
          background: 'var(--accent-gradient)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Glassmorphic Modal Card */}
      <div
        id="tab-pinning-warning-card"
        className={`relative max-w-md w-full rounded-3xl border p-6 sm:p-8 flex flex-col text-left backdrop-blur-2xl transition-all duration-300 ease-out shadow-2xl ${
          isAnimatingIn ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-2 opacity-0'
        }`}
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35), 0 0 30px var(--glow-color)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ✕ Close Button in Top-Right Corner */}
        <button
          type="button"
          id="close-pin-warning-btn"
          onClick={onClose}
          aria-label="Close warning"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full border shadow-2xs transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer z-10"
          style={{
            backgroundColor: 'var(--bg-card-subtle)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
          title="Close (Esc)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header: ⚠️ QUICK TIP */}
        <div className="flex items-center justify-center gap-2.5 mb-3.5 pt-2">
          <span className="text-2xl leading-none select-none">⚠️</span>
          <h2
            id="pin-warning-modal-title"
            className="text-lg sm:text-xl font-black tracking-wider uppercase"
            style={{ color: 'var(--text-primary)' }}
          >
            QUICK TIP
          </h2>
        </div>

        {/* Modal Content: Pin this tab 📌 ... */}
        <p
          className="text-sm sm:text-base font-semibold leading-relaxed text-center px-1 sm:px-3 mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Pin this tab 📌 to keep your dashboard easily accessible and reduce the chance of accidentally closing it.
        </p>
      </div>
    </div>
  );
};
