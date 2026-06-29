"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGameStore } from "@/store/game-store";

export default function ConfirmPage() {
  const router = useRouter();
  const params = useSearchParams();
  const status = params?.get("status") ?? "failed";
  const amount = Number(params?.get("amount") ?? 0);
  const [credited, setCredited] = useState(false);

  useEffect(() => {
    if (status === "success" && amount > 0 && !credited) {
      // credit virtual chips to hero after successful payment
      const state = useGameStore.getState();
      const players = state.players.map((p) => (p.id === "hero" ? { ...p, chips: p.chips + amount } : p));
      useGameStore.setState({ players });
      setCredited(true);
    }
  }, [status, amount, credited]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07120f] to-[#03110d] py-12 px-4">
      <div className="mx-auto max-w-lg rounded-2xl border border-white/8 bg-[#08140f]/95 p-6 shadow-xl text-center">
        {status === "success" ? (
          <>
            <img src="/images/confirmed.png" alt="success" className="mx-auto h-24 w-24" />
            <h1 className="mt-4 text-2xl font-semibold text-white">Purchase Complete</h1>
            <p className="mt-2 text-sm text-[#B8C7BB]">Your account has been credited with {amount.toLocaleString()} chips.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => router.push("/game")} className="flex-1 rounded-lg bg-amber-400 px-5 py-3 font-semibold text-black">
                Return to Game
              </button>
              <button onClick={() => router.push("/shop/checkout?amount=10000")} className="rounded-lg border border-white/10 px-4 py-3 text-sm text-[#B8C7BB]">
                Buy More
              </button>
            </div>
          </>
        ) : (
          <>
            <img src="/images/failed.png" alt="failed" className="mx-auto h-24 w-24" />
            <h1 className="mt-4 text-2xl font-semibold text-white">Payment Failed</h1>
            <p className="mt-2 text-sm text-[#B8C7BB]">Something went wrong. Try again or contact support.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => router.push("/shop/checkout?amount=10000")} className="flex-1 rounded-lg bg-amber-400 px-5 py-3 font-semibold text-black">
                Try Again
              </button>
              <button onClick={() => router.push("/game")} className="rounded-lg border border-white/10 px-4 py-3 text-sm text-[#B8C7BB]">
                Back to Game
              </button>
            </div>
          </>
        )}
        <p className="mt-4 text-xs text-[#9fb29a]">Chips are virtual. No real-money gambling is provided.</p>
      </div>
    </div>
  );
}