import type { Metadata } from "next";
import Link from "next/link";
import { AboutSection } from "@/components/AboutSection";
import { Highlights } from "@/components/Highlights";
import { ContactButtons } from "@/components/ContactSection";
import { LogoEmblem } from "@/components/Logo";
import { Icon } from "@/components/ui";
import { BUSINESS } from "@/data/business";

export const metadata: Metadata = {
  title: "About",
  description:
    "Rajgharana Mega Mart - Nawada is a family shopping destination offering fashion and clothing collections for every member of the family. Ram Nagar & Main Road, Nawada.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="paisley-bg border-b border-gold-200/60">
        <div className="container-x flex flex-col items-center py-14 text-center sm:py-20">
          <LogoEmblem className="h-28 w-28 drop-shadow-lg sm:h-36 sm:w-36" />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">About</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-maroon-900 sm:text-5xl">{BUSINESS.name}</h1>
          <p className="mt-3 font-display text-xl italic text-maroon-700">{BUSINESS.taglineDisplay}</p>
        </div>
      </section>
      <AboutSection full />
      <Highlights />
      <section className="py-16 sm:py-20">
        <div className="container-x">
          <div className="rounded-[2rem] border border-gold-200 bg-white p-8 shadow-soft sm:p-12">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="font-display text-3xl font-semibold text-maroon-900">Plan your visit</h2>
                <p className="mt-3 text-ink-500">
                  Find us at Ram Nagar and Main Road in Nawada. Call ahead for bridal appointments or send us a WhatsApp with what you are looking for.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-ink-700">
                  {BUSINESS.locations.map((l) => (
                    <li key={l} className="flex items-center gap-2">
                      <Icon.MapPin className="h-4 w-4 text-gold-600" /> {l}
                    </li>
                  ))}
                  <li className="flex items-center gap-2">
                    <Icon.Phone className="h-4 w-4 text-gold-600" /> {BUSINESS.phone}
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon.Shield className="h-4 w-4 text-gold-600" /> Managed by {BUSINESS.managedBy}
                  </li>
                </ul>
              </div>
              <div>
                <ContactButtons className="sm:grid-cols-1" size="lg" />
                <Link href="/shop" className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-maroon-800 hover:text-maroon-600">
                  Browse the collection <Icon.ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
