import Image from "next/image";
import Link from "next/link";
import { BUSINESS } from "@/data/business";
import { LogoEmblem } from "./Logo";
import { Icon, SectionHeading } from "./ui";
import { Reveal } from "./Reveal";

export function AboutSection({ full = false }: { full?: boolean }) {
  return (
    <section id="about" className="relative overflow-hidden py-16 sm:py-24">
      <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative mx-auto max-w-lg lg:max-w-none">
            <div className="absolute -left-4 -top-4 h-full w-full rounded-[2rem] border border-gold-300" aria-hidden="true" />
            <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] shadow-card ring-1 ring-gold-200">
              <Image
                src="/images/store-family.jpg"
                alt="Families shopping for clothing together"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 right-4 flex items-center gap-3 rounded-2xl border border-gold-200 bg-white px-4 py-3 shadow-card sm:right-8">
              <LogoEmblem className="h-12 w-12" />
              <div>
                <p className="font-display text-base font-semibold text-maroon-900">{BUSINESS.shortName}</p>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gold-600">Ram Nagar · Main Road, Nawada</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <SectionHeading
            align="left"
            eyebrow="About us"
            title={
              <>
                A family shopping destination <span className="gold-text">in the heart of Nawada</span>
              </>
            }
          />
          <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-500">
            <p>
              <strong className="font-semibold text-maroon-900">{BUSINESS.name}</strong> is a family shopping destination offering
              fashion and clothing collections for every member of the family. Under one roof you will find bridal and festive
              lehengas, elegant gowns, sarees for every occasion, women&apos;s fashion, men&apos;s wear, kids wear, ethnic
              ensembles and the accessories that complete a look.
            </p>
            <p>
              With stores at <strong className="font-medium text-ink-900">Ram Nagar, Nawada</strong> and{" "}
              <strong className="font-medium text-ink-900">Main Road, Nawada</strong>, we make it easy for families to shop
              together — whether it is a wedding trousseau, festival shopping or everyday style.
            </p>
            {full && (
              <p>
                The store is managed by <strong className="font-medium text-ink-900">{BUSINESS.managedBy}</strong>. Walk in,
                call us on {BUSINESS.phone} or message us on WhatsApp — our team is happy to help you find the right outfit,
                fabric and fit.
              </p>
            )}
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              "Lehenga, gown & saree collections",
              "Women's, men's & kids fashion",
              "Ethnic wear & accessories",
              "Festival & new-arrival edits",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 rounded-2xl border border-gold-200 bg-white px-4 py-3 text-sm font-medium text-ink-900">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-maroon-700 text-white">
                  <Icon.Check className="h-4 w-4" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          {!full && (
            <Link
              href="/about"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full border-2 border-maroon-700 px-6 text-sm font-bold uppercase tracking-wider text-maroon-800 transition hover:bg-maroon-700 hover:text-white"
            >
              Our Story <Icon.ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
}
