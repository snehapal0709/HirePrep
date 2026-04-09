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
    const PARTICLE_COUNT = 80;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.4 + 0.05,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.01 + 0.005,
      gold: Math.random() > 0.75, // 25% are gold
    }));

    /* ── Orbs ── */
    const orbs = [
      { x: W * 0.15, y: H * 0.25, r: 300, vx: 0.08, vy: 0.05, color: 'rgba(200,151,58,0.04)' },
      { x: W * 0.8,  y: H * 0.6,  r: 250, vx: -0.06, vy: -0.04, color: 'rgba(120,80,200,0.03)' },
      { x: W * 0.5,  y: H * 0.85, r: 200, vx: 0.05, vy: -0.07, color: 'rgba(80,160,200,0.025)' },
    ];

    /* ── Grid lines ── */
    let gridOffset = 0;

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.008;
      gridOffset = (gridOffset + 0.15) % 60;

      /* moving grid */
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.018)';
      ctx.lineWidth = 0.5;
      const spacing = 60;
      for (let x = -spacing + (gridOffset % spacing); x < W + spacing; x += spacing) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = -spacing + (gridOffset % spacing); y < H + spacing; y += spacing) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      ctx.restore();

      /* floating orbs */
      orbs.forEach(o => {
        o.x += o.vx;
        o.y += o.vy;
        if (o.x < -o.r || o.x > W + o.r) o.vx *= -1;
        if (o.y < -o.r || o.y > H + o.r) o.vy *= -1;

        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        grad.addColorStop(0, o.color);
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
        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

        if (p.gold) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = `rgba(200,151,58,${a * 0.8})`;
          ctx.fillStyle = `rgba(200,151,58,${a})`;
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = `rgba(255,255,255,${a})`;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      /* draw faint connection lines between nearby gold particles */
      const goldParticles = particles.filter(p => p.gold);
      for (let i = 0; i < goldParticles.length; i++) {
        for (let j = i + 1; j < goldParticles.length; j++) {
          const dx = goldParticles[i].x - goldParticles[j].x;
          const dy = goldParticles[i].y - goldParticles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(200,151,58,${0.06 * (1 - dist / 180)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(goldParticles[i].x, goldParticles[i].y);
            ctx.lineTo(goldParticles[j].x, goldParticles[j].y);
            ctx.stroke();
          }
        }
      }

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
      style={{ opacity: 1 }}
    />
  );
}
