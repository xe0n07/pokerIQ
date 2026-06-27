let audioCtx: AudioContext | null = null;
let muted = false;

// Audio elements for file-based sounds
const audioElements: Record<string, HTMLAudioElement> = {};

function getCtx() {
  if (typeof window === "undefined") {
    return null;
  }
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    void audioCtx.resume();
  }
  return audioCtx;
}

function sfx(freq: number, type: OscillatorType, vol: number, dur: number, t = 0) {
  if (muted) return;
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ctx.currentTime + t);
  gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + t);
  osc.stop(ctx.currentTime + t + dur + 0.05);
}

function playFile(key: string, volume = 1) {
  if (muted) return;
  const audio = audioElements[key];
  if (!audio) return;
  audio.volume = volume;
  audio.currentTime = 0;
  audio.play().catch(() => {}); // Ignore autoplay errors
}

function registerSound(key: string, src: string) {
  if (typeof window === "undefined") return;
  if (audioElements[key]) return;
  const audio = new Audio(src);
  audio.preload = "auto";
  audioElements[key] = audio;
}

export const CasinoSfx = {
  // Call this once on app init with your .wav file paths
  registerSounds(sounds: { win?: string; fold?: string; raise?: string; check?: string; chips?: string; card?: string }) {
    if (sounds.win) registerSound("win", sounds.win);
    if (sounds.fold) registerSound("fold", sounds.fold);
    if (sounds.raise) registerSound("raise", sounds.raise);
    if (sounds.check) registerSound("check", sounds.check);
    if (sounds.chips) registerSound("chips", sounds.chips);
    if (sounds.card) registerSound("card", sounds.card);
  },

  playWin() {
    playFile("win", 0.6);
    // Fallback to synthesized if no file registered
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
      [0, 0.04, 0.08].forEach((delay, index) => sfx(1100 + index * 200, "sine", 0.025, 0.04, delay));
    }
  },

  playCard() {
    playFile("card", 0.3);
    if (!audioElements.card) {
      sfx(320, "triangle", 0.06, 0.07);
      sfx(240, "sine", 0.03, 0.05, 0.04);
    }
  },

  setMuted(nextMuted: boolean) {
    muted = nextMuted;
  },
};