type SfxKey = "call" | "fold" | "raise" | "check" | "lose" | "win" | "chips" | "card";

let audioCtx: AudioContext | null = null;
let muted = false;

const audioElements: Partial<Record<SfxKey, HTMLAudioElement>> = {};

function getCtx() {
  if (typeof window === "undefined") return null;

  if (!audioCtx) {
    const ctor =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!ctor) return null;
    audioCtx = new ctor();
  }

  if (audioCtx.state === "suspended") {
    void audioCtx.resume();
  }

  return audioCtx;
}

function sfx(freq: number, type: OscillatorType, vol: number, dur: number, delay = 0) {
  if (muted) return;
  const ctx = getCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;

  const start = ctx.currentTime + delay;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(vol, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

  osc.connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + dur + 0.05);
}

const soundMap: Record<SfxKey, string> = {
  call: "/sounds/3.wav",
  fold: "/sounds/5.wav",
  raise: "/sounds/3.wav",
  check: "/sounds/3.wav",
  lose: "/sounds/5.wav",
  win: "/sounds/4.wav",
  chips: "/sounds/3.wav",
  card: "/sounds/6.wav",
};

function getAudio(key: SfxKey) {
  if (muted || typeof window === "undefined" || typeof Audio === "undefined") return null;
  if (!audioElements[key]) {
    audioElements[key] = new Audio(soundMap[key]);
    audioElements[key]!.preload = "auto";
  }
  return audioElements[key]!;
}

function playFile(key: SfxKey, volume = 0.35) {
  const audio = getAudio(key);
  if (!audio) return;
  audio.volume = volume;
  audio.currentTime = 0;
  void audio.play().catch(() => {});
}

export const CasinoSfx = {
  registerSounds(sounds: Partial<Record<SfxKey, string>>) {
    if (typeof window === "undefined") return;
    Object.entries(sounds).forEach(([key, src]) => {
      if (!src) return;
      const typedKey = key as SfxKey;
      audioElements[typedKey] = new Audio(src);
      audioElements[typedKey]!.preload = "auto";
    });
  },

  playWin() {
    playFile("win", 0.6);
    if (!audioElements.win) {
      [[261, 0], [329, 0.08], [392, 0.16], [523, 0.26]].forEach(([freq, delay]) =>
        sfx(freq, "sine", 0.05, 0.35, delay),
      );
    }
  },

  playFold() {
    playFile("fold", 0.5);
    if (!audioElements.fold) {
      sfx(160, "triangle", 0.04, 0.1);
      sfx(100, "sine", 0.02, 0.08, 0.06);
    }
  },

  playRaise() {
    playFile("raise", 0.5);
    if (!audioElements.raise) {
      sfx(800, "square", 0.03, 0.06);
      sfx(600, "square", 0.02, 0.05, 0.04);
    }
  },

  playCheck() {
    playFile("check", 0.5);
    if (!audioElements.check) {
      sfx(110, "sine", 0.06, 0.08);
    }
  },

  playChips() {
    playFile("chips", 0.4);
    if (!audioElements.chips) {
      [0, 0.04, 0.08].forEach((delay, index) =>
        sfx(1100 + index * 200, "sine", 0.025, 0.04, delay),
      );
    }
  },

  playCard() {
    playFile("card", 0.3);
    if (!audioElements.card) {
      sfx(320, "triangle", 0.06, 0.07);
      sfx(240, "sine", 0.03, 0.05, 0.04);
    }
  },

  playCall() {
    playFile("call", 0.5);
    if (!audioElements.call) {
      sfx(220, "triangle", 0.05, 0.08);
    }
  },

  playLose() {
    playFile("lose", 0.55);
    if (!audioElements.lose) {
      sfx(130, "sine", 0.05, 0.18);
      sfx(90, "triangle", 0.04, 0.12, 0.12);
    }
  },

  setMuted(nextMuted: boolean) {
    muted = nextMuted;
  },
};