/* ------------------------------------------------------------------ */
/*  Festive Catch — canvas game engine for Rajgharana Mega Mart        */
/* ------------------------------------------------------------------ */

export type GameStatus = "idle" | "running" | "paused" | "over";

export interface GameSnapshot {
  status: GameStatus;
  score: number;
  best: number;
  combo: number;
  maxCombo: number;
  lives: number;
  level: number;
  elapsed: number;
  caught: number;
  muted: boolean;
  /** increments every time a new round starts */
  round: number;
}

type KindType = "good" | "bad" | "coin" | "life";

interface Kind {
  id: string;
  emoji: string;
  label: string;
  points: number;
  color: string;
  weight: number;
  type: KindType;
}

interface Item {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  rotV: number;
  r: number;
  kind: Kind;
  t: number;
  ambient: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: string;
  shape: 0 | 1;
}

interface Floater {
  x: number;
  y: number;
  vy: number;
  text: string;
  color: string;
  life: number;
  max: number;
  size: number;
}

const KINDS: Kind[] = [
  { id: "lehenga", emoji: "👗", label: "Lehenga", points: 50, color: "#c1343a", weight: 14, type: "good" },
  { id: "saree", emoji: "🥻", label: "Saree", points: 40, color: "#d9488f", weight: 13, type: "good" },
  { id: "kurta", emoji: "👔", label: "Kurta", points: 30, color: "#2f6fb0", weight: 12, type: "good" },
  { id: "kids", emoji: "🧸", label: "Kids Wear", points: 30, color: "#e88a2e", weight: 10, type: "good" },
  { id: "bag", emoji: "👜", label: "Accessory", points: 20, color: "#8b5e3c", weight: 9, type: "good" },
  { id: "ring", emoji: "💍", label: "Jewellery", points: 60, color: "#7a4fb0", weight: 6, type: "good" },
  { id: "shoe", emoji: "👠", label: "Footwear", points: 25, color: "#b0284f", weight: 8, type: "good" },
  { id: "coin", emoji: "🪙", label: "Gold Coin", points: 100, color: "#dfae2f", weight: 5, type: "coin" },
  { id: "crown", emoji: "👑", label: "Extra Life", points: 0, color: "#e9c65a", weight: 1.1, type: "life" },
  { id: "bomb", emoji: "💣", label: "Fake Deal", points: 0, color: "#2b2326", weight: 6, type: "bad" },
];

const EMOJI_FONT = '"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji","Twemoji Mozilla",sans-serif';
const UI_FONT = '"DM Sans",system-ui,sans-serif';
const DISPLAY_FONT = '"Playfair Display",Georgia,serif';
const MAX_PARTICLES = 260;
const START_LIVES = 3;
const MAX_LIVES = 5;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const rand = (a: number, b: number) => a + Math.random() * (b - a);

/* ------------------------------------------------------------------ */
/*  Audio (tiny WebAudio synth)                                        */
/* ------------------------------------------------------------------ */
class GameAudio {
  private ctx: AudioContext | null = null;
  muted = false;

  unlock() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      try {
        this.ctx = new Ctor();
      } catch {
        this.ctx = null;
      }
    }
    if (this.ctx && this.ctx.state === "suspended") void this.ctx.resume();
  }

  private tone(freq: number, dur: number, type: OscillatorType = "sine", gain = 0.07, slideTo?: number, delay = 0) {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx;
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  catch(combo: number) {
    const base = 440 * Math.pow(1.0595, Math.min(combo, 24));
    this.tone(base, 0.13, "triangle", 0.06, base * 1.5);
  }
  coin() {
    this.tone(988, 0.09, "square", 0.04, 1319);
    this.tone(1319, 0.16, "square", 0.04, 1760, 0.07);
  }
  bad() {
    this.tone(180, 0.35, "sawtooth", 0.08, 55);
  }
  miss() {
    this.tone(240, 0.22, "sine", 0.06, 120);
  }
  life() {
    [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.18, "triangle", 0.06, undefined, i * 0.08));
  }
  combo() {
    [659, 784, 988].forEach((f, i) => this.tone(f, 0.12, "triangle", 0.05, undefined, i * 0.05));
  }
  start() {
    [392, 523, 659, 784].forEach((f, i) => this.tone(f, 0.16, "triangle", 0.05, undefined, i * 0.09));
  }
  over() {
    [392, 330, 262, 196].forEach((f, i) => this.tone(f, 0.3, "sine", 0.07, undefined, i * 0.16));
  }
}

