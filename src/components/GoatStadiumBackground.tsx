import React, { useEffect, useRef } from 'react';
import { GoatPreset } from '../types';

interface GoatStadiumBackgroundProps {
  preset?: GoatPreset;
}

export const GoatStadiumBackground: React.FC<GoatStadiumBackgroundProps> = ({
  preset = 'mr-champions-league',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Dynamic color tuning based on preset
    const presetPalette = {
      'mr-champions-league': {
        beamBase: 'rgba(69, 183, 255, 0.08)',
        beamGlow: 'rgba(7, 87, 200, 0.06)',
        starHue: [200, 220],
        goldAccent: 'rgba(212, 175, 55, 0.06)',
      },
      'galactico-gold': {
        beamBase: 'rgba(213, 180, 106, 0.08)',
        beamGlow: 'rgba(242, 204, 99, 0.06)',
        starHue: [44, 52],
        goldAccent: 'rgba(242, 204, 99, 0.09)',
      },
      'selecao-passion': {
        beamBase: 'rgba(200, 16, 46, 0.07)',
        beamGlow: 'rgba(0, 139, 69, 0.05)',
        starHue: [350, 145],
        goldAccent: 'rgba(255, 215, 0, 0.06)',
      },
      'red-devil': {
        beamBase: 'rgba(218, 2, 14, 0.08)',
        beamGlow: 'rgba(255, 229, 0, 0.04)',
        starHue: [0, 45],
        goldAccent: 'rgba(255, 229, 0, 0.07)',
      },
      'el-bicho': {
        beamBase: 'rgba(0, 229, 255, 0.08)',
        beamGlow: 'rgba(139, 92, 246, 0.06)',
        starHue: [180, 270],
        goldAccent: 'rgba(251, 191, 36, 0.06)',
      },
    }[preset] || {
      beamBase: 'rgba(69, 183, 255, 0.08)',
      beamGlow: 'rgba(7, 87, 200, 0.06)',
      starHue: [200, 220],
      goldAccent: 'rgba(212, 175, 55, 0.06)',
    };

    // Starlight particles
    const starCount = Math.min(Math.floor((width * height) / 20000), 45);
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.8,
      alpha: Math.random() * 0.5 + 0.2,
      baseAlpha: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      phase: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
    }));

    let time = 0;
    let animId: number;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Stadium Floodlight Beams (Top-left & Top-right sweep)
      const leftAngle = Math.sin(time * 0.6) * 0.25 + 0.45;
      const rightAngle = Math.sin(time * 0.5 + 1.5) * 0.25 + (Math.PI - 0.45);

      // Left Floodlight Cone
      ctx.save();
      const leftGrad = ctx.createRadialGradient(0, 0, 10, width * 0.6, height * 0.8, width);
      leftGrad.addColorStop(0, presetPalette.beamBase);
      leftGrad.addColorStop(0.5, presetPalette.beamGlow);
      leftGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = leftGrad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(leftAngle - 0.35) * width * 1.5, Math.sin(leftAngle - 0.35) * height * 1.5);
      ctx.lineTo(Math.cos(leftAngle + 0.35) * width * 1.5, Math.sin(leftAngle + 0.35) * height * 1.5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Right Floodlight Cone
      ctx.save();
      const rightGrad = ctx.createRadialGradient(width, 0, 10, width * 0.4, height * 0.8, width);
      rightGrad.addColorStop(0, presetPalette.beamBase);
      rightGrad.addColorStop(0.5, presetPalette.beamGlow);
      rightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = rightGrad;
      ctx.beginPath();
      ctx.moveTo(width, 0);
      ctx.lineTo(width + Math.cos(rightAngle - 0.35) * width * 1.5, Math.sin(rightAngle - 0.35) * height * 1.5);
      ctx.lineTo(width + Math.cos(rightAngle + 0.35) * width * 1.5, Math.sin(rightAngle + 0.35) * height * 1.5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 2. Center Trophy Gold Radiance
      const centerGold = ctx.createRadialGradient(
        width * 0.5,
        height * 0.25,
        20,
        width * 0.5,
        height * 0.25,
        Math.max(width, height) * 0.55
      );
      centerGold.addColorStop(0, presetPalette.goldAccent);
      centerGold.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = centerGold;
      ctx.fillRect(0, 0, width, height);

      // 3. Starlight / Starball Cyan Particles
      stars.forEach((s) => {
        if (!prefersReducedMotion) {
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < 0) s.x = width;
          if (s.x > width) s.x = 0;
          if (s.y < 0) s.y = height;
          if (s.y > height) s.y = 0;
        }

        const currentAlpha = s.baseAlpha * (0.65 + 0.35 * Math.sin(time * 2 + s.phase));
        ctx.beginPath();
        ctx.fillStyle = `rgba(215, 227, 244, ${currentAlpha})`;
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();

        // Starball Cyan halo
        ctx.beginPath();
        ctx.fillStyle = `rgba(69, 183, 255, ${currentAlpha * 0.45})`;
        ctx.arc(s.x, s.y, s.radius * 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [preset]);

  return (
    <canvas
      ref={canvasRef}
      id="goat-stadium-canvas"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none transition-opacity duration-700 ease-in-out"
      style={{
        zIndex: 0,
        opacity: 0.95,
      }}
    />
  );
};
