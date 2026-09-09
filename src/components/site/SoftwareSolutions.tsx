import { Reveal } from "./Reveal";

const STEPS = ["Idea", "Strategy", "Design", "Engineering", "Product"];

export function SoftwareSolutions() {
  return (
    <section id="solutions" className="relative overflow-hidden py-28 md:py-40">
      <div
        className="atmos top-1/3 left-1/2 h-[420px] w-[720px] -translate-x-1/2"
        style={{ background: "oklch(0.45 0.07 225 / 30%)" }}
      />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-end gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="display-heading text-gradient text-[clamp(2rem,5.4vw,4rem)]">
              FROM PROBLEM
              <br />
              TO PRODUCTION.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-lg text-muted-foreground lg:text-lg">
              We combine engineering, design, and product thinking to turn complex requirements into
              reliable digital solutions.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <ol className="mt-20 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {STEPS.map((step, i) => (
              <li key={step} className="relative">
                <div className="glass rounded-xl px-5 py-6 transition-colors duration-500 hover:bg-[var(--surface-strong)]">
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.85_0.07_215)]" />
                    <span className="eyebrow">{`0${i + 1}`}</span>
                  </div>
                  <p className="font-display mt-6 text-lg font-medium">{step}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <span className="pointer-events-none absolute top-1/2 -right-4 hidden h-px w-4 bg-[var(--hairline)] lg:block" />
                )}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
