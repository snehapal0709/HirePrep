'use client';

import { useEffect, useRef } from 'react';

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let W = window.innerWidth;
    let H = window.innerHeight;

    canvas.width = W;
    canvas.height = H;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener('resize', resize);

    /* ── Particles ── */
    const PARTICLE_COUNT = 60;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      alpha: Math.random() * 0.35 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.012 + 0.006,
      gold: Math.random() > 0.7,
    }));

    /* ── Orbs (more visible) ── */
    const orbs = [
      { x: W * 0.15, y: H * 0.2,  r: 380, vx: 0.06, vy: 0.04, color: 'rgba(200,151,58,0.08)' },
      { x: W * 0.82, y: H * 0.65, r: 300, vx: -0.05, vy: -0.035, color: 'rgba(140,90,220,0.06)' },
      { x: W * 0.5,  y: H * 0.88, r: 260, vx: 0.04, vy: -0.06, color: 'rgba(60,140,220,0.05)' },
      { x: W * 0.7,  y: H * 0.15, r: 220, vx: -0.04, vy: 0.05,  color: 'rgba(200,151,58,0.05)' },
    ];

    /* ── Shooting stars ── */
    interface Star { x: number; y: number; len: number; speed: number; alpha: number; active: boolean; timer: number }
    const MAX_STARS = 3;
    const stars: Star[] = Array.from({ length: MAX_STARS }, () => ({
      x: 0, y: 0, len: 0, speed: 0, alpha: 0, active: false, timer: 0,
    }));

    const spawnStar = (s: Star) => {
      s.x = Math.random() * W;
      s.y = Math.random() * H * 0.5;
      s.len = Math.random() * 120 + 60;
      s.speed = Math.random() * 4 + 3;
      s.alpha = 0.6;
      s.active = true;
      s.timer = 0;
    };

    // stagger initial spawn times
    stars.forEach((s, i) => { s.timer = -(i * 90); });

    /* ── Grid ── */
    let gridOffset = 0;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.008;
      gridOffset = (gridOffset + 0.12) % 80;

      /* subtle dot grid */
      ctx.save();
      const spacing = 80;
      for (let x = 0; x < W; x += spacing) {
        for (let y = 0; y < H; y += spacing) {
          const ox = x + ((gridOffset / 80) * spacing);
          const oy = y + ((gridOffset / 80) * spacing);
          ctx.beginPath();
          ctx.arc(ox % W, oy % H, 0.8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.07)';
          ctx.fill();
        }
      }
      ctx.restore();

      /* floating orbs */
      orbs.forEach(o => {
        o.x += o.vx;
        o.y += o.vy;
        if (o.x < -o.r) o.x = W + o.r;
        if (o.x > W + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = H + o.r;
        if (o.y > H + o.r) o.y = -o.r;

        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        grad.addColorStop(0, o.color);
        grad.addColorStop(0.5, o.color.replace(/[\d.]+\)$/, '0.02)'));
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      /* particles */
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        p.pulse += p.pulseSpeed;
        const a = p.alpha * (0.55 + 0.45 * Math.sin(p.pulse));

        if (p.gold) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgba(200,151,58,${a})`;
          ctx.fillStyle = `rgba(210,165,70,${a})`;
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = `rgba(255,255,255,${a})`;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      /* connection lines between nearby gold particles */
      const goldP = particles.filter(p => p.gold);
      for (let i = 0; i < goldP.length; i++) {
        for (let j = i + 1; j < goldP.length; j++) {
          const dx = goldP[i].x - goldP[j].x;
          const dy = goldP[i].y - goldP[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(200,151,58,${0.1 * (1 - dist / 160)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(goldP[i].x, goldP[i].y);
            ctx.lineTo(goldP[j].x, goldP[j].y);
            ctx.stroke();
          }
        }
      }

      /* shooting stars */
      stars.forEach(s => {
        if (!s.active) {
          s.timer++;
          if (s.timer > 180 + Math.random() * 240) spawnStar(s);
          return;
        }
        s.x += s.speed * 1.2;
        s.y += s.speed * 0.5;
        s.alpha -= 0.012;
        s.timer++;

        if (s.alpha <= 0 || s.x > W || s.y > H) {
          s.active = false;
          s.timer = 0;
          return;
        }

        const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.len * 1.2, s.y - s.len * 0.5);
        grad.addColorStop(0, `rgba(255,240,200,${s.alpha})`);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.len * 1.2, s.y - s.len * 0.5);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // star head glow
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,240,200,${s.alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = `rgba(255,220,120,${s.alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
