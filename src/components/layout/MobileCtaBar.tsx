"use client";

import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { company } from "@/content/company";

/** Dauerhaft erreichbarer Angebots-Button auf Mobilgeräten. */
export function MobileCtaBar() {
  const pathname = usePathname() ?? "/";
  if (pathname.startsWith("/energie-check")) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_30px_-18px_rgb(8_26_64/0.35)] backdrop-blur-lg lg:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <ButtonLink href="/energie-check" size="md" icon="arrow" className="flex-1">
          Kostenloser Energie-Check
        </ButtonLink>
        <a
          href={company.phone.href}
          aria-label={`Anrufen: ${company.phone.display}`}
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-white text-navy-900 transition-colors hover:bg-soft"
        >
          <Icon name="phone" className="size-5" />
        </a>
      </div>
    </div>
  );
}
