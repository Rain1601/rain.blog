'use client';

import { useEffect, useRef } from 'react';
import styles from './page.module.css';

type Drop = { x: number; y: number; size: number; vy: number; alpha: number };

const COLOR = '217, 113, 73';      // terracotta — matches accent
const TAIL_SEGS = 6;               // vertical pixels of fading tail behind each drop

export default function PixelRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    let drops: Drop[] = [];
    let rafId = 0;

    const spawn = (forceTop: boolean): Drop => ({
      x: Math.random() * w,
      y: forceTop ? -10 - Math.random() * 40 : Math.random() * h,
      size: 2 + Math.floor(Math.random() * 3),
      vy: 0.5 + Math.random() * 1.6,
      alpha: 0.16 + Math.random() * 0.42,            // dimmer: 0.16-0.58
    });

    // Density scales with viewport area, capped 70-180
    const computeDensity = () => Math.max(70, Math.min(180, Math.floor((w * h) / 8500)));

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      drops = Array.from({ length: computeDensity() }, () => spawn(false));
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const tick = () => {
      // Hard clear — no canvas-level accumulation, each drop owns its own tail
      ctx.clearRect(0, 0, w, h);
      for (const d of drops) {
        const xi = Math.floor(d.x);
        // Per-drop fading tail: head is bright, segments above dim linearly to 0
        for (let i = 0; i < TAIL_SEGS; i++) {
          const segAlpha = d.alpha * (1 - i / TAIL_SEGS);
          if (segAlpha <= 0.02) continue;
          ctx.fillStyle = `rgba(${COLOR}, ${segAlpha})`;
          ctx.fillRect(xi, Math.floor(d.y - i * d.size), d.size, d.size);
        }
        d.y += d.vy;
        if (d.y > h + TAIL_SEGS * 4) Object.assign(d, spawn(true));
      }
      rafId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.utekiRain} aria-hidden="true" />;
}
