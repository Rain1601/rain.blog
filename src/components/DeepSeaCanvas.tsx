'use client';

import { useEffect, useRef } from 'react';

type Mote = {
  x: number;
  y: number;
  vy: number;
  vx: number;
  a: number;
  phase: number;
  twinkleSpeed: number;
  targetY: number;
};

type Bubble = {
  x: number;
  y: number;
  vy: number;
  r: number;
  a: number;
  phase: number;
  wiggleAmp: number;
};

function makeMote(): Mote {
  return {
    x: Math.random(),
    y: 1.08,
    vy: 0.6 + Math.random() * 1.2,
    vx: (Math.random() - 0.5) * 0.18,
    a: 0.35 + Math.random() * 0.5,
    phase: Math.random() * Math.PI * 2,
    twinkleSpeed: 0.005 + Math.random() * 0.014,
    targetY: 0.04 + Math.random() * 0.55,
  };
}

function makeBubble(): Bubble {
  return {
    x: Math.random(),
    y: 1.1,
    vy: 3.5 + Math.random() * 5.5,
    r: 2 + Math.floor(Math.random() * 2),
    a: 0.5 + Math.random() * 0.45,
    phase: Math.random() * Math.PI * 2,
    wiggleAmp: 0.5 + Math.random() * 1.4,
  };
}

interface Props {
  /** CSS class for positioning + fade-in. Caller controls layout placement. */
  className?: string;
}

export default function DeepSeaCanvas({ className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    let rafId = 0;
    let t = 0;

    let motes: Mote[] = [];
    let bubbles: Bubble[] = [];

    const seed = () => {
      const moteCount = Math.max(28, Math.min(70, Math.floor((w * h) / 22000)));
      const bubbleCount = Math.max(12, Math.min(30, Math.floor((w * h) / 55000)));
      motes = Array.from({ length: moteCount }, () => {
        const m = makeMote();
        m.y = m.targetY + Math.random() * (1.08 - m.targetY);
        return m;
      });
      bubbles = Array.from({ length: bubbleCount }, () => {
        const b = makeBubble();
        b.y = Math.random() * 1.0;
        return b;
      });
    };

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      seed();
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const tick = () => {
      ctx.fillStyle = 'rgba(3, 7, 12, 0.5)';
      ctx.fillRect(0, 0, w, h);

      const grad = ctx.createLinearGradient(0, h * 0.38, 0, h);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.80)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, h * 0.38, w, h * 0.62);

      for (const m of motes) {
        const x = m.x * w;
        const y = m.y * h;
        const twinkle = 0.7 + 0.3 * Math.sin(m.phase + t * m.twinkleSpeed);
        const remaining = m.y - m.targetY;
        const approachFade = remaining < 0.12 ? Math.max(0, remaining / 0.12) : 1;
        const alpha = m.a * twinkle * approachFade;
        const xi = Math.floor(x);
        const yi = Math.floor(y);
        ctx.fillStyle = `rgba(252, 253, 255, ${alpha})`;
        ctx.fillRect(xi, yi, 1, 1);
        ctx.fillStyle = `rgba(238, 244, 250, ${alpha * 0.5})`;
        ctx.fillRect(xi - 1, yi, 1, 1);
        ctx.fillRect(xi + 1, yi, 1, 1);
        ctx.fillRect(xi, yi - 1, 1, 1);
        ctx.fillRect(xi, yi + 1, 1, 1);
        m.y -= m.vy / h;
        m.x += m.vx / w;
        if (m.y <= m.targetY) Object.assign(m, makeMote());
        if (m.x < -0.02) m.x += 1.04;
        if (m.x > 1.02) m.x -= 1.04;
      }

      for (const b of bubbles) {
        const wiggle = Math.sin(b.phase + t * 0.018) * b.wiggleAmp;
        const x = b.x * w + wiggle;
        const y = b.y * h;
        const fadeIn = b.y > 0.95 ? Math.max(0, (1.08 - b.y) / 0.13) : 1;
        const fadeOut = b.y < 0.08 ? Math.max(0, b.y / 0.08) : 1;
        const alpha = b.a * fadeIn * fadeOut;
        if (alpha > 0.02) {
          ctx.fillStyle = `rgba(200, 225, 240, ${alpha * 0.72})`;
          ctx.fillRect(Math.floor(x), Math.floor(y), b.r, b.r);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
        }
        b.y -= b.vy / h;
        if (b.y < -0.05) Object.assign(b, makeBubble());
      }

      t++;
      rafId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
