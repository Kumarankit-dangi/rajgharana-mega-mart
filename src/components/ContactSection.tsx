"use client";

import { useState, type FormEvent } from "react";
import { BUSINESS, DIRECTIONS_LINK, MAP_EMBED_SRC, TEL_LINK, whatsappLink } from "@/data/business";
import { cn } from "@/lib/utils";
import { Icon, SectionHeading } from "./ui";
import { Reveal } from "./Reveal";

export function ContactButtons({ className, size = "md" }: { className?: string; size?: "md" | "lg" }) {
  const h = size === "lg" ? "h-13" : "h-12";
  return (
    <div className={cn("grid gap-3 sm:grid-cols-3", className)}>
      <a
        href={TEL_LINK}
        className={cn(h, "inline-flex items-center justify-center gap-2 rounded-full bg-maroon-700 px-5 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-maroon-800")}
      >
        <Icon.Phone className="h-4 w-4" /> Call Now
      </a>
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(h, "inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:brightness-95")}
      >
        <Icon.WhatsApp className="h-5 w-5" /> WhatsApp
      </a>
      <a
        href={DIRECTIONS_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(h, "inline-flex items-center justify-center gap-2 rounded-full border-2 border-gold-500 bg-white px-5 text-sm font-bold text-maroon-800 transition hover:-translate-y-0.5 hover:bg-gold-100")}
      >
        <Icon.MapPin className="h-4 w-4" /> Get Directions
      </a>
    </div>
  );
}

function EnquiryForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          message: data.get("message"),
        }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Could not send your message.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "sent") {
    return (
      <div className="animate-pop rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-600 text-white">
          <Icon.Check className="h-6 w-6" />
        </span>
        <p className="mt-4 font-display text-xl font-semibold text-emerald-900">Message received!</p>
        <p className="mt-1 text-sm text-emerald-800">Our team will get back to you shortly. For quick help, call {BUSINESS.phone}.</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-4 text-sm font-semibold text-emerald-800 underline">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">Your name</span>
          <input
            name="name"
            required
            minLength={2}
            maxLength={80}
            placeholder="e.g. Priya Kumari"
            className="mt-1.5 h-12 w-full rounded-2xl border border-gold-200 bg-white px-4 text-sm text-ink-900 outline-none transition focus:border-maroon-500"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">Phone / WhatsApp</span>
          <input
            name="phone"
            required
            inputMode="tel"
            pattern="[0-9+ -]{10,15}"
            placeholder="10-digit mobile number"
            className="mt-1.5 h-12 w-full rounded-2xl border border-gold-200 bg-white px-4 text-sm text-ink-900 outline-none transition focus:border-maroon-500"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">What are you looking for?</span>
        <textarea
          name="message"
          required
          minLength={5}
          maxLength={1000}
          rows={4}
          placeholder="Bridal lehenga for December wedding, kids festive wear, men's sherwani…"
          className="mt-1.5 w-full rounded-2xl border border-gold-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-maroon-500"
        />
      </label>
      {status === "error" && <p className="text-sm font-medium text-maroon-700">{error}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-maroon-700 text-sm font-bold text-white transition hover:bg-maroon-800 disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {status === "sending" ? "Sending…" : "Send Enquiry"}
        <Icon.ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

export function ContactSection({ withForm = true }: { withForm?: boolean }) {
  return (
    <section id="contact" className="paisley-bg relative py-16 sm:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Visit us"
          title="Come, shop with the whole family"
          description="Two convenient locations in Nawada. Call, WhatsApp or drop in — we'd love to help you find the perfect outfit."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <div className="h-full rounded-3xl border border-gold-200 bg-white p-6 shadow-soft sm:p-8">
              <h3 className="font-display text-2xl font-semibold text-maroon-900">{BUSINESS.name}</h3>
              <ul className="mt-6 space-y-4 text-sm text-ink-700">
                {BUSINESS.locations.map((loc) => (
                  <li key={loc} className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-100 text-maroon-700">
                      <Icon.MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-ink-900">{loc}</p>
                      <p className="text-xs text-ink-500">Store location</p>
                    </div>
                  </li>
                ))}
                <li className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-100 text-maroon-700">
                    <Icon.Phone className="h-4 w-4" />
                  </span>
                  <div>
                    <a href={TEL_LINK} className="font-semibold text-ink-900 hover:text-maroon-700">
                      Phone: {BUSINESS.phone}
                    </a>
                    <p className="text-xs text-ink-500">Call or WhatsApp</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-100 text-maroon-700">
                    <Icon.Shield className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-ink-900">Managed by {BUSINESS.managedBy}</p>
                    <p className="text-xs text-ink-500">{BUSINESS.fullAddress}</p>
                  </div>
                </li>
              </ul>
              <ContactButtons className="mt-8 sm:grid-cols-1 xl:grid-cols-3" />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="overflow-hidden rounded-3xl border border-gold-200 bg-white shadow-soft">
              <iframe
                title="Map – Rajgharana Mega Mart, Ram Nagar, Nawada"
                src={MAP_EMBED_SRC}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-72 w-full border-0 sm:h-80"
                allowFullScreen
              />
              {withForm && (
                <div className="p-6 sm:p-8">
                  <h3 className="font-display text-xl font-semibold text-maroon-900">Send an enquiry</h3>
                  <p className="mb-5 mt-1 text-sm text-ink-500">Tell us what you need and we&apos;ll get back to you.</p>
                  <EnquiryForm />
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
