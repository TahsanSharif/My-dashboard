import React, { useEffect, useRef } from 'react';

interface MatrixDigitalRainProps {
  opacity?: number;
  speed?: number;
}

export const MatrixDigitalRain: React.FC<MatrixDigitalRainProps> = ({
  opacity = 0.22,
  speed = 33, // ms per frame (~30fps for minimal CPU usage)
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      // Draw a subtle static matrix glyph grid without animation
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.fillStyle = '#020502';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 255, 102, 0.08)';
      ctx.font = '14px monospace';
      for (let x = 0; x < canvas.width; x += 24) {
        for (let y = 0; y < canvas.height; y += 24) {
          if (Math.random() > 0.6) {
            const char = String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96));
            ctx.fillText(char, x, y);
          }
        }
      }
      return;
    }

    let animationFrameId: number;
    let lastTime = 0;

    const chars = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ0123456789ABCDEF$#@%&*+-=<>';
    const fontSize = 14;
    let columns = 0;
    let drops: number[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = [];
      for (let i = 0; i < columns; i++) {
        // Randomize initial positions so they don't all start at top
        drops[i] = Math.floor((Math.random() * -50));
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = (time: number) => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      if (time - lastTime >= speed) {
        lastTime = time;

        // Semi-transparent black wash for phosphor persistence trail
        ctx.fillStyle = 'rgba(2, 6, 3, 0.12)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          // Leading drop is bright white/pale green
          ctx.fillStyle = '#E6FFE6';
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#00FF66';
          ctx.fillText(char, x, y);

          // Trailing glyph
          ctx.fillStyle = '#00FF66';
          ctx.shadowBlur = 3;
          ctx.shadowColor = '#00CC55';
          ctx.fillText(char, x, y - fontSize);

          // Reset shadow
          ctx.shadowBlur = 0;

          // Drop movement
          if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none transition-opacity duration-700"
      style={{
        zIndex: 0,
        opacity,
      }}
      aria-hidden="true"
    />
  );
};
