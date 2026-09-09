import { motion } from "framer-motion";
import { useChatbot } from "./ChatbotContext";

export function ChatbotLauncher() {
  const { isOpen, toggle } = useChatbot();

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
      aria-expanded={isOpen}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: isOpen ? 0 : 1, y: 0, pointerEvents: isOpen ? "none" : "auto" }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="group glass fixed right-5 bottom-5 z-50 flex items-center gap-2.5 rounded-full py-3 pr-4 pl-3.5 shadow-[0_20px_60px_-25px_rgba(0,0,0,1)] transition-colors hover:bg-[var(--surface-strong)] md:right-8 md:bottom-8"
    >
      <span
        className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-60 blur-xl"
        style={{ background: "oklch(0.6 0.09 220 / 35%)" }}
      />
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M21 12a8 8 0 1 1-3.2-6.4M12 8v4l2.5 2"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-xs font-medium tracking-wide">Ask our AI assistant</span>
    </motion.button>
  );
}
