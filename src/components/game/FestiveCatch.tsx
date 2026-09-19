"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { LogoEmblem } from "@/components/Logo";
import { Icon } from "@/components/ui";
import { FestiveCatchGame, type GameSnapshot } from "@/lib/game/engine";
import { bestScore, loadName, loadScores, renameScore, saveName, saveScore, type ScoreEntry } from "@/lib/game/scores";
import { cn } from "@/lib/utils";

type RemoteScore = { id: number; playerName: string; score: number; maxCombo: number; createdAt: string };

const EMPTY: GameSnapshot = {
  status: "idle",
  score: 0,
  best: 0,
  combo: 0,
  maxCombo: 0,
  lives: 3,
  level: 1,
  elapsed: 0,
  caught: 0,
  muted: false,
  round: 0,
};

const MUTE_KEY = "rmm-festive-catch-muted";

function ScoreTable({
  title,
  rows,
  highlightId,
  emptyText,
  compact = false,
}: {
  title: string;
  rows: { id: string | number; name: string; score: number; combo: number }[];
  highlightId?: string | number | null;
  emptyText: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-3 sm:p-4">
      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-gold-300">
        <Icon.Trophy className="h-3.5 w-3.5" /> {title}
      </p>
      {rows.length === 0 ? (
        <p className="mt-3 text-xs text-cream-200/60">{emptyText}</p>
      ) : (
        <ol className="mt-2 divide-y divide-white/5 text-sm">
          {rows.slice(0, compact ? 5 : 10).map((r, i) => (
            <li
              key={r.id}
              className={cn(
                "flex items-center gap-3 py-1.5",
                highlightId !== undefined && highlightId !== null && r.id === highlightId ? "text-gold-200" : "text-cream-100",
              )}
            >
              <span className={cn("w-5 text-xs font-bold", i === 0 ? "text-gold-300" : "text-cream-200/50")}>{i + 1}</span>
              <span className="min-w-0 flex-1 truncate font-medium">{r.name}</span>
              <span className="text-[10px] uppercase tracking-wider text-cream-200/50">×{r.combo}</span>
              <span className="w-14 text-right font-bold tabular-nums">{r.score}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function FestiveCatch() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<FestiveCatchGame | null>(null);
  const [snap, setSnap] = useState<GameSnapshot>(EMPTY);
  const [local, setLocal] = useState<ScoreEntry[]>([]);
  const [remote, setRemote] = useState<RemoteScore[]>([]);
  const [remoteStatus, setRemoteStatus] = useState<"loading" | "ok" | "unavailable">("loading");
  const [name, setName] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "done">("idle");
  const [isTouch, setIsTouch] = useState(false);
  const lastRound = useRef(0);

  /* boot engine */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setLocal(loadScores());
    setName(loadName());
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    const muted = window.localStorage.getItem(MUTE_KEY) === "1";
    const game = new FestiveCatchGame(canvas, { onChange: setSnap, best: bestScore(), muted });
    gameRef.current = game;
    return () => {
      game.destroy();
      gameRef.current = null;
    };
  }, []);

  /* remote leaderboard */
  const fetchRemote = useCallback(async () => {
    try {
      const res = await fetch("/api/scores", { cache: "no-store" });
      const json = (await res.json()) as { ok: boolean; scores: RemoteScore[] };
      if (json.ok) {
        setRemote(json.scores);
        setRemoteStatus("ok");
      } else setRemoteStatus("unavailable");
    } catch {
      setRemoteStatus("unavailable");
    }
  }, []);
  useEffect(() => {
    void fetchRemote();
  }, [fetchRemote]);

  /* auto-save local score when a round ends */
  useEffect(() => {
    if (snap.status !== "over" || snap.round === lastRound.current) return;
    lastRound.current = snap.round;
    setSubmitState("idle");
    if (snap.score > 0) {
      const { list, id } = saveScore({ name: name.trim() || "Guest", score: snap.score, maxCombo: snap.maxCombo });
      setLocal(list);
      setSavedId(id);
    } else {
      setSavedId(null);
    }
  }, [snap.status, snap.round, snap.score, snap.maxCombo, name]);

  const submitScore = async () => {
    if (submitState !== "idle" || snap.score <= 0) return;
    const finalName = name.trim() || "Guest";
    saveName(finalName);
    if (savedId) setLocal(renameScore(savedId, finalName));
    setSubmitState("sending");
    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: finalName, score: snap.score, maxCombo: snap.maxCombo }),
      });
      const json = (await res.json()) as { ok: boolean; scores?: RemoteScore[] };
      if (json.ok && json.scores) {
        setRemote(json.scores);
        setRemoteStatus("ok");
      }
    } catch {
      /* leaderboard offline — local save already done */
    }
    setSubmitState("done");
  };

  const toggleMute = () => {
    const game = gameRef.current;
    if (!game) return;
    const next = !game.muted;
    game.setMuted(next);
    window.localStorage.setItem(MUTE_KEY, next ? "1" : "0");
  };

  const isNewBest = snap.status === "over" && snap.score > 0 && local[0]?.id === savedId;
  const localRows = local.map((e) => ({ id: e.id, name: e.name, score: e.score, combo: e.maxCombo }));
  const remoteRows = remote.map((e) => ({ id: e.id, name: e.playerName, score: e.score, combo: e.maxCombo }));

  return (
    <div
      className="relative w-full select-none overflow-hidden rounded-[1.75rem] bg-maroon-950 shadow-card ring-1 ring-gold-400/30"
      style={{ height: "clamp(440px, calc(100dvh - var(--header-h) - 112px), 760px)", minHeight: 440 }}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full touch-none"
        aria-label="Festive Catch game canvas"
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* HUD buttons */}
      {(snap.status === "running" || snap.status === "paused") && (
        <div className="absolute right-3 top-3 flex gap-2">
          <button
            type="button"
            onClick={toggleMute}
            className="grid h-10 w-10 place-items-center rounded-full bg-black/45 text-cream-50 transition hover:bg-black/60"
            aria-label={snap.muted ? "Unmute sound" : "Mute sound"}
          >
            {snap.muted ? <span className="text-sm font-bold">🔇</span> : <span className="text-sm font-bold">🔊</span>}
          </button>
          <button
            type="button"
            onClick={() => gameRef.current?.togglePause()}
            className="grid h-10 w-10 place-items-center rounded-full bg-gold-400 text-maroon-950 shadow-soft transition hover:bg-gold-300"
            aria-label={snap.status === "paused" ? "Resume game" : "Pause game"}
          >
            {snap.status === "paused" ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* START SCREEN */}
      {snap.status === "idle" && (
        <div className="absolute inset-0 flex flex-col items-center overflow-y-auto bg-gradient-to-b from-maroon-950/80 via-maroon-950/88 to-maroon-950/97 px-4 py-6 text-center text-cream-50 sm:px-8">
          <div className="animate-pop my-auto w-full max-w-2xl">
            <LogoEmblem className="mx-auto h-16 w-16 drop-shadow-lg sm:h-20 sm:w-20" />
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.35em] text-gold-300">Rajgharana presents</p>
            <h2 className="mt-1 font-display text-4xl font-bold sm:text-5xl">
              Festive <span className="gold-text">Catch</span>
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-cream-200/85 sm:text-base">
              Catch the falling fashion in your Rajgharana bag. Chain catches for combos, grab gold coins, and dodge the fake deals!
            </p>

            <div className="mx-auto mt-5 grid max-w-lg grid-cols-3 gap-2 text-left text-xs sm:text-sm">
              {[
                ["👗🥻👔", "Catch items", "+20 to +60 pts each"],
                ["🪙👑", "Gold & crowns", "Big bonus / extra life"],
                ["💣", "Fake deals", "Avoid! −1 life"],
              ].map(([emoji, title, desc]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-black/25 p-3">
                  <p className="text-lg leading-none">{emoji}</p>
                  <p className="mt-2 font-bold text-cream-50">{title}</p>
                  <p className="text-[11px] text-cream-200/70">{desc}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => gameRef.current?.start()}
              autoFocus
              className="group mt-6 inline-flex h-14 items-center gap-3 rounded-full bg-gold-400 px-10 text-base font-bold uppercase tracking-wider text-maroon-950 shadow-[0_14px_40px_-10px_rgba(223,174,47,0.8)] transition hover:-translate-y-0.5 hover:bg-gold-300 active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              {isTouch ? "Tap to Play" : "Play"}
            </button>
            <p className="mt-3 text-[11px] text-cream-200/60">
              {isTouch ? "Drag anywhere to move the bag" : "← → or A / D to move · P pause · R restart · M mute · Enter to start"}
            </p>

            <div className="mt-6 grid gap-3 text-left sm:grid-cols-2">
              <ScoreTable title="Your best (this device)" rows={localRows} emptyText="No scores yet — set the first one!" compact />
              <ScoreTable
                title="Nawada leaderboard"
                rows={remoteRows}
                emptyText={remoteStatus === "loading" ? "Loading…" : remoteStatus === "unavailable" ? "Leaderboard offline right now." : "Be the first on the board!"}
                compact
              />
            </div>
          </div>
        </div>
      )}

      {/* PAUSED */}
      {snap.status === "paused" && (
        <div className="absolute inset-0 flex items-center justify-center bg-maroon-950/80 px-4 text-center text-cream-50">
          <div className="animate-pop w-full max-w-sm rounded-3xl border border-white/10 bg-black/30 p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-gold-300">Take a breath</p>
            <h2 className="mt-1 font-display text-4xl font-bold">Paused</h2>
            <p className="mt-2 text-sm text-cream-200/75">
              Score <span className="font-bold text-cream-50">{snap.score}</span> · Level {snap.level} · Lives {snap.lives}
            </p>
            <div className="mt-5 grid gap-2">
              <button type="button" onClick={() => gameRef.current?.resume()} autoFocus className="h-12 rounded-full bg-gold-400 text-sm font-bold uppercase tracking-wider text-maroon-950 transition hover:bg-gold-300">
                Resume
              </button>
              <button type="button" onClick={() => gameRef.current?.restart()} className="h-12 rounded-full border border-white/20 text-sm font-semibold text-cream-50 transition hover:bg-white/10">
                Restart
              </button>
              <button type="button" onClick={() => gameRef.current?.toMenu()} className="h-12 rounded-full text-sm font-semibold text-cream-200/70 transition hover:text-cream-50">
                Quit to menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GAME OVER */}
      {snap.status === "over" && (
        <div className="absolute inset-0 flex flex-col items-center overflow-y-auto bg-gradient-to-b from-maroon-950/85 to-maroon-950/97 px-4 py-6 text-center text-cream-50 sm:px-8">
          <div className="animate-pop my-auto w-full max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-gold-300">{isNewBest ? "New personal best!" : "Game over"}</p>
            <h2 className="mt-1 font-display text-4xl font-bold sm:text-5xl">
              {isNewBest ? (
                <>
                  Shaandaar! <span className="gold-text">{snap.score}</span>
                </>
              ) : (
                <>
                  Score <span className="gold-text">{snap.score}</span>
                </>
              )}
            </h2>
            <div className="mx-auto mt-4 grid max-w-md grid-cols-3 gap-2">
              {[
                ["Best", snap.best],
                ["Max combo", `×${snap.maxCombo}`],
                ["Caught", snap.caught],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-300">{label}</p>
                  <p className="mt-1 font-display text-2xl font-bold">{value}</p>
                </div>
              ))}
            </div>

            {snap.score > 0 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void submitScore();
                }}
                className="mx-auto mt-4 flex max-w-md gap-2"
              >
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 24))}
                  placeholder="Your name"
                  maxLength={24}
                  disabled={submitState !== "idle"}
                  className="h-12 min-w-0 flex-1 rounded-full border border-white/15 bg-black/30 px-5 text-sm text-cream-50 outline-none placeholder:text-cream-200/40 focus:border-gold-400 disabled:opacity-60"
                  aria-label="Your name for the leaderboard"
                />
                <button
                  type="submit"
                  disabled={submitState !== "idle"}
                  className="h-12 shrink-0 rounded-full border border-gold-400/60 px-5 text-xs font-bold uppercase tracking-wider text-gold-200 transition hover:bg-gold-400/15 disabled:opacity-60"
                >
                  {submitState === "done" ? "Saved ✓" : submitState === "sending" ? "Saving…" : "Save score"}
                </button>
              </form>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => gameRef.current?.restart()}
                autoFocus
                className="inline-flex h-14 items-center gap-3 rounded-full bg-gold-400 px-10 text-base font-bold uppercase tracking-wider text-maroon-950 shadow-[0_14px_40px_-10px_rgba(223,174,47,0.8)] transition hover:-translate-y-0.5 hover:bg-gold-300 active:scale-95"
              >
                Play again
              </button>
              <button type="button" onClick={() => gameRef.current?.toMenu()} className="h-12 rounded-full border border-white/20 px-6 text-sm font-semibold text-cream-50 transition hover:bg-white/10">
                Menu
              </button>
              <Link href="/shop" className="h-12 rounded-full px-4 text-sm font-semibold leading-[3rem] text-cream-200/70 hover:text-cream-50">
                Back to shop →
              </Link>
            </div>
            <p className="mt-2 text-[11px] text-cream-200/50">{isTouch ? "Tap Play again to restart instantly" : "Press Enter or Space to restart instantly"}</p>

            <div className="mt-5 grid gap-3 text-left sm:grid-cols-2">
              <ScoreTable title="Your top 10 (this device)" rows={localRows} highlightId={savedId} emptyText="No scores yet." />
              <ScoreTable
                title="Nawada leaderboard"
                rows={remoteRows}
                emptyText={remoteStatus === "unavailable" ? "Leaderboard offline right now." : "Be the first on the board!"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
