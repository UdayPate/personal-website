"use client";

import { useEffect, useRef } from "react";
import { PIPE_QUERY } from "./pipeQuery";

// The finished pixel Uday, standing beside the About text. On desktop with
// motion it waves when it scrolls into view (and when hovered or clicked), then
// settles into its idle bounce. Phones, reduced motion and no-JS keep the still
// portrait: without data-anim the CSS shows the first idle frame.
export default function AboutSprite() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const mq = window.matchMedia(PIPE_QUERY);
    const set = (a: "wave" | "idle" | "") => {
      if (a) el.dataset.anim = a;
      else delete el.dataset.anim;
    };
    const wave = () => {
      if (!mq.matches) return;
      set("idle"); // restart the animation if it is already waving
      void el.offsetWidth;
      set("wave");
    };
    const sync = () => set(mq.matches ? "idle" : "");
    sync();
    mq.addEventListener("change", sync);

    const onEnd = (e: AnimationEvent) => {
      if (e.animationName === "wave-wave" && el.dataset.anim === "wave") set("idle");
    };
    const onEnter = (e: PointerEvent) => e.pointerType === "mouse" && wave();
    el.addEventListener("animationend", onEnd);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("click", wave);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) wave();
      },
      { threshold: 0.6 },
    );
    io.observe(el);

    return () => {
      mq.removeEventListener("change", sync);
      el.removeEventListener("animationend", onEnd);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("click", wave);
      io.disconnect();
    };
  }, []);

  return <div ref={ref} role="img" aria-label="Pixel-art portrait of Uday, holding a laptop under one arm" className="wave" />;
}
