import { useEffect, useState } from "react";
import { BRAND } from "@/lib/chat-content";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-[var(--hairline)] bg-[oklch(0.145_0.004_250_/_60%)] backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-20 lg:px-10">
        <a href="#home" className="font-display text-sm font-semibold tracking-[0.18em] uppercase">
          {BRAND}
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden rounded-full border border-[var(--hairline)] bg-[var(--surface)] px-5 py-2 text-sm text-foreground backdrop-blur transition-all hover:bg-[var(--surface-strong)] sm:inline-flex"
          >
            Start a Project
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--hairline)] md:hidden"
          >
            <span className="sr-only">Menu</span>
            <div className="space-y-1.5">
              <span className="block h-px w-4 bg-foreground" />
              <span className="block h-px w-4 bg-foreground" />
            </div>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-[var(--hairline)] bg-[oklch(0.145_0.004_250_/_92%)] backdrop-blur-xl md:hidden">
          <ul className="mx-auto max-w-7xl px-6 py-4">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base text-muted-foreground hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
