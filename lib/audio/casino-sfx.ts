type SfxKey = "call" | "fold" | "raise" | "check" | "lose" | "win" | "chips" | "card";

let audioCtx: AudioContext | null = null;
let muted = false;
const htmlAudioPool: Partial<Record<SfxKey, HTMLAudioElement[]>> = {};
const audioBuffers: Partial<Record<SfxKey, AudioBuffer>> = {};
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

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctor = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctor) return null;
    try {
      audioCtx = new Ctor();
    } catch {
      audioCtx = null;
    }
  }
  return audioCtx;
}

export function unlockAudioContext() {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    void ctx.resume().catch(() => {});
  }
}

/**
 * Preload sound either into AudioContext buffer (preferred) or into HTMLAudio element
 */
async function preloadSound(key: SfxKey, src: string) {
  if (typeof window === "undefined") return;
  const ctx = getCtx();
  if (ctx) {
    try {
      const res = await fetch(src, { cache: "force-cache" });
      const arrayBuffer = await res.arrayBuffer();
      const decoded = await ctx.decodeAudioData(arrayBuffer.slice(0));
      audioBuffers[key] = decoded;
      return;
    } catch (err) {
      // fallback to html audio if decode fails
      // continue to create html audio below
      // eslint-disable-next-line no-console
      console.warn("AudioContext decode failed, falling back to HTMLAudio for", key, err);
    }
  }

  // fallback: ensure at least one HTMLAudio element exists
  try {
    const a = new Audio(src);
    a.preload = "auto";
    a.crossOrigin = "anonymous";
    htmlAudioPool[key] = htmlAudioPool[key] ?? [];
    htmlAudioPool[key]!.push(a);
  } catch {
    /* ignore */
  }
}

function playWithAudioContext(key: SfxKey, volume = 0.35) {
  const ctx = getCtx();
  if (!ctx) return false;
  const buffer = audioBuffers[key];
  if (!buffer) return false;
  try {
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = volume;
    src.connect(gain).connect(ctx.destination);
    src.start();
    // cleanup handled by GC when source stops
    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("AudioContext playback failed for", key, err);
    return false;
  }
}

function playWithHtmlAudio(key: SfxKey, volume = 0.35) {
  try {
    // reuse pool if possible, but clone to allow overlapping
    const pool = htmlAudioPool[key] ?? [];
    let audioEl: HTMLAudioElement | undefined = pool.find((a) => a.paused);
    if (!audioEl) {
      // create a new element if none free
      const src = soundMap[key];
      audioEl = new Audio(src);
      audioEl.preload = "auto";
      audioEl.crossOrigin = "anonymous";
      pool.push(audioEl);
      htmlAudioPool[key] = pool;
    }
    audioEl.volume = volume;
    audioEl.currentTime = 0;
    void audioEl.play().catch(() => {});
    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("HTMLAudio playback failed for", key, err);
    return false;
  }
}

function playFile(key: SfxKey, volume = 0.35) {
  if (muted) return;
  // ensure context unlocked on gesture; caller should call unlockAudioContext on first user gesture
  unlockAudioContext();
  // prefer AudioContext buffer playback
  const played = playWithAudioContext(key, volume);
  if (!played) {
    playWithHtmlAudio(key, volume);
  }
}

// Public API
export const CasinoSfx = {
  /**
   * Replace or add sound mapping and attempt to preload immediately.
   * Accepts partial map.
   */
  async registerSounds(sounds: Partial<Record<SfxKey, string>>) {
    if (typeof window === "undefined") return;
    const entries = Object.entries(sounds) as [SfxKey, string][];
    await Promise.all(
      entries.map(async ([k, v]) => {
        if (!v) return;
        soundMap[k] = v;
        // clear any previously decoded buffer for fresh load
        delete audioBuffers[k];
        try {
          await preloadSound(k, v);
        } catch {
          /* ignore preload errors */
        }
      }),
    );
  },

  playWin() { playFile("win", 0.6); },
  playFold() { playFile("fold", 0.5); },
  playRaise() { playFile("raise", 0.5); },
  playCheck() { playFile("check", 0.45); },
  playChips() { playFile("chips", 0.35); },
  playCard() { playFile("card", 0.28); },
  playCall() { playFile("call", 0.45); },
  playLose() { playFile("lose", 0.55); },

  setMuted(nextMuted: boolean) {
    muted = nextMuted;
    // mute html audio elements if any
    Object.values(htmlAudioPool).forEach((arr) => arr.forEach((a) => { if (a) a.muted = muted; }));
  },

  unlockAudioContext,
};