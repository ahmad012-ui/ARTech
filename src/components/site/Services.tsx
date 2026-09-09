import { useRef, type MouseEvent } from "react";
import { IconScene, type IconKind } from "@/components/three/IconScene";
import { Reveal } from "./Reveal";

const SERVICES: { no: string; title: string; body: string; icon: IconKind }[] = [
  {
    no: "01",
    title: "Web Development",
    body: "Fast, scalable and responsive web applications built for modern businesses.",
    icon: "cube",
  },
  {
    no: "02",
    title: "UI/UX Design",
    body: "Interfaces designed around people, products, usability and conversion.",
    icon: "layers",
  },
  {
    no: "03",
    title: "Full-Stack Development",
    body: "Reliable frontend and backend systems engineered for performance and growth.",
    icon: "network",
  },
  {
    no: "04",
    title: "Digital Products",
    body: "From concept and architecture to a production-ready digital product.",
    icon: "product",
  },
];

function ServiceCard({ item, index }: { item: (typeof SERVICES)[number]; index: number }) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 8}deg) translateY(-4px)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <Reveal delay={index * 0.08}>
      <article
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="glass group relative h-full overflow-hidden rounded-2xl p-8 transition-[transform,background] duration-500 ease-out hover:bg-[var(--surface-strong)]"
        style={{ boxShadow: "0 30px 80px -50px rgba(0,0,0,0.9)" }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.85_0.05_220_/_45%)] to-transparent opacity-60" />
        <div className="flex items-start justify-between">
          <span className="eyebrow">{item.no}</span>
          <IconScene kind={item.icon} />
        </div>
        <h3 className="font-display mt-10 text-xl font-semibold tracking-tight">{item.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
      </article>
    </Reveal>
  );
}

export function Services() {
  return (
    <section id="services" className="relative mx-auto max-w-7xl px-6 py-28 md:py-40 lg:px-10">
      <Reveal>
        <p className="eyebrow">What we build</p>
        <h2 className="display-heading text-gradient mt-5 max-w-3xl text-[clamp(2rem,5vw,3.6rem)]">
          WHAT WE BUILD
        </h2>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Software solutions designed around real products, real users, and real business needs.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.no} item={s} index={i} />
        ))}
      </div>
    </section>
  );
}
