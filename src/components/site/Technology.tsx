import { useEffect, useRef } from "react";
import { CoreScene } from "@/components/three/CoreScene";
import { Reveal } from "./Reveal";

const TECH = [
  { label: "React", x: 8, y: 18, depth: 1 },
  { label: "TypeScript", x: 74, y: 12, depth: 0.6 },
  { label: "JavaScript", x: 84, y: 62, depth: 1.2 },
  { label: "Node.js", x: 4, y: 62, depth: 0.8 },
  { label: "PHP", x: 30, y: 6, depth: 1.4 },
  { label: "MySQL", x: 62, y: 86, depth: 0.7 },
  { label: "SQL Server", x: 14, y: 86, depth: 1.1 },
  { label: ".NET", x: 88, y: 36, depth: 0.9 },
  { label: "Tailwind CSS", x: 44, y: 92, depth: 1.3 },
  { label: "Git", x: 2, y: 40, depth: 0.5 },
  { label: "Figma", x: 66, y: 30, depth: 1.5 },
];

export function Technology() {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--px", String(x));
        el.style.setProperty("--py", String(y));
      });
    };
    el.addEventListener("pointermove", onMove);
    return () => {
      el.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="technology" className="relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <p className="eyebrow">Ecosystem</p>
          <h2 className="display-heading text-gradient mt-5 max-w-2xl text-[clamp(2rem,5vw,3.6rem)]">
            BUILT WITH MODERN TECHNOLOGY
          </h2>
        </Reveal>

        <div
          ref={wrap}
          className="relative mt-16 h-[480px] w-full sm:h-[560px]"
          style={{ ["--px" as string]: 0, ["--py" as string]: 0 }}
        >
          <CoreScene />
          {TECH.map((t) => (
            <span
              key={t.label}
              className="glass absolute rounded-full px-3.5 py-1.5 font-mono text-[11px] tracking-wide text-muted-foreground transition-transform duration-700 ease-out sm:text-xs"
              style={{
                left: `${t.x}%`,
                top: `${t.y}%`,
                opacity: 0.5 + t.depth * 0.28,
                transform: `translate3d(calc(var(--px) * ${t.depth * 26}px), calc(var(--py) * ${t.depth * 22}px), 0)`,
              }}
            >
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
