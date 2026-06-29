"use client";

import React, { useMemo } from "react";

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
  onDealNext?: () => void;
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
  onDealNext,
}: Props) {
  const callLabel = toCall > 0 ? `Call $${toCall}` : "Check";

  const presets = useMemo(() => {
    const half = Math.max(minRaise, Math.min(maxRaise, Math.round(toCall * 0.5)));
    const oneX = Math.max(minRaise, Math.min(maxRaise, Math.round(toCall || minRaise)));
    const twoX = Math.max(minRaise, Math.min(maxRaise, Math.round((toCall || minRaise) * 2)));
    const allIn = maxRaise;
    return [
      { label: "0.5x Pot", value: half },
      { label: "1x Pot", value: oneX },
      { label: "2x Pot", value: twoX },
      { label: "All-In", value: allIn },
    ];
  }, [toCall, minRaise, maxRaise]);

  return (
    <div className="action-bar flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button
          className="btn-action btn-ghost"
          onClick={onFold}
          disabled={!canAct}
          title="Fold (F)"
        >
          Fold (F)
        </button>

        <button
          className="btn-action btn-light"
          onClick={onCallCheck}
          disabled={!canAct}
          title="Call / Check (C)"
        >
          {callLabel}
        </button>

        <div className="flex items-center gap-2">
          <button
            className="btn-action btn-warn"
            onClick={onRaise}
            disabled={!canAct || raiseTarget < minRaise}
            title="Raise (R)"
          >
            Raise to ${raiseTarget} (R)
          </button>

          {onDealNext ? (
            <button
              className="btn-action deal-button ml-2"
              onClick={onDealNext}
              title="Deal Next Hand"
            >
              Deal Next Hand
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          aria-label="raise target"
          className="accent-amber-400 w-full"
          type="range"
          min={minRaise}
          max={maxRaise}
          value={raiseTarget}
          onChange={(e) => onRaiseChange(Number(e.target.value))}
        />

        <div className="flex gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              className="preset-btn"
              onClick={() => onRaiseChange(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
