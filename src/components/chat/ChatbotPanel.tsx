import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { BRAND, CONTACT_EMAIL } from "@/lib/chat-content";
import { useChatbot } from "./ChatbotContext";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { TypingIndicator } from "./TypingIndicator";

export function ChatbotPanel() {
  const { isOpen, close, messages, status, error, send, retry, clear } = useChatbot();
  const scroller = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => input.current?.focus());
  }, [isOpen]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          role="dialog"
          aria-label={`${BRAND} AI assistant`}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="glass fixed inset-x-3 bottom-3 z-50 flex max-h-[82svh] flex-col overflow-hidden rounded-3xl shadow-[0_40px_120px_-40px_rgba(0,0,0,1)] sm:inset-x-auto sm:right-8 sm:bottom-8 sm:h-[600px] sm:max-h-[80svh] sm:w-[400px]"
          style={{ background: "oklch(0.16 0.006 250 / 82%)" }}
        >
          <header className="flex items-start justify-between gap-3 border-b border-[var(--hairline)] px-5 py-4">
            <div>
              <p className="font-display text-sm font-semibold tracking-tight">
                {BRAND} Assistant
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                AI assistant · Our team can follow up directly
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clear}
                className="rounded-full px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={close}
                aria-label="Close assistant"
                className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-[var(--surface-strong)] hover:text-foreground"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </header>

          <div ref={scroller} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            {status === "submitted" && <TypingIndicator />}

            {messages.length <= 1 && (
              <div className="pt-2">
                <SuggestedPrompts onSelect={send} disabled={busy} />
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-[var(--hairline)] bg-[var(--surface)] p-3 text-xs text-muted-foreground">
                <p>{error}</p>
                <div className="mt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={retry}
                    className="text-foreground underline underline-offset-4"
                  >
                    Try again
                  </button>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-foreground underline underline-offset-4"
                  >
                    Email the team
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 border-t border-[var(--hairline)] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <ChatInput ref={input} onSend={send} disabled={busy} />
            <div className="flex items-center justify-between px-1">
              <a
                href="#contact"
                onClick={close}
                className="text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              >
                Start a Project Conversation →
              </a>
              <span className="font-mono text-[10px] text-muted-foreground">Enter to send</span>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
