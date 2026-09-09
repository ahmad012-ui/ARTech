import { motion } from "framer-motion";
import type { ChatMessage as Message } from "./ChatbotContext";

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={
          isUser
            ? "max-w-[85%] rounded-2xl rounded-br-md bg-secondary px-4 py-2.5 text-sm leading-relaxed text-secondary-foreground"
            : "max-w-[92%] text-sm leading-relaxed whitespace-pre-wrap text-foreground/90"
        }
      >
        {message.content}
      </div>
    </motion.div>
  );
}
