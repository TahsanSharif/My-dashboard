import React, { useEffect, useRef } from 'react';

interface StarParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  alpha: number;
  decay: number;
  color: string;
  glow: number;
  phase: number;
  floatFreq: number;
  isNumber7?: boolean;
}

export const GoatStarParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<StarParticle[]>([]);
  const animIdRef = useRef<number | null>(null);

  useEffect(() => {
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

    const spawnStarParticles = (originX?: number, originY?: number) => {
      const startX = originX !== undefined && originX > 0 && originX < width 
        ? originX 
        : width / 2;
      const startY = originY !== undefined && originY > 0 && originY < height 
        ? originY 
        : height * 0.55;

      const newParticles: StarParticle[] = [];
      const particleCount = 32;

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spread = Math.random() * 4.5 + 1.5;
        const isSevenBadge = i === 0 || i === 7; // Celebrate the #7 legacy

        newParticles.push({
          x: startX + (Math.random() - 0.5) * 40,
          y: startY + (Math.random() - 0.5) * 30,
          vx: Math.cos(angle) * spread * 0.9,
          // Upward biased velocity to float across the screen
          vy: -Math.abs(Math.sin(angle) * spread * 1.2) - (Math.random() * 2.5 + 1.2),
          size: isSevenBadge ? 16 : Math.random() * 8 + 6,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.08,
          alpha: 1,
          decay: Math.random() * 0.008 + 0.005, // floats for ~2.5 - 3.5 seconds
          color: '#D4AF37', // Official Legacy Gold
          glow: Math.random() * 12 + 8,
          phase: Math.random() * Math.PI * 2,
          floatFreq: Math.random() * 0.04 + 0.02,
          isNumber7: isSevenBadge,
        });
      }

      particlesRef.current.push(...newParticles);

      if (!animIdRef.current) {
        animate();
      }
    };

    // Helper to draw a crisp 5-pointed star
    const draw5PointStar = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number
    ) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      context.beginPath();
      context.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        context.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        context.lineTo(x, y);
        rot += step;
      }
      context.lineTo(cx, cy - outerRadius);
      context.closePath();
    };

    let time = 0;
    const animate = () => {
      time += 0.05;
      ctx.clearRect(0, 0, width, height);

      const activeParticles: StarParticle[] = [];

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];

        // Buoyant floating physics with gentle horizontal drift
        p.x += p.vx + Math.sin(time * 2 + p.phase) * 0.65;
        p.y += p.vy;
        p.vy += 0.025; // Gentle upward drag with very slight gravity
        p.vx *= 0.985;
        p.rotation += p.rotSpeed;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          activeParticles.push(p);

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = Math.max(0, p.alpha);

          // Gold Star Glow
          ctx.shadowColor = '#D4AF37';
          ctx.shadowBlur = p.glow;

          if (p.isNumber7) {
            // Special #7 Legacy Star Shield Badge
            draw5PointStar(ctx, 0, 0, 5, p.size, p.size * 0.48);
            ctx.fillStyle = '#D4AF37';
            ctx.fill();
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Render "#7" in the center
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#06152E';
            ctx.font = '900 10px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('#7', 0, 1);
          } else {
            // Pure Gold Star
            draw5PointStar(ctx, 0, 0, 5, p.size, p.size * 0.45);
            ctx.fillStyle = p.color;
            ctx.fill();

            // Subtle bright center shine
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.22, 0, Math.PI * 2);
            ctx.fillStyle = '#FFF8DB';
            ctx.fill();
          }

          ctx.restore();
        }
      }

      particlesRef.current = activeParticles;

      if (activeParticles.length > 0) {
        animIdRef.current = requestAnimationFrame(animate);
      } else {
        animIdRef.current = null;
      }
    };

    const handleMissionCompleted = (e: Event) => {
      const customEvent = e as CustomEvent<{ x?: number; y?: number }>;
      spawnStarParticles(customEvent.detail?.x, customEvent.detail?.y);
    };

    window.addEventListener('goat-mission-completed', handleMissionCompleted);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('goat-mission-completed', handleMissionCompleted);
      if (animIdRef.current) {
        cancelAnimationFrame(animIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="goat-star-particles-canvas"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-50 select-none"
    />
  );
};
