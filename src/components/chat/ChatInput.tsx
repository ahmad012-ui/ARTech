import { forwardRef, useState, type FormEvent, type KeyboardEvent } from "react";

type Props = { onSend: (text: string) => void; disabled?: boolean };

export const ChatInput = forwardRef<HTMLTextAreaElement, Props>(function ChatInput(
  { onSend, disabled },
  ref,
) {
  const [value, setValue] = useState("");

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form
      onSubmit={submit}
      className="flex items-end gap-2 rounded-2xl border border-[var(--hairline)] bg-[var(--surface)] p-2"
    >
      <label htmlFor="chat-input" className="sr-only">
        Message the AI assistant
      </label>
      <textarea
        id="chat-input"
        ref={ref}
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Ask about services, process, or your project…"
        className="max-h-32 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-foreground text-[#050505] transition-opacity disabled:opacity-35"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
});
