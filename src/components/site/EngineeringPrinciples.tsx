import { Reveal } from "./Reveal";

const PRINCIPLES = [
  { title: "Performance", body: "Fast experiences designed for real-world usage." },
  { title: "Scalability", body: "Architecture that can evolve as products and businesses grow." },
  {
    title: "Maintainability",
    body: "Clean, structured systems designed for long-term development.",
  },
  { title: "User Experience", body: "Technology that feels intuitive instead of complicated." },
];

export function EngineeringPrinciples() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28 md:py-40 lg:px-10">
      <Reveal>
        <h2 className="display-heading text-gradient max-w-2xl text-[clamp(2rem,5vw,3.6rem)]">
          BUILT TO WORK. BUILT TO LAST.
        </h2>
      </Reveal>

      <div className="mt-16 border-t border-[var(--hairline)]">
        {PRINCIPLES.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06}>
            <div className="group grid gap-4 border-b border-[var(--hairline)] py-8 transition-colors duration-500 hover:bg-[var(--surface)] md:grid-cols-[80px_1fr_1fr] md:items-baseline md:px-4">
              <span className="eyebrow">{`0${i + 1}`}</span>
              <h3 className="font-display text-xl font-medium tracking-tight md:text-2xl">
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
