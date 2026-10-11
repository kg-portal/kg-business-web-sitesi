"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { company } from "@/content/company";
import { isNavGroup, mainNavigation, type NavGroup } from "@/content/navigation";
import { cn } from "@/lib/cn";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function groupActive(pathname: string, group: NavGroup): boolean {
  return (
    group.links.some((l) => isActive(pathname, l.href)) ||
    (group.secondary?.links.some((l) => isActive(pathname, l.href)) ?? false)
  );
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menüs bei Seitenwechsel schließen (Anpassung während des Renderns statt Effekt)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenGroup(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    if (!openGroup) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const label = openGroup;
        setOpenGroup(null);
        navRef.current?.querySelector<HTMLButtonElement>(`[data-group="${label}"]`)?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenGroup(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [openGroup]);

  const solid = scrolled || mobileOpen;

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenGroup(null), 160);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
    <>
    <header
      data-solid={solid ? "true" : "false"}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
        solid
          ? "border-b border-line/80 bg-white/90 shadow-[0_8px_30px_-18px_rgb(8_26_64/0.35)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-navy-900 focus:shadow-lift"
      >
        Zum Inhalt springen
      </a>
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-4 lg:h-20">
        <Link href="/" aria-label={`${company.brandName} – zur Startseite`} className="shrink-0 rounded-lg">
          <Logo tone={solid ? "dark" : "light"} showTagline={false} />
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden lg:block" ref={navRef}>
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {mainNavigation.map((item) => {
              if (!isNavGroup(item)) {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative whitespace-nowrap rounded-lg px-2.5 py-2 text-[0.92rem] font-semibold transition-colors xl:px-3",
                        solid ? "text-navy-900 hover:bg-soft" : "text-white/90 hover:bg-white/10 hover:text-white",
                        active && (solid ? "text-electric-600" : "text-white"),
                      )}
                    >
                      {item.label}
                      {active ? (
                        <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-energy-400" aria-hidden="true" />
                      ) : null}
                    </Link>
                  </li>
                );
              }
              const open = openGroup === item.label;
              const active = groupActive(pathname, item);
              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenGroup(item.label);
                  }}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    data-group={item.label}
                    aria-expanded={open}
                    aria-controls={`nav-panel-${item.label}`}
                    onClick={() => setOpenGroup(open ? null : item.label)}
                    className={cn(
                      "relative inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 text-[0.92rem] font-semibold transition-colors xl:px-3",
                      solid ? "text-navy-900 hover:bg-soft" : "text-white/90 hover:bg-white/10 hover:text-white",
                      open && (solid ? "bg-soft" : "bg-white/10 text-white"),
                    )}
                  >
                    {item.label}
                    <ChevronDown aria-hidden="true" className={cn("size-4 transition-transform", open && "rotate-180")} />
                    {active ? (
                      <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-energy-400" aria-hidden="true" />
                    ) : null}
                  </button>
                  <div
                    id={`nav-panel-${item.label}`}
                    hidden={!open}
                    className={cn(
                      "absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3",
                      item.secondary ? "w-[42rem]" : "w-[24rem]",
                    )}
                  >
                    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
                      <div className={cn("grid", item.secondary && "grid-cols-[1.15fr_1fr]")}>
                        <ul className="p-3">
                          {item.links.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                                className="group block rounded-xl px-4 py-3 transition-colors hover:bg-soft"
                              >
                                <span className="flex items-center gap-2 font-semibold text-navy-900 group-hover:text-electric-600">
                                  {link.label}
                                  <Icon name="arrow" className="size-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                                </span>
                                {link.description ? (
                                  <span className="mt-0.5 block text-sm text-muted">{link.description}</span>
                                ) : null}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        {item.secondary ? (
                          <div className="border-l border-line bg-soft/70 p-5">
                            <p className="eyebrow mb-3">{item.secondary.title}</p>
                            <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
                              {item.secondary.links.map((link) => (
                                <li key={link.href}>
                                  <Link
                                    href={link.href}
                                    aria-current={isActive(pathname, link.href) ? "page" : undefined}
                                    className="block rounded-lg px-2 py-1.5 text-sm font-medium text-navy-900 transition-colors hover:bg-white hover:text-electric-600"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={company.phone.href}
            aria-label={`Anrufen: ${company.phone.display}`}
            className={cn(
              "hidden items-center gap-2 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-semibold transition-colors xl:inline-flex",
              solid ? "text-navy-900 hover:bg-soft" : "text-white/90 hover:bg-white/10",
            )}
          >
            <Icon name="phone" className="size-4" />
            <span className="hidden 2xl:inline">{company.phone.display}</span>
          </a>
          <ButtonLink href="/energie-check" size="sm" icon="arrow" className="hidden sm:inline-flex">
            Energie-Check
          </ButtonLink>
          <MobileMenuButton open={mobileOpen} solid={solid} onToggle={() => setMobileOpen((v) => !v)} />
        </div>
      </div>
    </header>
      {/* Außerhalb des Headers: dessen backdrop-filter wäre sonst Bezugsrahmen für position:fixed */}
      <MobileNav open={mobileOpen} pathname={pathname} onClose={() => setMobileOpen(false)} />
    </>
  );
}

function MobileMenuButton({ open, solid, onToggle }: { open: boolean; solid: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      id="mobile-menu-button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? "Menü schließen" : "Menü öffnen"}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-xl transition-colors lg:hidden",
        solid ? "bg-soft text-navy-900 hover:bg-line" : "bg-white/10 text-white hover:bg-white/20",
      )}
    >
      {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
    </button>
  );
}

function MobileNav({ open, pathname, onClose }: { open: boolean; pathname: string; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const baseId = useId();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!panelRef.current) return;
      if (e.key === "Escape") {
        onClose();
        document.getElementById("mobile-menu-button")?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      // Fokusfalle innerhalb von Panel + Toggle-Button
      const toggle = document.getElementById("mobile-menu-button");
      const focusables = [
        ...(toggle ? [toggle] : []),
        ...Array.from(panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")),
      ].filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    panelRef.current?.querySelector<HTMLElement>("a[href], button")?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleKeyDown]);

  return (
    <div
      id="mobile-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Hauptmenü"
      hidden={!open}
      className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto border-t border-line bg-white lg:hidden"
    >
      <nav aria-label="Mobile Navigation" className="container-page flex min-h-full flex-col pb-8 pt-4">
        <ul className="divide-y divide-line">
          {mainNavigation.map((item) => {
            if (!isNavGroup(item)) {
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className="flex items-center justify-between py-4 text-lg font-semibold text-navy-900 aria-[current=page]:text-electric-600"
                  >
                    {item.label}
                    <Icon name="arrow" className="size-5 text-muted" />
                  </Link>
                </li>
              );
            }
            const isOpen = expanded === item.label;
            const panelId = `${baseId}-${item.label}`;
            return (
              <li key={item.label}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setExpanded(isOpen ? null : item.label)}
                  className="flex w-full items-center justify-between py-4 text-left text-lg font-semibold text-navy-900"
                >
                  {item.label}
                  <ChevronDown aria-hidden="true" className={cn("size-5 text-muted transition-transform", isOpen && "rotate-180")} />
                </button>
                <div id={panelId} hidden={!isOpen} className="pb-4">
                  <ul className="space-y-1 rounded-2xl bg-soft p-2">
                    {item.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={onClose}
                          aria-current={isActive(pathname, link.href) ? "page" : undefined}
                          className="block rounded-xl px-3 py-2.5 font-semibold text-navy-900 hover:bg-white aria-[current=page]:text-electric-600"
                        >
                          {link.label}
                          {link.description ? <span className="block text-sm font-normal text-muted">{link.description}</span> : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {item.secondary ? (
                    <div className="mt-3 px-1">
                      <p className="eyebrow mb-2">{item.secondary.title}</p>
                      <ul className="flex flex-wrap gap-2">
                        {item.secondary.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={onClose}
                              className="inline-block rounded-full border border-line px-3 py-1.5 text-sm font-medium text-navy-900 hover:border-electric-500"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-auto space-y-3 pt-8">
          <ButtonLink href="/energie-check" size="lg" icon="arrow" className="w-full" onClick={onClose}>
            Kostenlosen Energie-Check starten
          </ButtonLink>
          <ButtonLink href={company.phone.href} variant="secondary" size="lg" iconLeft="phone" className="w-full">
            {company.phone.display}
          </ButtonLink>
        </div>
      </nav>
    </div>
  );
}
