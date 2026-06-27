import { createHash } from "crypto";

function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i += 1) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function next() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

function mulberry32(seed: number) {
  return function random() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateServerSeed() {
  return crypto.randomUUID();
}

export function getSeedHash(seed: string) {
  return createHash("sha256").update(seed).digest("hex");
}

export function createSeededRandom(serverSeed: string, handNonce: number) {
  const seedFn = xmur3(`${serverSeed}:${handNonce}`);
  const seed = seedFn();
  return mulberry32(seed);
}
