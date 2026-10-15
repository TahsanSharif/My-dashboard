import React, { useEffect, useRef } from 'react';

interface SolarpunkParticle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  baseAlpha: number;
  hue: number; // 40-55 for solar gold, 140-165 for botanical emerald
  pulseSpeed: number;
  pulsePhase: number;
  size: number;
}

export const SolarpunkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle count scaled to screen size
    const particleCount = Math.min(Math.floor((width * height) / 22000), 55);
    const particles: SolarpunkParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const isSolar = Math.random() > 0.45;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1.2,
        vx: (Math.random() - 0.45) * 0.35,
        vy: -(Math.random() * 0.45 + 0.15), // gently ascending solar motes
        alpha: Math.random() * 0.5 + 0.2,
        baseAlpha: Math.random() * 0.4 + 0.2,
        hue: isSolar ? Math.floor(Math.random() * 18 + 42) : Math.floor(Math.random() * 25 + 145), // Gold or Emerald
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
        size: Math.random() * 2 + 1,
      });
    }

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // 1. Soft atmospheric aero-sunlight radial glow in top right
      const sunGradient = ctx.createRadialGradient(
        width * 0.85,
        height * 0.1,
        10,
        width * 0.85,
        height * 0.1,
        Math.max(width, height) * 0.65
      );
      sunGradient.addColorStop(0, 'rgba(245, 158, 11, 0.08)');
      sunGradient.addColorStop(0.35, 'rgba(16, 185, 129, 0.04)');
      sunGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = sunGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle aero streamlines / atmospheric solar breeze waves
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.035)';
      ctx.lineWidth = 1.5;
      for (let wave = 0; wave < 3; wave++) {
        const yOffset = height * (0.25 + wave * 0.3);
        ctx.beginPath();
        for (let x = 0; x < width; x += 30) {
          const y =
            yOffset +
            Math.sin(x * 0.0025 + time * 0.008 + wave * 2) * 28 +
            Math.cos(x * 0.001 - time * 0.005) * 14;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // 3. Render luminous solar and botanical particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx + Math.sin(time * 0.01 + p.pulsePhase) * 0.2;
          p.y += p.vy;

          // Wrap edges
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
        }

        const currentAlpha = p.baseAlpha * (0.7 + 0.3 * Math.sin(time * p.pulseSpeed + p.pulsePhase));

        // Draw particle glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
        glow.addColorStop(0, `hsla(${p.hue}, 85%, 65%, ${currentAlpha * 0.8})`);
        glow.addColorStop(0.5, `hsla(${p.hue}, 80%, 60%, ${currentAlpha * 0.3})`);
        glow.addColorStop(1, `hsla(${p.hue}, 80%, 50%, 0)`);

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core bright center
        ctx.fillStyle = `hsla(${p.hue}, 95%, 85%, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="solarpunk-ambient-canvas"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none transition-opacity duration-700 ease-in-out"
      style={{
        zIndex: 0,
        opacity: 0.95,
      }}
    />
  );
};
