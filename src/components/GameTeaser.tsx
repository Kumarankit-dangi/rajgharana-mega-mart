import Link from "next/link";
import { Icon } from "./ui";
import { Reveal } from "./Reveal";

const drops = ["👗", "🥻", "👔", "👜", "💍", "👑"];

export function GameTeaser() {
  return (
    <section className="py-8 sm:py-12">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-maroon-800 via-maroon-900 to-maroon-950 px-6 py-10 text-cream-50 shadow-card sm:px-10 lg:px-14 lg:py-14">
            <div className="dots-bg pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
            <div className="glow-gold pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-60" aria-hidden="true" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-gold-300">
                  <Icon.Gamepad className="h-4 w-4" /> Mini game
                </p>
                <h2 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                  Play <span className="gold-text">Festive Catch</span>
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-cream-200/80 sm:text-base">
                  Catch falling lehengas, sarees, kurtas and gold coins in your Rajgharana bag. Build combos, dodge the fake
                  deals and set a high score — works with keyboard or touch.
                </p>
                <Link
                  href="/play"
                  className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-gold-400 px-7 text-sm font-bold uppercase tracking-wider text-maroon-950 shadow-soft transition hover:-translate-y-0.5 hover:bg-gold-300"
                >
                  Play now <Icon.ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="flex justify-center gap-3 lg:justify-end">
                {drops.map((d, i) => (
                  <span
                    key={d}
                    className="animate-float grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/10 text-3xl will-change-transform sm:h-16 sm:w-16"
                    style={{ animationDelay: `${i * 0.4}s` }}
                    aria-hidden="true"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
