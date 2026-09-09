import { SUGGESTED_PROMPTS } from "@/lib/chat-content";

export function SuggestedPrompts({
  onSelect,
  disabled,
}: {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {SUGGESTED_PROMPTS.map((p) => (
        <button
          key={p}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(p)}
          className="rounded-full border border-[var(--hairline)] bg-[var(--surface)] px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-[var(--surface-strong)] hover:text-foreground disabled:opacity-50"
        >
          {p}
        </button>
      ))}
    </div>
  );
}
