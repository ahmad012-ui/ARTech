import { CoreScene } from "@/components/three/CoreScene";
import { Reveal } from "./Reveal";

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl px-6 py-28 md:py-40 lg:px-10">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <h2 className="display-heading text-gradient text-[clamp(2rem,5vw,3.8rem)]">
            TECHNOLOGY
            <br />
            SHOULD FEEL
            <br />
            SIMPLE.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative">
            <div className="pointer-events-none absolute -top-24 -right-10 hidden h-56 w-56 opacity-70 lg:block">
              <CoreScene />
            </div>
            <p className="relative max-w-lg leading-relaxed text-muted-foreground lg:text-lg">
              We combine engineering, design, and product thinking to create useful digital
              experiences that solve real problems. From early concepts to production-ready
              software, we focus on building technology that is reliable, intuitive, and built to
              last.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
