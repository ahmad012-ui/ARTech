export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-1" aria-live="polite" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}
