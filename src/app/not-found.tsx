import Link from "next/link";
import { LogoEmblem } from "@/components/Logo";
import { Icon } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="paisley-bg flex min-h-[60vh] items-center justify-center px-4 py-20">
      <div className="text-center">
        <LogoEmblem className="mx-auto h-24 w-24" />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">404</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-maroon-900">This page has walked off the rack</h1>
        <p className="mt-3 text-ink-500">The page you are looking for doesn&apos;t exist. Let&apos;s get you back to the collection.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex h-12 items-center gap-2 rounded-full bg-maroon-700 px-6 text-sm font-bold text-white hover:bg-maroon-800">
            Go home
          </Link>
          <Link href="/shop" className="inline-flex h-12 items-center gap-2 rounded-full border-2 border-gold-500 px-6 text-sm font-bold text-maroon-800 hover:bg-gold-100">
            Shop now <Icon.ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