/* ------------------------------------------------------------------ */
/*  Engine                                                             */
/* ------------------------------------------------------------------ */
export class FestiveCatchGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private raf = 0;
  private last = 0;
  private onChange: (s: GameSnapshot) => void;
  private audio = new GameAudio();
  private ro: ResizeObserver | null = null;
  private destroyed = false;

  status: GameStatus = "idle";
  score = 0;
  best = 0;
  combo = 0;
  maxCombo = 0;
  lives = START_LIVES;
  level = 1;
  elapsed = 0;
  caught = 0;
  round = 0;

  private items: Item[] = [];
  private particles: Particle[] = [];
  private floaters: Floater[] = [];
  private player = { x: 0, vx: 0, targetX: null as number | null, w: 100, h: 66, sx: 1, sy: 1, tilt: 0 };
  private keys = { left: false, right: false };
  private spawnTimer = 0.4;
  private shake = 0;
  private flash = 0;
  private flashColor = "#ff2d2d";
  private comboPulse = 0;
  private bgOffset = 0;
  private time = 0;
  private lifePulse = 0;
  private pattern: CanvasPattern | null = null;
  private vignette: HTMLCanvasElement | null = null;
  private grads: { bg: CanvasGradient; fever: CanvasGradient; shelf: CanvasGradient; bag: CanvasGradient } | null = null;
  private drag: { pointerId: number; startX: number; bagX: number } | null = null;
  private levelLabel = { level: 0, width: 0 };

  constructor(canvas: HTMLCanvasElement, opts: { onChange: (s: GameSnapshot) => void; best?: number; muted?: boolean }) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Canvas 2D not supported");
    this.ctx = ctx;
    this.onChange = opts.onChange;
    this.best = opts.best ?? 0;
    this.audio.muted = opts.muted ?? false;

    this.resize();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas.parentElement ?? canvas);

    canvas.addEventListener("pointerdown", this.onPointerDown);
    canvas.addEventListener("pointermove", this.onPointerMove);
    canvas.addEventListener("pointerup", this.onPointerUp);
    canvas.addEventListener("pointercancel", this.onPointerUp);
    canvas.addEventListener("contextmenu", this.onContextMenu);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    document.addEventListener("visibilitychange", this.onVisibility);

    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
    this.emit();
  }

  /* ---------------- public API ---------------- */

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    this.ro?.disconnect();
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.canvas.removeEventListener("pointermove", this.onPointerMove);
    this.canvas.removeEventListener("pointerup", this.onPointerUp);
    this.canvas.removeEventListener("pointercancel", this.onPointerUp);
    this.canvas.removeEventListener("contextmenu", this.onContextMenu);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    document.removeEventListener("visibilitychange", this.onVisibility);
  }

  start() {
    this.audio.unlock();
    this.reset();
    this.round += 1;
    this.status = "running";
    this.audio.start();
    this.float(this.w / 2, this.h * 0.4, "Catch the festive drops!", "#f2dd8f", 26);
    this.emit();
  }

  pause() {
    if (this.status !== "running") return;
    this.status = "paused";
    this.emit();
  }

  resume() {
    if (this.status !== "paused") return;
    this.audio.unlock();
    this.status = "running";
    this.last = performance.now();
    this.emit();
  }

  togglePause() {
    if (this.status === "running") this.pause();
    else if (this.status === "paused") this.resume();
  }

  restart() {
    this.start();
  }

  toMenu() {
    this.reset();
    this.status = "idle";
    this.emit();
  }

  setMuted(m: boolean) {
    this.audio.muted = m;
    this.emit();
  }

  get muted() {
    return this.audio.muted;
  }

  snapshot(): GameSnapshot {
    return {
      status: this.status,
      score: this.score,
      best: this.best,
      combo: this.combo,
      maxCombo: this.maxCombo,
      lives: this.lives,
      level: this.level,
      elapsed: this.elapsed,
      caught: this.caught,
      muted: this.audio.muted,
      round: this.round,
    };
  }

  /* ---------------- internals ---------------- */

  private emit() {
    this.onChange(this.snapshot());
  }

  private reset() {
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.lives = START_LIVES;
    this.level = 1;
    this.elapsed = 0;
    this.caught = 0;
    this.items = [];
    this.particles = [];
    this.floaters = [];
    this.spawnTimer = 0.5;
    this.shake = 0;
    this.flash = 0;
    this.keys.left = this.keys.right = false;
    this.player.x = this.w / 2;
    this.player.vx = 0;
    this.player.targetX = null;
    this.player.sx = this.player.sy = 1;
    this.drag = null;
  }

  private resize() {
    const parent = this.canvas.parentElement;
    const rect = (parent ?? this.canvas).getBoundingClientRect();
    const w = Math.max(280, Math.floor(rect.width));
    const h = Math.max(360, Math.floor(rect.height));
    // Cap the backing-store size so low-end phones keep a steady 60fps.
    const pixelBudget = 2_400_000;
    this.dpr = clamp(Math.min(2, window.devicePixelRatio || 1, Math.sqrt(pixelBudget / (w * h))), 1, 2);
    this.w = w;
    this.h = h;
    this.canvas.width = Math.floor(w * this.dpr);
    this.canvas.height = Math.floor(h * this.dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.player.w = clamp(w * 0.17, 76, 124);
    this.player.h = this.player.w * 0.66;
    this.player.x = clamp(this.player.x || w / 2, this.player.w / 2, w - this.player.w / 2);
    this.buildPattern();
    this.buildVignette();
    this.buildGradients();
  }

  private buildGradients() {
    const { ctx, h } = this;
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#3a0910");
    bg.addColorStop(1, "#6b121b");
    const fever = ctx.createLinearGradient(0, 0, 0, h);
    fever.addColorStop(0, "#5a1a10");
    fever.addColorStop(1, "#7a2a14");
    const shelfY = h - 22;
    const shelf = ctx.createLinearGradient(0, shelfY, 0, h);
    shelf.addColorStop(0, "#2a060a");
    shelf.addColorStop(1, "#160306");
    const bag = ctx.createLinearGradient(0, -this.player.h, 0, 0);
    bag.addColorStop(0, "#f2dd8f");
    bag.addColorStop(0.5, "#dfae2f");
    bag.addColorStop(1, "#b27d16");
    this.grads = { bg, fever, shelf, bag };
  }

  private buildPattern() {
    const size = 96;
    const tile = document.createElement("canvas");
    tile.width = tile.height = size;
    const c = tile.getContext("2d");
    if (!c) return;
    c.strokeStyle = "rgba(233,198,90,0.16)";
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(size / 2, 10);
    c.lineTo(size - 10, size / 2);
    c.lineTo(size / 2, size - 10);
    c.lineTo(10, size / 2);
    c.closePath();
    c.stroke();
    c.fillStyle = "rgba(233,198,90,0.22)";
    c.beginPath();
    c.arc(size / 2, size / 2, 2, 0, Math.PI * 2);
    c.fill();
    for (const [x, y] of [
      [0, 0],
      [size, 0],
      [0, size],
      [size, size],
    ]) {
      c.beginPath();
      c.arc(x, y, 1.5, 0, Math.PI * 2);
      c.fill();
    }
    this.pattern = this.ctx.createPattern(tile, "repeat");
  }

  private buildVignette() {
    const v = document.createElement("canvas");
    v.width = Math.max(1, Math.floor(this.w / 2));
    v.height = Math.max(1, Math.floor(this.h / 2));
    const c = v.getContext("2d");
    if (!c) return;
    const g = c.createRadialGradient(v.width / 2, v.height / 2, Math.min(v.width, v.height) * 0.35, v.width / 2, v.height / 2, Math.max(v.width, v.height) * 0.75);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(20,4,8,0.55)");
    c.fillStyle = g;
    c.fillRect(0, 0, v.width, v.height);
    this.vignette = v;
  }

  /* ---------------- input ---------------- */

  private onPointerDown = (e: PointerEvent) => {
    if (this.status !== "running") return;
    try {
      this.canvas.setPointerCapture(e.pointerId);
    } catch {
      /* capture not supported */
    }
    const x = this.localX(e);
    if (e.pointerType === "mouse") {
      this.player.targetX = x;
      this.drag = null;
      return;
    }
    // Touch: relative drag — the finger never has to cover the bag.
    this.drag = { pointerId: e.pointerId, startX: x, bagX: this.player.x };
    this.player.targetX = this.player.x;
  };

  private onPointerMove = (e: PointerEvent) => {
    if (this.status !== "running") return;
    const x = this.localX(e);
    if (e.pointerType === "mouse") {
      this.player.targetX = x;
      return;
    }
    if (!this.drag || this.drag.pointerId !== e.pointerId) return;
    const min = this.player.w / 2;
    const max = this.w - this.player.w / 2;
    const raw = this.drag.bagX + (x - this.drag.startX) * 1.35;
    const target = clamp(raw, min, max);
    if (target !== raw) {
      // re-anchor at the edge so reversing direction responds instantly
      this.drag.startX = x;
      this.drag.bagX = target;
    }
    this.player.targetX = target;
  };

  private onPointerUp = (e: PointerEvent) => {
    if (this.drag && this.drag.pointerId === e.pointerId) this.drag = null;
  };

  private onContextMenu = (e: Event) => e.preventDefault();

  private localX(e: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    return clamp(e.clientX - rect.left, 0, this.w);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
    switch (e.code) {
      case "ArrowLeft":
      case "KeyA":
        this.keys.left = true;
        this.player.targetX = null;
        e.preventDefault();
        break;
      case "ArrowRight":
      case "KeyD":
        this.keys.right = true;
        this.player.targetX = null;
        e.preventDefault();
        break;
      case "Space":
      case "Enter":
        e.preventDefault();
        if (this.status === "idle" || this.status === "over") this.start();
        else if (this.status === "paused") this.resume();
        break;
      case "KeyP":
      case "Escape":
        if (this.status === "running" || this.status === "paused") {
          e.preventDefault();
          this.togglePause();
        }
        break;
      case "KeyR":
        if (this.status !== "idle") {
          e.preventDefault();
          this.restart();
        }
        break;
      case "KeyM":
        this.setMuted(!this.audio.muted);
        break;
      default:
        break;
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    if (e.code === "ArrowLeft" || e.code === "KeyA") this.keys.left = false;
    if (e.code === "ArrowRight" || e.code === "KeyD") this.keys.right = false;
  };

  private onVisibility = () => {
    if (document.hidden && this.status === "running") this.pause();
  };

  /* ---------------- loop ---------------- */

  private loop = (now: number) => {
    if (this.destroyed) return;
    const dt = Math.min(0.033, Math.max(0.001, (now - this.last) / 1000));
    this.last = now;
    this.time += dt;
    if (this.status === "running") this.update(dt);
    else this.updateAmbient(dt);
    this.render();
    this.raf = requestAnimationFrame(this.loop);
  };

  private spawnInterval() {
    return Math.max(0.3, 0.95 - this.level * 0.065);
  }

  private fallSpeed() {
    return this.h * Math.min(0.78, 0.27 + this.level * 0.045);
  }

  private pickKind(): Kind {
    let total = 0;
    const weights = KINDS.map((k) => {
      const w = k.type === "bad" ? k.weight + this.level * 1.15 : k.weight;
      total += w;
      return w;
    });
    let r = Math.random() * total;
    for (let i = 0; i < KINDS.length; i++) {
      r -= weights[i];
      if (r <= 0) return KINDS[i];
    }
    return KINDS[0];
  }

  private spawn(ambient = false) {
    const r = clamp(this.w * 0.05, 20, 30);
    const kind = ambient ? KINDS[Math.floor(Math.random() * 7)] : this.pickKind();
    const speed = ambient ? this.h * 0.12 : this.fallSpeed() * rand(0.85, 1.2);
    this.items.push({
      x: rand(r + 8, this.w - r - 8),
      y: -r * 2,
      vx: rand(-this.w * 0.05, this.w * 0.05),
      vy: speed,
      rot: rand(-0.4, 0.4),
      rotV: rand(-1.4, 1.4),
      r,
      kind,
      t: rand(0, Math.PI * 2),
      ambient,
    });
  }

  private updateAmbient(dt: number) {
    this.bgOffset = (this.bgOffset + dt * 18) % 96;
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0 && this.items.length < 8) {
      this.spawn(true);
      this.spawnTimer = rand(0.8, 1.6);
    }
    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i];
      it.t += dt;
      it.y += it.vy * dt;
      it.x += Math.sin(it.t * 1.5) * 12 * dt;
      it.rot += it.rotV * 0.4 * dt;
      if (it.y - it.r > this.h) this.items.splice(i, 1);
    }
    this.updateEffects(dt);
  }

  private update(dt: number) {
    this.elapsed += dt;
    const newLevel = 1 + Math.floor(this.elapsed / 14);
    if (newLevel !== this.level) {
      this.level = newLevel;
      this.float(this.w / 2, this.h * 0.32, `Level ${this.level} — faster!`, "#f2dd8f", 24);
      this.flashColor = "#f2dd8f";
      this.flash = 0.35;
    }
    this.bgOffset = (this.bgOffset + dt * (30 + this.level * 6)) % 96;

    /* player */
    const p = this.player;
    const maxSpeed = this.w * 1.9;
    const accel = this.w * 11;
    const dir = (this.keys.right ? 1 : 0) - (this.keys.left ? 1 : 0);
    if (dir !== 0) {
      p.vx += dir * accel * dt;
      p.vx = clamp(p.vx, -maxSpeed, maxSpeed);
      p.x += p.vx * dt;
    } else if (p.targetX !== null) {
      const k = 1 - Math.exp(-22 * dt);
      const nx = p.x + (p.targetX - p.x) * k;
      p.vx = (nx - p.x) / dt;
      p.x = nx;
    } else {
      p.vx *= Math.pow(0.0004, dt);
      if (Math.abs(p.vx) < 2) p.vx = 0;
      p.x += p.vx * dt;
    }
    const minX = p.w / 2;
    const maxX = this.w - p.w / 2;
    if (p.x < minX || p.x > maxX) {
      p.x = clamp(p.x, minX, maxX);
      p.vx = 0;
    }
    p.tilt += ((clamp(p.vx / maxSpeed, -1, 1)) * 0.28 - p.tilt) * Math.min(1, 14 * dt);
    p.sx += (1 - p.sx) * Math.min(1, 11 * dt);
    p.sy += (1 - p.sy) * Math.min(1, 11 * dt);

    /* spawning */
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawn();
      if (this.level >= 4 && Math.random() < 0.3) this.spawn();
      this.spawnTimer = this.spawnInterval() * rand(0.75, 1.25);
    }

    /* items */
    const bagTop = this.bagTop();
    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i];
      it.t += dt;
      it.y += it.vy * dt;
      it.x += (it.vx + Math.sin(it.t * 2.2) * 16) * dt;
      it.rot += it.rotV * dt;
      if (it.x < it.r) {
        it.x = it.r;
        it.vx = Math.abs(it.vx);
      } else if (it.x > this.w - it.r) {
        it.x = this.w - it.r;
        it.vx = -Math.abs(it.vx);
      }

      const inBagX = Math.abs(it.x - p.x) < p.w * 0.5 + it.r * 0.25;
      const inBagY = it.y + it.r * 0.5 >= bagTop && it.y < bagTop + p.h * 0.55;
      if (inBagX && inBagY) {
        this.items.splice(i, 1);
        this.catchItem(it);
        continue;
      }
      if (it.y - it.r > this.h) {
        this.items.splice(i, 1);
        this.missItem(it);
      }
    }

    this.updateEffects(dt);
  }

  private updateEffects(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.life -= dt;
      if (pt.life <= 0) {
        this.particles[i] = this.particles[this.particles.length - 1];
        this.particles.pop();
        continue;
      }
      pt.vy += 900 * dt;
      pt.vx *= Math.pow(0.2, dt);
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
    }
    for (let i = this.floaters.length - 1; i >= 0; i--) {
      const f = this.floaters[i];
      f.life -= dt;
      f.y += f.vy * dt;
      f.vy *= Math.pow(0.3, dt);
      if (f.life <= 0) this.floaters.splice(i, 1);
    }
    this.shake = Math.max(0, this.shake - dt * 42);
    this.flash = Math.max(0, this.flash - dt * 1.8);
    this.comboPulse = Math.max(0, this.comboPulse - dt * 4);
    this.lifePulse = Math.max(0, this.lifePulse - dt * 3);
  }

  private bagTop() {
    return this.h - 26 - this.player.h;
  }

  private multiplier() {
    return Math.min(5, 1 + Math.floor(this.combo / 5));
  }

  /* ---------------- events ---------------- */

  private catchItem(it: Item) {
    const p = this.player;
    const bagTop = this.bagTop();
    p.sx = 1.28;
    p.sy = 0.78;

    switch (it.kind.type) {
      case "bad": {
        this.combo = 0;
        this.shake = 20;
        this.flashColor = "#ff2d2d";
        this.flash = 0.7;
        this.burst(it.x, bagTop, "#3a2a2e", 22, 380, 1);
        this.burst(it.x, bagTop, "#ff5a3c", 12, 300, 0);
        this.float(it.x, bagTop - 30, "Fake deal! −1 ❤", "#ff8a80", 22);
        this.audio.bad();
        this.loseLife();
        return;
      }
      case "life": {
        this.lives = Math.min(MAX_LIVES, this.lives + 1);
        this.lifePulse = 1;
        this.burst(it.x, bagTop, "#ff7aa8", 20, 320, 1);
        this.burst(it.x, bagTop, "#f2dd8f", 10, 260, 0);
        this.float(it.x, bagTop - 30, this.lives === MAX_LIVES ? "Max lives!" : "+1 ❤ Extra life!", "#ffb3c7", 24);
        this.audio.life();
        this.caught += 1;
        return;
      }
      case "coin": {
        this.combo += 1;
        this.maxCombo = Math.max(this.maxCombo, this.combo);
        const pts = it.kind.points * this.multiplier();
        this.score += pts;
        this.shake = Math.max(this.shake, 5);
        this.burst(it.x, bagTop, "#f2dd8f", 22, 420, 1);
        this.burst(it.x, bagTop, "#ffffff", 8, 260, 0);
        this.float(it.x, bagTop - 34, `+${pts} GOLD`, "#f2dd8f", 26);
        this.audio.coin();
        this.caught += 1;
        break;
      }
      default: {
        this.combo += 1;
        this.maxCombo = Math.max(this.maxCombo, this.combo);
        const pts = it.kind.points * this.multiplier();
        this.score += pts;
        this.burst(it.x, bagTop, it.kind.color, 12, 320, 0);
        this.burst(it.x, bagTop, "#f2dd8f", 5, 240, 1);
        this.float(it.x, bagTop - 26, `+${pts}`, "#fff7e0", 20);
        this.audio.catch(this.combo);
        this.caught += 1;
      }
    }

    if (this.combo > 0 && this.combo % 5 === 0) {
      this.comboPulse = 1;
      this.shake = Math.max(this.shake, 6);
      this.float(this.w / 2, this.h * 0.36, `COMBO ×${this.multiplier()}`, "#f2dd8f", 34);
      this.burst(this.w / 2, this.h * 0.4, "#f2dd8f", 26, 460, 1);
      this.audio.combo();
      if (this.combo === 10) {
        this.flashColor = "#f2dd8f";
        this.flash = 0.5;
        this.float(this.w / 2, this.h * 0.44, "RAJGHARANA FEVER!", "#fff1b8", 24);
      }
    }
    if (this.score > this.best) this.best = this.score;
  }

  private missItem(it: Item) {
    if (it.kind.type !== "good") return;
    this.combo = 0;
    this.shake = Math.max(this.shake, 10);
    this.flashColor = "#ff2d2d";
    this.flash = 0.45;
    this.float(clamp(it.x, 60, this.w - 60), this.h - 70, "Missed!", "#ff8a80", 20);
    this.burst(it.x, this.h - 10, it.kind.color, 8, 220, 0);
    this.audio.miss();
    this.loseLife();
  }

  private loseLife() {
    this.lives -= 1;
    this.lifePulse = 1;
    if (this.lives <= 0) {
      this.lives = 0;
      this.status = "over";
      this.best = Math.max(this.best, this.score);
      this.shake = 24;
      this.burst(this.player.x, this.bagTop(), "#f2dd8f", 40, 520, 1);
      this.audio.over();
      this.emit();
    }
  }

  private burst(x: number, y: number, color: string, n: number, speed: number, shape: 0 | 1) {
    for (let i = 0; i < n; i++) {
      if (this.particles.length >= MAX_PARTICLES) break;
      const a = rand(-Math.PI, 0) + rand(-0.6, 0.6);
      const s = rand(speed * 0.35, speed);
      const life = rand(0.45, 0.95);
      this.particles.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 60,
        life,
        max: life,
        size: rand(3, 7),
        color,
        shape,
      });
    }
  }

  private float(x: number, y: number, text: string, color: string, size: number) {
    this.floaters.push({ x, y, vy: -90, text, color, life: 1.05, max: 1.05, size });
  }

  /* ---------------- render ---------------- */

  private render() {
    const { ctx, w, h } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    let ox = 0;
    let oy = 0;
    if (this.shake > 0) {
      ox = (Math.random() * 2 - 1) * this.shake;
      oy = (Math.random() * 2 - 1) * this.shake;
    }

    ctx.save();
    ctx.translate(ox, oy);
    this.drawBackground();
    this.drawItems();
    if (this.status !== "idle") this.drawPlayer();
    this.drawParticles();
    ctx.restore();

    if (this.vignette) ctx.drawImage(this.vignette, 0, 0, w, h);
    if (this.flash > 0) {
      ctx.globalAlpha = Math.min(0.55, this.flash * 0.55);
      ctx.fillStyle = this.flashColor;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    }
    this.drawFloaters();
    if (this.status !== "idle") this.drawHUD();
  }

  private drawBackground() {
    const { ctx, w, h } = this;
    const fever = this.combo >= 10 && this.status === "running";
    if (!this.grads) this.buildGradients();
    const grads = this.grads!;
    ctx.fillStyle = fever ? grads.fever : grads.bg;
    ctx.fillRect(-40, -40, w + 80, h + 80);

    if (this.pattern) {
      ctx.save();
      ctx.translate(0, this.bgOffset - 96);
      ctx.fillStyle = this.pattern;
      ctx.fillRect(-40, -40, w + 80, h + 200);
      ctx.restore();
    }

    if (fever) {
      const pulse = 0.5 + Math.sin(this.time * 8) * 0.5;
      ctx.globalAlpha = 0.08 + pulse * 0.08;
      ctx.fillStyle = "#f2dd8f";
      ctx.fillRect(-40, -40, w + 80, h + 80);
      ctx.globalAlpha = 1;
    }

    /* shop counter */
    const shelfY = h - 22;
    ctx.fillStyle = grads.shelf;
    ctx.fillRect(-40, shelfY, w + 80, h - shelfY + 40);
    ctx.fillStyle = "#e9c65a";
    ctx.fillRect(-40, shelfY, w + 80, 2);
  }

  private roundRect(x: number, y: number, w: number, h: number, r: number) {
    const ctx = this.ctx;
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.lineTo(x + w - rr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
    ctx.lineTo(x + w, y + h - rr);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    ctx.lineTo(x + rr, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
    ctx.lineTo(x, y + rr);
    ctx.quadraticCurveTo(x, y, x + rr, y);
    ctx.closePath();
  }

  private drawItems() {
    const ctx = this.ctx;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const it of this.items) {
      const r = it.r;
      ctx.save();
      ctx.translate(it.x, it.y);
      if (it.kind.type === "coin" || it.kind.type === "life") {
        const pulse = 0.6 + Math.sin(it.t * 6) * 0.4;
        ctx.globalAlpha = 0.25 + pulse * 0.25;
        ctx.fillStyle = it.kind.color;
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.rotate(it.rot);
      /* shadow */
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = "#000";
      this.roundRect(-r + 4, -r * 1.05 + 6, r * 2, r * 2.15, r * 0.4);
      ctx.fill();
      ctx.globalAlpha = 1;
      /* tag body */
      ctx.fillStyle = it.kind.color;
      this.roundRect(-r, -r * 1.05, r * 2, r * 2.15, r * 0.4);
      ctx.fill();
      ctx.strokeStyle = it.kind.type === "bad" ? "rgba(255,90,60,0.7)" : "rgba(255,255,255,0.35)";
      ctx.lineWidth = 2;
      ctx.stroke();
      /* tag hole */
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.beginPath();
      ctx.arc(0, -r * 0.78, r * 0.12, 0, Math.PI * 2);
      ctx.fill();
      /* emoji */
      ctx.font = `${Math.round(r * 1.25)}px ${EMOJI_FONT}`;
      ctx.fillStyle = "#fff";
      ctx.fillText(it.kind.emoji, 0, r * 0.14);
      ctx.restore();
    }
  }

  private drawPlayer() {
    const { ctx } = this;
    const p = this.player;
    const bottom = this.h - 24;
    const w = p.w;
    const h = p.h;

    /* shadow */
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(p.x, bottom + 4, w * 0.5, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.translate(p.x, bottom);
    ctx.rotate(p.tilt);
    ctx.scale(p.sx, p.sy);

    /* handles */
    ctx.strokeStyle = "#7a1420";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(-w * 0.22, -h, w * 0.14, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w * 0.22, -h, w * 0.14, Math.PI, 0);
    ctx.stroke();

    /* body */
    if (!this.grads) this.buildGradients();
    ctx.fillStyle = this.grads!.bag;
    ctx.beginPath();
    ctx.moveTo(-w / 2, -h);
    ctx.lineTo(w / 2, -h);
    ctx.lineTo(w * 0.42, -6);
    ctx.quadraticCurveTo(w * 0.4, 0, w * 0.34, 0);
    ctx.lineTo(-w * 0.34, 0);
    ctx.quadraticCurveTo(-w * 0.4, 0, -w * 0.42, -6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#8a5a10";
    ctx.lineWidth = 2;
    ctx.stroke();

    /* maroon band with monogram */
    ctx.fillStyle = "#8c1620";
    ctx.beginPath();
    ctx.moveTo(-w * 0.47, -h * 0.64);
    ctx.lineTo(w * 0.47, -h * 0.64);
    ctx.lineTo(w * 0.45, -h * 0.36);
    ctx.lineTo(-w * 0.45, -h * 0.36);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#f6e7c3";
    ctx.font = `700 ${Math.round(h * 0.22)}px ${DISPLAY_FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("RM", 0, -h * 0.5);

    /* rim highlight */
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-w / 2 + 3, -h + 2);
    ctx.lineTo(w / 2 - 3, -h + 2);
    ctx.stroke();

    ctx.restore();
  }

  private drawParticles() {
    const ctx = this.ctx;
    for (const pt of this.particles) {
      const a = Math.max(0, pt.life / pt.max);
      ctx.globalAlpha = a;
      ctx.fillStyle = pt.color;
      if (pt.shape === 0) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size * (0.5 + a * 0.5), 0, Math.PI * 2);
        ctx.fill();
      } else {
        const s = pt.size * (0.6 + a * 0.6);
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y - s);
        ctx.lineTo(pt.x + s * 0.7, pt.y);
        ctx.lineTo(pt.x, pt.y + s);
        ctx.lineTo(pt.x - s * 0.7, pt.y);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  private drawFloaters() {
    const ctx = this.ctx;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const f of this.floaters) {
      const t = f.life / f.max;
      const a = t < 0.3 ? t / 0.3 : 1;
      const scale = 1 + (1 - Math.min(1, (f.max - f.life) / 0.15)) * 0.4;
      ctx.globalAlpha = a;
      ctx.font = `800 ${Math.round(f.size * scale)}px ${UI_FONT}`;
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(40,6,10,0.7)";
      ctx.strokeText(f.text, f.x, f.y);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.globalAlpha = 1;
  }

  private drawHeart(x: number, y: number, s: number, filled: boolean) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.35);
    ctx.bezierCurveTo(x - s * 0.5, y - s * 0.1, x - s * 0.3, y - s * 0.55, x, y - s * 0.25);
    ctx.bezierCurveTo(x + s * 0.3, y - s * 0.55, x + s * 0.5, y - s * 0.1, x, y + s * 0.35);
    ctx.closePath();
    ctx.fillStyle = filled ? "#ff4d6d" : "rgba(255,255,255,0.18)";
    ctx.fill();
    if (filled) {
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  private drawHUD() {
    const { ctx, w } = this;
    const pad = 14;

    /* score */
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.font = `700 11px ${UI_FONT}`;
    ctx.fillStyle = "#f2dd8f";
    ctx.fillText("SCORE", pad, pad + 10);
    ctx.font = `700 30px ${DISPLAY_FONT}`;
    ctx.fillStyle = "#fff8e6";
    ctx.fillText(String(this.score), pad, pad + 40);
    ctx.font = `600 11px ${UI_FONT}`;
    ctx.fillStyle = "rgba(255,248,230,0.7)";
    ctx.fillText(`BEST ${this.best}`, pad, pad + 56);

    /* lives */
    const heartSize = 18 + this.lifePulse * 5;
    for (let i = 0; i < MAX_LIVES; i++) {
      if (i >= Math.max(this.lives, START_LIVES) && i >= this.lives) continue;
      this.drawHeart(pad + 12 + i * 24, pad + 78, heartSize, i < this.lives);
    }

    /* level pill (top-right, below UI buttons) */
    const label = `LEVEL ${this.level}`;
    ctx.font = `700 11px ${UI_FONT}`;
    if (this.levelLabel.level !== this.level) {
      this.levelLabel = { level: this.level, width: ctx.measureText(label).width };
    }
    const lw = this.levelLabel.width + 20;
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    this.roundRect(w - pad - lw, pad + 50, lw, 24, 12);
    ctx.fill();
    ctx.fillStyle = "#f2dd8f";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, w - pad - lw / 2, pad + 62);

    /* combo */
    if (this.combo >= 2 && this.status === "running") {
      const scale = 1 + this.comboPulse * 0.35;
      const fever = this.combo >= 10;
      ctx.save();
      ctx.translate(w / 2, pad + 26);
      ctx.scale(scale, scale);
      const text = `COMBO ${this.combo}`;
      ctx.font = `800 14px ${UI_FONT}`;
      const tw = ctx.measureText(text).width + 60;
      ctx.fillStyle = fever ? "#f2dd8f" : "rgba(0,0,0,0.4)";
      this.roundRect(-tw / 2, -14, tw, 28, 14);
      ctx.fill();
      ctx.fillStyle = fever ? "#4f0c13" : "#fff8e6";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(text, -tw / 2 + 14, 0);
      ctx.fillStyle = fever ? "#8c1620" : "#f2dd8f";
      ctx.textAlign = "right";
      ctx.fillText(`×${this.multiplier()}`, tw / 2 - 14, 0);
      ctx.restore();
      if (fever) {
        ctx.font = `800 11px ${UI_FONT}`;
        ctx.fillStyle = "#fff1b8";
        ctx.textAlign = "center";
        ctx.fillText("RAJGHARANA FEVER", w / 2, pad + 52 + Math.sin(this.time * 10) * 2);
      }
    }
  }
}
