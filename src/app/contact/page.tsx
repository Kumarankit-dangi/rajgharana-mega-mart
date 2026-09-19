import type { Metadata } from "next";
import { ContactSection } from "@/components/ContactSection";
import { BUSINESS } from "@/data/business";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact Rajgharana Mega Mart - Nawada. Ram Nagar, Nawada · Main Road, Nawada. Phone: ${BUSINESS.phone}. Managed by ${BUSINESS.managedBy}.`,
};

export default function ContactPage() {
  return (
    <div>
      <section className="border-b border-gold-200/60 bg-maroon-900 text-cream-50">
        <div className="container-x py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">Contact</p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">We&apos;d love to see you in store</h1>
          <p className="mt-3 max-w-xl text-cream-200/80">
            Call {BUSINESS.phone}, message us on WhatsApp or visit us at Ram Nagar or Main Road, Nawada.
          </p>
        </div>
      </section>
      <ContactSection />
    </div>
  );
}
