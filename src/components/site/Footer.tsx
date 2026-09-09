import { BRAND, CONTACT_EMAIL } from "@/lib/chat-content";
import { useChatbot } from "@/components/chat/ChatbotContext";

export function Footer() {
  const { open } = useChatbot();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--hairline)]">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 lg:px-10">
        <div>
          <p className="font-display text-sm font-semibold tracking-[0.18em] uppercase">{BRAND}</p>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Building digital experiences for the modern web.
          </p>
        </div>

        <nav className="flex flex-wrap items-start gap-x-10 gap-y-4 md:justify-end">
          <a
            href="https://github.com"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            LinkedIn
          </a>
          <a
            href="https://instagram.com"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Instagram
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Email
          </a>
        </nav>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-[var(--hairline)] px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <p>
          © {year} {BRAND}. All rights reserved.
        </p>
        <button
          type="button"
          onClick={open}
          className="w-fit transition-colors hover:text-foreground"
        >
          AI Assistant
        </button>
      </div>
    </footer>
  );
}
