"use client";

import { usePathname } from "next/navigation";
import { whatsappLink } from "@/data/business";
import { Icon } from "./ui";

export function WhatsAppFloat() {
  const pathname = usePathname();
  if (pathname.startsWith("/play")) return null;
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Rajgharana Mega Mart on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-[#25D366] py-3 pl-3 pr-3 text-white shadow-[0_14px_40px_-10px_rgba(37,211,102,0.7)] transition hover:pr-5 sm:bottom-6 sm:right-6"
    >
      <span className="absolute inset-0 -z-10 rounded-full bg-[#25D366] animate-pulse-ring" aria-hidden="true" />
      <Icon.WhatsApp className="h-7 w-7" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-300 group-hover:max-w-xs">
        Chat on WhatsApp
      </span>
    </a>
  );
}
