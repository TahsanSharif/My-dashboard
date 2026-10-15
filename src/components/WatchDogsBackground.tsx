import React, { useEffect, useRef } from 'react';

interface WatchDogsBackgroundProps {
  opacity?: number;
}

interface SurveillanceNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  id: string;
  type: 'cctv' | 'cell' | 'traffic' | 'server';
  signal: number;
  pulsePhase: number;
  isAlert?: boolean;
}

export const WatchDogsBackground: React.FC<WatchDogsBackgroundProps> = ({ opacity = 0.25 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let lastTime = 0;
    const fpsInterval = 1000 / 30; // 30 FPS target for efficiency

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Node generator
    let nodes: SurveillanceNode[] = [];
    const types: ('cctv' | 'cell' | 'traffic' | 'server')[] = ['cctv', 'cell', 'traffic', 'server'];

    const initNodes = () => {
      nodes = [];
      const count = Math.min(24, Math.max(10, Math.floor((width * height) / 60000)));
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          id: `0x${Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0')}`,
          type: types[i % types.length],
          signal: 0.4 + Math.random() * 0.6,
          pulsePhase: Math.random() * Math.PI * 2,
          isAlert: i === 0 || i === 5,
        });
      }
    };

    initNodes();

    const drawGrid = (context: CanvasRenderingContext2D) => {
      const step = 64;
      context.lineWidth = 1;
      context.strokeStyle = 'rgba(0, 240, 255, 0.035)';

      // Draw faint grid lines
      context.beginPath();
      for (let x = 0; x <= width; x += step) {
        context.moveTo(x, 0);
        context.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += step) {
        context.moveTo(0, y);
        context.lineTo(width, y);
      }
      context.stroke();

      // Draw crosshairs at select intersections
      context.strokeStyle = 'rgba(0, 240, 255, 0.12)';
      const crossSize = 4;
      for (let x = step * 2; x < width; x += step * 3) {
        for (let y = step * 2; y < height; y += step * 3) {
          context.beginPath();
          context.moveTo(x - crossSize, y);
          context.lineTo(x + crossSize, y);
          context.moveTo(x, y - crossSize);
          context.lineTo(x, y + crossSize);
          context.stroke();
        }
      }
    };

    const drawNode = (
      context: CanvasRenderingContext2D,
      node: SurveillanceNode,
      time: number
    ) => {
      const pulse = Math.sin(time * 0.003 + node.pulsePhase) * 0.3 + 0.7;
      const color = node.isAlert ? '#FF6B35' : '#00F0FF';
      const glow = node.isAlert
        ? 'rgba(255, 107, 53, 0.45)'
        : 'rgba(0, 240, 255, 0.45)';

      // Reticle / target brackets
      const r = 9;
      context.strokeStyle = color;
      context.lineWidth = 1.2;

      // Draw 4 corners
      const corner = 3;
      context.beginPath();
      // Top-Left
      context.moveTo(node.x - r, node.y - r + corner);
      context.lineTo(node.x - r, node.y - r);
      context.lineTo(node.x - r + corner, node.y - r);
      // Top-Right
      context.moveTo(node.x + r - corner, node.y - r);
      context.lineTo(node.x + r, node.y - r);
      context.lineTo(node.x + r, node.y - r + corner);
      // Bottom-Left
      context.moveTo(node.x - r, node.y + r - corner);
      context.lineTo(node.x - r, node.y + r);
      context.lineTo(node.x - r + corner, node.y + r);
      // Bottom-Right
      context.moveTo(node.x + r - corner, node.y + r);
      context.lineTo(node.x + r, node.y + r);
      context.lineTo(node.x + r, node.y + r - corner);
      context.stroke();

      // Center dot
      context.fillStyle = color;
      context.beginPath();
      context.arc(node.x, node.y, 1.8 * pulse, 0, Math.PI * 2);
      context.fill();

      // Telemetry micro-text
      context.font = '8px monospace';
      context.fillStyle = node.isAlert ? 'rgba(255, 107, 53, 0.85)' : 'rgba(0, 240, 255, 0.75)';
      context.fillText(
        `[${node.type.toUpperCase()}//${node.id}]`,
        node.x + r + 3,
        node.y - 2
      );
    };

    const drawTelemetryOverlay = (context: CanvasRenderingContext2D) => {
      context.font = '9px monospace';
      context.fillStyle = 'rgba(0, 240, 255, 0.45)';
      context.fillText('ctOS v2.6 // URBAN_GRID_FEED', 18, 24);
      context.fillText('SYS_LOC: CHI_DISTRICT // PROFILER: ACTIVE', 18, 38);

      context.textAlign = 'right';
      context.fillStyle = 'rgba(255, 107, 53, 0.55)';
      context.fillText('DEDSEC//SIGNAL_SCAN // ONLINE', width - 18, 24);
      context.fillText('ENCRYPT: SHA-512_SECURE', width - 18, 38);
      context.textAlign = 'left';
    };

    const render = (time: number) => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const elapsed = time - lastTime;
      if (elapsed < fpsInterval) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      lastTime = time - (elapsed % fpsInterval);

      ctx.clearRect(0, 0, width, height);

      drawGrid(ctx);
      drawTelemetryOverlay(ctx);

      // Draw connections between nearby nodes
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.25;
            ctx.strokeStyle = nodes[i].isAlert || nodes[j].isAlert
              ? `rgba(255, 107, 53, ${alpha * 0.9})`
              : `rgba(0, 240, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Update & draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!prefersReducedMotion) {
          n.x += n.vx;
          n.y += n.vy;

          if (n.x < 20 || n.x > width - 20) n.vx *= -1;
          if (n.y < 20 || n.y > height - 20) n.vy *= -1;
        }

        drawNode(ctx, n, time);
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    if (prefersReducedMotion) {
      render(0);
    } else {
      animationFrameId = requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        opacity,
        background: 'transparent',
      }}
      aria-hidden="true"
    />
  );
};
