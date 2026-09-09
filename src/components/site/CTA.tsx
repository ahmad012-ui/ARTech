import { CoreScene } from "@/components/three/CoreScene";
import { CONTACT_EMAIL } from "@/lib/chat-content";
import { Reveal } from "./Reveal";

export function CTA() {
  return (
    <section id="contact" className="relative overflow-hidden py-32 md:py-48">
      <div className="absolute inset-0 opacity-80">
        <CoreScene variant="cta" />
      </div>
      <div
        className="atmos top-1/4 left-1/2 h-[560px] w-[860px] -translate-x-1/2"
        style={{ background: "oklch(0.42 0.07 230 / 32%)" }}
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <h2 className="display-heading text-gradient text-[clamp(2.2rem,6.5vw,4.6rem)]">
            LET'S BUILD THE FUTURE.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground md:text-lg">
            Have an idea, product, or problem worth solving? Let's turn it into something real.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Project%20inquiry`}
            className="mt-10 inline-flex rounded-full bg-foreground px-8 py-4 text-sm font-medium text-[#050505] transition-transform hover:-translate-y-0.5"
          >
            Start a Conversation
          </a>
          <p className="mt-5 font-mono text-xs text-muted-foreground">{CONTACT_EMAIL}</p>
        </Reveal>
      </div>
    </section>
  );
}
