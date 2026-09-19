import type { ReactNode, SVGProps } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */
type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

export const Icon = {
  Search: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  Bag: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M6 8h12l1 12H5L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  ),
  Menu: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  ),
  X: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  ),
  Phone: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  ),
  WhatsApp: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.15a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.54-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  ),
  Instagram: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  Facebook: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z" />
    </svg>
  ),
  YouTube: (p: IconProps) => (
    <svg {...base(p)}>
      <rect x="2.5" y="6" width="19" height="12" rx="4" />
      <path d="m10 9.5 5 2.5-5 2.5v-5Z" fill="currentColor" stroke="none" />
    </svg>
  ),
  MapPin: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  ),
  ArrowRight: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  Star: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8L12 2.5Z" />
    </svg>
  ),
  Eye: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Plus: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Minus: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M5 12h14" />
    </svg>
  ),
  Trash: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
    </svg>
  ),
  Sparkles: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  ),
  Gamepad: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M6 9h12a4 4 0 0 1 4 4v2a3 3 0 0 1-5.4 1.8L15 15H9l-1.6 1.8A3 3 0 0 1 2 15v-2a4 4 0 0 1 4-4Z" />
      <path d="M8 11v4M6 13h4M16 12h.01M18 14h.01" />
    </svg>
  ),
  Family: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="7" cy="7" r="2.5" />
      <circle cx="17" cy="7" r="2.5" />
      <circle cx="12" cy="13" r="2" />
      <path d="M2.5 20a4.5 4.5 0 0 1 9 0M12.5 20a4.5 4.5 0 0 1 9 0M8.5 21a3.5 3.5 0 0 1 7 0" />
    </svg>
  ),
  Shirt: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="m8 3-5 3 2 4 2-1v12h10V9l2 1 2-4-5-3a4 4 0 0 1-8 0Z" />
    </svg>
  ),
  Diamond: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M7 3h10l4 6-9 12L3 9l4-6Z" />
      <path d="M3 9h18M9 3l3 6 3-6M12 9l-3 12M12 9l3 12" />
    </svg>
  ),
  Tag: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M3 12V4h8l10 10-8 8L3 12Z" />
      <circle cx="8" cy="9" r="1.5" />
    </svg>
  ),
  Shield: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Lamp: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M12 3c1.5 2 2.5 3.5 2.5 5a2.5 2.5 0 0 1-5 0c0-1.5 1-3 2.5-5Z" />
      <path d="M4 14h16l-2 5H6l-2-5ZM9 11h6" />
    </svg>
  ),
  Check: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  Clock: (p: IconProps) => (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  Trophy: (p: IconProps) => (
    <svg {...base(p)}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM8 6H5a3 3 0 0 0 3 5M16 6h3a3 3 0 0 1-3 5M12 13v4M8 21h8M9 17h6" />
    </svg>
  ),
};

/* ------------------------------------------------------------------ */
/* Section heading                                                     */
/* ------------------------------------------------------------------ */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  light?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em]",
            light ? "text-gold-300" : "text-gold-600",
          )}
        >
          <span className="h-px w-6 bg-current" />
          {eyebrow}
          {align === "center" && <span className="h-px w-6 bg-current" />}
        </p>
      )}
      <h2
        className={cn(
          "font-display text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]",
          light ? "text-cream-50" : "text-maroon-900",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", light ? "text-cream-200/85" : "text-ink-500")}>
          {description}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stars                                                               */
/* ------------------------------------------------------------------ */
export function Stars({
  rating,
  count,
  size = "sm",
  className,
}: {
  /** rating in tenths e.g. 45 => 4.5 */
  rating: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const value = rating / 10;
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className={cn("flex items-center gap-1.5", className)} aria-label={`Rated ${value.toFixed(1)} out of 5`}>
      <div className="flex items-center text-gold-500">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full;
          const isHalf = i === full && half;
          return (
            <span key={i} className={cn("relative", size === "sm" ? "h-3.5 w-3.5" : "h-4.5 w-4.5")}>
              <Icon.Star className="absolute inset-0 h-full w-full text-cream-400" />
              {(filled || isHalf) && (
                <span className="absolute inset-0 overflow-hidden" style={{ width: isHalf ? "50%" : "100%" }}>
                  <Icon.Star className={cn("h-full text-gold-500", size === "sm" ? "w-3.5" : "w-4.5")} />
                </span>
              )}
            </span>
          );
        })}
      </div>
      <span className={cn("font-semibold text-ink-700", size === "sm" ? "text-xs" : "text-sm")}>{value.toFixed(1)}</span>
      {typeof count === "number" && (
        <span className={cn("text-ink-500", size === "sm" ? "text-[11px]" : "text-xs")}>({count})</span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Badge                                                               */
/* ------------------------------------------------------------------ */
export function Badge({
  children,
  tone = "maroon",
  className,
}: {
  children: ReactNode;
  tone?: "maroon" | "gold" | "green" | "cream";
  className?: string;
}) {
  const tones = {
    maroon: "bg-maroon-700 text-white",
    gold: "bg-gold-400 text-maroon-950",
    green: "bg-emerald-600 text-white",
    cream: "bg-cream-100 text-maroon-800 border border-gold-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-sm",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
