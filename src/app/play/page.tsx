import type { Metadata } from "next";
import Link from "next/link";
import { FestiveCatch } from "@/components/game/FestiveCatch";
import { Icon } from "@/components/ui";

export const metadata: Metadata = {
  title: "Festive Catch – Play",
  description: "Play Festive Catch, the Rajgharana Mega Mart mini game. Catch falling lehengas, sarees and gold coins, build combos and set a high score.",
};

export default function PlayPage() {
  return (
    <div className="bg-maroon-950 pb-16 text-cream-50">
      <div className="container-x pt-3 sm:pt-10">
        <div className="flex items-center justify-between gap-4 sm:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gold-300 sm:text-[11px]">
              <Icon.Gamepad className="h-4 w-4" /> Rajgharana mini game
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold sm:mt-2 sm:text-5xl">
              Festive <span className="gold-text">Catch</span>
            </h1>
          </div>
          <p className="hidden max-w-md text-sm text-cream-200/70 sm:block">
            Keyboard or touch. Catch fashion, chain combos, dodge fake deals. Your best scores are saved on this device and on the Nawada leaderboard.
          </p>
        </div>

        <div className="mt-3 sm:mt-6">
          <FestiveCatch />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { title: "Controls", text: "Desktop: ← → or A / D to move, P or Esc to pause, R to restart, M to mute. Mobile: drag anywhere on the screen." },
            { title: "Scoring", text: "Every catch adds to your combo. Every 5 in a row raises the multiplier (up to ×5). Gold coins are worth 100 × multiplier." },
            { title: "Lives", text: "You start with 3 lives. Missing an item or catching a 💣 fake deal costs one. Catch a 👑 crown for an extra life (max 5)." },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-300">{c.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-cream-200/80">{c.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gold-400/30 bg-gold-400/10 px-5 py-4">
          <p className="text-sm text-cream-100">Done playing? The real festive collection is waiting in store.</p>
          <Link href="/shop" className="inline-flex h-11 items-center gap-2 rounded-full bg-gold-400 px-6 text-sm font-bold uppercase tracking-wider text-maroon-950 transition hover:bg-gold-300">
            Shop the collection <Icon.ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
