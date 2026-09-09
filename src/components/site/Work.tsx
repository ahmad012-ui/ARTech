import { useRef, type MouseEvent } from "react";
import dashboard from "@/assets/work-dashboard.jpg";
import commerce from "@/assets/work-commerce.jpg";
import platform from "@/assets/work-platform.jpg";
import { Reveal } from "./Reveal";

const PROJECTS = [
  {
    name: "Logistics Operations Dashboard",
    description:
      "A real-time operations platform for shipment tracking, route performance and delivery reporting.",
    tags: ["React", "TypeScript", "Node.js", "SQL Server"],
    image: dashboard,
    alt: "Logistics operations dashboard interface with shipment charts and tables",
  },
  {
    name: "Commerce Platform",
    description:
      "A storefront and admin system covering catalogue, orders, fulfilment and merchandising.",
    tags: ["React", "PHP", "MySQL", "Tailwind CSS"],
    image: commerce,
    alt: "E-commerce admin orders screen and product catalogue interface",
  },
  {
    name: "Workflow Management System",
    description:
      "A business platform for onboarding workflows, task routing, approvals and audit history.",
    tags: [".NET", "TypeScript", "React", "Figma"],
    image: platform,
    alt: "Workflow management application with kanban board and task detail panel",
  },
];

function ProjectCard({ project, index }: { project: (typeof PROJECTS)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1200px) rotateX(${-y * 5}deg) rotateY(${x * 7}deg) scale(1.015)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <Reveal delay={index * 0.05}>
      <article className="glass grid gap-8 overflow-hidden rounded-3xl p-6 md:grid-cols-[1fr_1.25fr] md:p-8">
        <div className="flex flex-col justify-between">
          <div>
            <span className="eyebrow">{`Project 0${index + 1}`}</span>
            <h3 className="font-display mt-5 text-2xl font-semibold tracking-tight md:text-3xl">
              {project.name}
            </h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-[var(--hairline)] px-3 py-1 font-mono text-[11px] tracking-wide text-muted-foreground"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <a
            href="#contact"
            className="group mt-8 inline-flex w-fit items-center gap-2 text-sm text-foreground"
          >
            View Project
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>

        <div
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="overflow-hidden rounded-2xl border border-[var(--hairline)] transition-transform duration-500 ease-out will-change-transform"
          style={{ boxShadow: "0 40px 100px -60px rgba(0,0,0,1)" }}
        >
          <img
            src={project.image}
            alt={project.alt}
            width={1280}
            height={800}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </article>
    </Reveal>
  );
}

export function Work() {
  return (
    <section id="work" className="relative mx-auto max-w-7xl px-6 py-28 md:py-40 lg:px-10">
      <Reveal>
        <p className="eyebrow">Selected work</p>
        <h2 className="display-heading text-gradient mt-5 text-[clamp(2rem,5vw,3.6rem)]">
          SELECTED WORK
        </h2>
        <p className="mt-5 max-w-xl text-muted-foreground">
          A selection of digital products, interfaces, and software experiences we've built.
        </p>
      </Reveal>

      <div className="mt-16 space-y-6">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.name} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
