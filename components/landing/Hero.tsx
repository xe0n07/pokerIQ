"use client";

import Link from "next/link";

export function Hero() {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#0A1000000] px-8 py-24 text-center">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-white/50">PokerIQ</p>
      <h1 className="mx-auto max-w-3xl text-4xl font-medium text-white md:text-5xl lg:text-6xl leading-tight">
        Play the Player. Not the Cards.
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-base text-white/60 md:text-lg">
        A poker platform built around reads, psychology, and skill progression.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/game"
          className="rounded-full bg-white px-7 py-3.5 font-medium text-black hover:bg-white/90 transition-colors"
        >
          Play Now — Free
        </Link>
        <a
          href="#how-to-play"
          className="rounded-full border border-white/20 px-7 py-3.5 text-white/80 hover:border-white/40 hover:text-white transition-colors"
        >
          How to Play
        </a>
      </div>
    </section>
  );
}