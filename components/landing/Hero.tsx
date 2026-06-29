"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

function AnimatedChips() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {[
        { top: "12%", left: "8%", delay: "0s", size: "w-2 h-2" },
        { top: "25%", left: "92%", delay: "1.2s", size: "w-1.5 h-1.5" },
        { top: "65%", left: "5%", delay: "0.6s", size: "w-2 h-2" },
        { top: "80%", left: "88%", delay: "1.8s", size: "w-1.5 h-1.5" },
        { top: "45%", left: "96%", delay: "0.3s", size: "w-1 h-1" },
        { top: "15%", left: "50%", delay: "2.1s", size: "w-1 h-1" },
      ].map((chip, i) => (
        <div
          key={i}
          className={`absolute ${chip.size} rounded-full bg-amber-400/20 animate-pulse`}
          style={{ top: chip.top, left: chip.left, animationDelay: chip.delay, animationDuration: "3s" }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const particles: Array<{ x: number; y: number; vx: number; vy: number; alpha: number; size: number }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        alpha: Math.random() * 0.4 + 0.05,
        size: Math.random() * 1.5 + 0.5,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
        if (p.x < -5 || p.x > canvas.width + 5) { p.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 168, 76, ${p.alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#071a0f]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />
      {/* keep subtle animated chips background but not the right-side SVG */}
      <AnimatedChips />

      <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-8 py-16 md:px-12 md:py-20">
        {/* Left: copy */}
        <div className="flex flex-col items-start">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/8 px-3 py-1 font-mono text-xs tracking-[0.18em] text-amber-300/80 uppercase">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Texas Hold&apos;em · Well-trained Opponents
          </span>

          <h1
            className="text-[2.9rem] font-bold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-[3.6rem]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Play the Player.
            <br />
            <span className="text-amber-300">Not the Cards.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#9fb8a0] md:text-lg">
            A skill-first poker platform built around reads, psychology, and opponent archetypes. No luck. No real money. Just your edge.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/game"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-amber-400 px-7 py-3.5 font-semibold text-black transition-all duration-200 hover:bg-amber-300 hover:shadow-[0_0_28px_rgba(201,168,76,0.35)] active:scale-95"
            >
              <span>Deal Me In</span>
              <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <a
              href="#how-to-play"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-7 py-3.5 text-sm text-white/60 transition-all duration-200 hover:border-white/25 hover:text-white/90"
            >
              How it works
            </a>
          </div>

          <div className="mt-8 flex items-center gap-6 border-t border-white/8 pt-6">
            {[
              { value: "4", label: "AI archetypes" },
              { value: "$250K", label: "Top prize pool" },
              { value: "∞", label: "Hands to play" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="font-mono text-lg font-bold text-amber-300">{value}</div>
                <div className="text-xs text-[#6b8a6e]">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: replaced SVG with user-provided image (public/images/delaer.png) */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-xl relative rounded-3xl overflow-hidden border border-white/10 bg-black/5 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/landing_2.png"
                alt="Dealer illustration"
                fill
                priority
                style={{ objectFit: "contain", backgroundColor: "transparent" }}
                sizes="(max-width: 640px) 100vw, 720px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}