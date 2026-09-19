import { BUSINESS } from "@/data/business";
import { cn } from "@/lib/utils";

/**
 * Rajgharana Mega Mart crest: gold crown, red shield with "RM" monogram,
 * "राजघराना" wordmark and "मेगा मार्ट" sub-brand on a cream roundel.
 */
export function LogoEmblem({
  className,
  title = "Rajgharana Mega Mart logo",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label={title}
      className={cn("block shrink-0", className)}
    >
      <defs>
        <linearGradient id="rm-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2dd8f" />
          <stop offset="0.5" stopColor="#c9931f" />
          <stop offset="1" stopColor="#e9c65a" />
        </linearGradient>
        <linearGradient id="rm-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c1262c" />
          <stop offset="1" stopColor="#8c1620" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="97" fill="#f8f1e3" stroke="#e3c983" strokeWidth="2" />
      <circle cx="100" cy="100" r="91" fill="none" stroke="#c9931f" strokeWidth="0.8" opacity="0.55" />

      {/* Crown */}
      <path
        d="M83 47 L83 34 L92 41 L100 27 L108 41 L117 34 L117 47 Z"
        fill="url(#rm-gold)"
        stroke="#8a6a10"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <rect x="83" y="45" width="34" height="4.5" rx="1" fill="#c9931f" stroke="#8a6a10" strokeWidth="0.8" />
      <circle cx="83" cy="33.5" r="2.2" fill="#f2dd8f" stroke="#8a6a10" strokeWidth="0.8" />
      <circle cx="100" cy="26.5" r="2.4" fill="#f2dd8f" stroke="#8a6a10" strokeWidth="0.8" />
      <circle cx="117" cy="33.5" r="2.2" fill="#f2dd8f" stroke="#8a6a10" strokeWidth="0.8" />
      <circle cx="100" cy="47.2" r="1.7" fill="#b3161c" />

      {/* Shield */}
      <path
        d="M62 53 H138 V96 C138 113 121 123.5 100 131.5 C79 123.5 62 113 62 96 Z"
        fill="url(#rm-red)"
        stroke="#6f121b"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M66.5 57.5 H133.5 V95.5 C133.5 109.5 118.5 118.5 100 126 C81.5 118.5 66.5 109.5 66.5 95.5 Z"
        fill="none"
        stroke="#e9c65a"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M67 58 H100 V70 C88 76 76 82 67 92 Z" fill="#ffffff" opacity="0.06" />

      <text
        x="100"
        y="104"
        textAnchor="middle"
        fontFamily="'Playfair Display', 'Times New Roman', Georgia, serif"
        fontWeight="700"
        fontSize="40"
        letterSpacing="1.5"
        fill="#f6e7c3"
      >
        RM
      </text>

      {/* Wordmark */}
      <text
        x="100"
        y="163"
        textAnchor="middle"
        fontFamily="'Rozha One', 'Tiro Devanagari Hindi', 'Noto Sans Devanagari', 'Mangal', serif"
        fontSize="29"
        fill="#b3161c"
        stroke="#e9c65a"
        strokeWidth="0.9"
        paintOrder="stroke"
      >
        {BUSINESS.hindiName}
      </text>
      <line x1="58" y1="170" x2="142" y2="170" stroke="#c9931f" strokeWidth="0.9" />
      <text
        x="100"
        y="185"
        textAnchor="middle"
        fontFamily="'Rozha One', 'Tiro Devanagari Hindi', 'Noto Sans Devanagari', 'Mangal', serif"
        fontSize="13"
        fill="#3d2c2e"
      >
        {BUSINESS.hindiSub}
      </text>
    </svg>
  );
}

export function Logo({
  light = false,
  compact = false,
  className,
}: {
  light?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex min-w-0 items-center", compact ? "gap-2.5 sm:gap-3" : "gap-3", className)}>
      <LogoEmblem className={compact ? "h-10 w-10 sm:h-12 sm:w-12" : "h-14 w-14 md:h-16 md:w-16"} />
      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={cn(
            "whitespace-nowrap font-display font-bold tracking-tight",
            compact ? "text-[0.95rem] sm:text-lg md:text-xl" : "text-lg md:text-xl",
            light ? "text-cream-50" : "text-maroon-800",
          )}
        >
          {BUSINESS.shortName}
        </span>
        <span
          className={cn(
            "mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] md:text-[0.68rem]",
            light ? "text-gold-300" : "text-gold-600",
          )}
        >
          <span className="sm:hidden">Nawada</span>
          <span className="hidden sm:inline">Nawada · Family Shopping</span>
        </span>
      </span>
    </span>
  );
}
