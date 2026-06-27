"use client";

import { useMemo } from "react";
import { BIG_BLIND } from "@/lib/constants/poker-rules";

type Props = {
  toCall: number;
  minRaise: number;
  maxRaise: number;
  raiseTarget: number;
  canAct: boolean;
  onFold: () => void;
  onCallCheck: () => void;
  onRaise: () => void;
  onRaiseChange: (value: number) => void;
};

export function ActionBar({
  toCall,
  minRaise,
  maxRaise,
  raiseTarget,
  canAct,
  onFold,
  onCallCheck,
  onRaise,
  onRaiseChange,
}: Props) {
  const callLabel = toCall > 0 ? `Call $${toCall}` : "Check";
  const presets = useMemo(
    () => [
      { label: "0.5x Pot", value: Math.max(minRaise, Math.floor(toCall * 1.5)) },
      { label: "1x Pot", value: Math.max(minRaise, toCall * 2 + BIG_BLIND) },
      { label: "2x Pot", value: Math.max(minRaise, toCall * 3 + BIG_BLIND) },
      { label: "All-In", value: maxRaise },
    ],
    [maxRaise, minRaise, toCall],
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <button disabled={!canAct} onClick={onFold} className="btn-action btn-danger">
          Fold (F)
        </button>
        <button disabled={!canAct} onClick={onCallCheck} className="btn-action btn-light">
          {callLabel} (C)
        </button>
        <button disabled={!canAct} onClick={onRaise} className="btn-action btn-warn">
          Raise to ${raiseTarget} (R)
        </button>
      </div>
      <div className="mt-3">
        <input
          type="range"
          min={Math.min(minRaise, maxRaise)}
          max={Math.max(minRaise, maxRaise)}
          value={Math.max(Math.min(raiseTarget, maxRaise), minRaise)}
          onChange={(event) => onRaiseChange(Number(event.target.value))}
          disabled={!canAct}
          className="w-full accent-amber-400"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              disabled={!canAct}
              onClick={() => onRaiseChange(Math.min(maxRaise, Math.max(minRaise, preset.value)))}
              className="rounded-md border border-white/10 px-2 py-1 text-xs text-white/80 hover:bg-white/10 disabled:opacity-30"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
