import { Canvas, type CanvasProps } from "@react-three/fiber";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return mobile;
}

type Props = Omit<CanvasProps, "children"> & { children: ReactNode; className?: string };

/** Client-only, in-view-gated R3F canvas. Keeps SSR safe and the GPU quiet off-screen. */
export function SceneCanvas({ children, className, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => setVisible(entries[0]?.isIntersecting ?? false), {
      rootMargin: "200px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [mounted]);

  return (
    <div ref={ref} className={className}>
      {mounted && (
        <Canvas
          dpr={[1, 1.6]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          frameloop={visible ? "always" : "never"}
          {...rest}
        >
          {children}
        </Canvas>
      )}
    </div>
  );
}
