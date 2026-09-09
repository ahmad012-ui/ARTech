import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { WELCOME, localReply } from "@/lib/chat-content";

export type ChatRole = "user" | "assistant";
export type ChatMessage = { id: string; role: ChatRole; content: string };

type Status = "idle" | "submitted" | "streaming" | "error";

type ChatbotValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  messages: ChatMessage[];
  status: Status;
  error: string | null;
  send: (text: string) => void;
  retry: () => void;
  clear: () => void;
};

const ChatbotContext = createContext<ChatbotValue | null>(null);

const welcomeMessage = (): ChatMessage => ({ id: "welcome", role: "assistant", content: WELCOME });
const newId = () => Math.random().toString(36).slice(2);

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage()]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const lastInput = useRef<string>("");

  const run = useCallback(async (history: ChatMessage[], text: string) => {
    setStatus("submitted");
    setError(null);

    const payload = [
      ...history.filter((m) => m.id !== "welcome"),
      { id: "pending", role: "user" as const, content: text },
    ].map((m) => ({ role: m.role, content: m.content }));


    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });

      if (!res.ok || !res.body) throw new Error(String(res.status));

      const id = newId();
      setMessages((prev) => [...prev, { id, role: "assistant", content: "" }]);
      setStatus("streaming");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content: acc } : m)));
      }
      if (!acc.trim()) throw new Error("empty");
      setStatus("idle");
    } catch {
      // Polished offline fallback: guided predefined answer + retry affordance.
      setMessages((prev) => {
        const withoutEmpty = prev.filter((m) => !(m.role === "assistant" && m.content === ""));
        return [...withoutEmpty, { id: newId(), role: "assistant", content: localReply(text) }];
      });
      setError("The AI assistant is temporarily unavailable — showing a guided answer instead.");
      setStatus("error");
    }
  }, []);

  const send = useCallback(
    (text: string) => {
      const value = text.trim();
      if (!value || status === "submitted" || status === "streaming") return;
      lastInput.current = value;
      const history = messagesRef.current;
      setMessages([...history, { id: newId(), role: "user" as ChatRole, content: value }]);
      void run(history, value);
    },
    [run, status],
  );


  const retry = useCallback(() => {
    if (!lastInput.current) return;
    setMessages((prev) => {
      const trimmed = [...prev];
      while (trimmed.length && trimmed[trimmed.length - 1]?.role === "assistant") trimmed.pop();
      void run(trimmed.slice(0, -1), lastInput.current);
      return trimmed;
    });
  }, [run]);

  const clear = useCallback(() => {
    setMessages([welcomeMessage()]);
    setStatus("idle");
    setError(null);
    lastInput.current = "";
  }, []);

  const value = useMemo<ChatbotValue>(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((v) => !v),
      messages,
      status,
      error,
      send,
      retry,
      clear,
    }),
    [isOpen, messages, status, error, send, retry, clear],
  );

  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>;
}

export function useChatbot() {
  const ctx = useContext(ChatbotContext);
  if (!ctx) throw new Error("useChatbot must be used inside ChatbotProvider");
  return ctx;
}
