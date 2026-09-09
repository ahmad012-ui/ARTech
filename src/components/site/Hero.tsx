import { motion } from "framer-motion";
import { HeroScene } from "@/components/three/HeroScene";

export function Hero() {
  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden">
      <div
        className="atmos top-[10%] right-[5%] h-[520px] w-[520px]"
        style={{ background: "oklch(0.55 0.09 220 / 40%)" }}
      />
      <div
        className="atmos bottom-[-10%] left-[-5%] h-[420px] w-[420px]"
        style={{ background: "oklch(0.4 0.05 260 / 35%)" }}
      />

      <div className="absolute inset-y-0 right-0 h-full w-full md:w-[58%]">
        <HeroScene />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl items-center px-6 pt-28 pb-20 lg:px-10">
        <div className="max-w-2xl">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Software Solutions · Digital Products · Full-Stack Engineering
          </motion.p>

          <motion.h1
            className="display-heading text-gradient mt-6 text-[clamp(2.6rem,7.5vw,5.4rem)]"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            WE BUILD
            <br />
            DIGITAL
            <br />
            EXPERIENCES
          </motion.h1>

          <motion.p
            className="mt-7 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
          >
            Modern software, thoughtful design, and scalable technology built for the next
            generation of the web.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55 }}
          >
            <a
              href="#work"
              className="rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-[#050505] transition-transform hover:-translate-y-0.5"
            >
              View Our Work
            </a>
            <a
              href="#contact"
              className="rounded-full border border-[var(--hairline)] bg-[var(--surface)] px-7 py-3.5 text-sm font-medium backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-[var(--surface-strong)]"
            >
              Let's Build Something
            </a>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#050505]" />
    </section>
  );
}
