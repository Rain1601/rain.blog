'use client';

import { useEffect, useRef } from 'react';
import styles from './page.module.css';

type Drop = { x: number; y: number; size: number; vy: number; alpha: number };

const COLOR = '217, 113, 73';      // terracotta — matches accent
const BG_FADE = '28, 25, 23';      // matches --bg-primary in dark mode

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
      // Trail-fade balances streak length with overall dim level
      ctx.fillStyle = `rgba(${BG_FADE}, 0.18)`;
      ctx.fillRect(0, 0, w, h);
      for (const d of drops) {
        ctx.fillStyle = `rgba(${COLOR}, ${d.alpha})`;
        ctx.fillRect(Math.floor(d.x), Math.floor(d.y), d.size, d.size);
        d.y += d.vy;
        if (d.y > h + 8) Object.assign(d, spawn(true));
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
