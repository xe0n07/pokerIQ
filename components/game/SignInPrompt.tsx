// filepath: d:\pokerIQ\poker-web/components/game/SignInPrompt.tsx
"use client";

import { useState } from "react";

export function SignInPrompt({ onSignIn, onSkip }: { onSignIn: () => void; onSkip: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await onSignIn();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#08140f]/95 p-5 text-center shadow-xl">
        <div className="text-xs uppercase tracking-wide text-amber-300">Keep your progress</div>
        <h3 className="mt-2 text-xl font-semibold">Save your game & rewards</h3>
        <p className="mt-3 text-sm text-[#B8C7BB]">
          Sign in to save your hands, ranks and unlock rewards. It only takes a moment.
        </p>

        <div className="mt-5 flex gap-3">
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="flex-1 rounded-lg bg-amber-400 px-4 py-3 font-semibold text-black disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in with Google"}
          </button>
          <button
            onClick={onSkip}
            disabled={loading}
            className="rounded-lg border border-white/10 px-4 py-3 text-sm text-[#B8C7BB]"
          >
            Continue as guest
          </button>
        </div>
        <p className="mt-3 text-xs text-[#9fb29a]">We use email as your account id. No real-money transactions here.</p>
      </div>
    </div>
  );
}