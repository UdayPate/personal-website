"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Same condition as the `pipe:` variant in globals.css. CSS lays the panels out
// side by side; this only adds the pinning and motion on top.
const PIPE_QUERY =
  "(min-width: 1024px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";

export default function Pipeline({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const charRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current!;
    const track = trackRef.current!;
    const char = charRef.current!;
    const hud = document.querySelector<HTMLElement>("[data-hud]");
    const hudH = () => hud?.offsetHeight ?? 56;
    const setHudVar = () => document.documentElement.style.setProperty("--hud-h", `${hudH()}px`);

    const mm = gsap.matchMedia();
    mm.add(PIPE_QUERY, () => {
      setHudVar();
      ScrollTrigger.addEventListener("refreshInit", setHudVar);
      // Without JS the section scrolls sideways natively; with GSAP we take over.
      section.style.overflow = "hidden";

      // How far the track must slide left so the last panel is fully on screen.
      const distance = () => Math.max(0, track.offsetWidth - section.clientWidth);

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: () => `top top+=${hudH()}`, // pin just under the HUD
          end: () => `+=${distance()}`, // keep it pinned for this many px of scrolling
          pin: true, // hold the section on screen; GSAP adds spacer space below
          scrub: true, // tie the animation to scroll position (no catch-up delay)
          invalidateOnRefresh: true, // recompute the numbers above on resize
          anticipatePin: 1,
        },
      });
      // World slides left...
      tl.to(track, { x: () => -distance() }, 0);
      // ...while the character travels from ~10% to ~90% of the screen,
      // so it visibly moves along the pipe instead of sitting still.
      tl.fromTo(
        char,
        { x: () => section.clientWidth * 0.1 },
        { x: () => track.offsetWidth - section.clientWidth * 0.1 - char.offsetWidth },
        0,
      );

      // A hash jump or keyboard focus can't scroll a pinned track natively, so
      // translate "show this panel" into the matching page scroll position.
      const goTo = (panel: HTMLElement) => {
        const st = tl.scrollTrigger;
        const d = distance();
        if (!st || d === 0) return;
        const progress = Math.min(1, panel.offsetLeft / d);
        window.scrollTo({ top: st.start + progress * (st.end - st.start) });
      };
      const onClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
        if (!a || a.getAttribute("href") === "#") return;
        const panel = section.querySelector<HTMLElement>(a.getAttribute("href")!);
        if (!panel) return;
        e.preventDefault();
        goTo(panel);
      };
      const onFocus = (e: FocusEvent) => {
        const panel = (e.target as HTMLElement).closest<HTMLElement>("[data-station]");
        if (panel) goTo(panel);
      };
      document.addEventListener("click", onClick);
      track.addEventListener("focusin", onFocus);

      return () => {
        document.removeEventListener("click", onClick);
        track.removeEventListener("focusin", onFocus);
        ScrollTrigger.removeEventListener("refreshInit", setHudVar);
        section.style.overflow = "";
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="pipeline"
      ref={sectionRef}
      aria-label="Pipeline"
      className="pipe:h-[calc(100svh-var(--hud-h))] pipe:overflow-x-auto pipe:overflow-y-hidden"
    >
      <div ref={trackRef} className="pipe:relative pipe:flex pipe:h-full pipe:w-max">
        {children}
        {/* Conveyor belt the stations sit on (desktop only) */}
        <div aria-hidden className="belt hidden pipe:block" />
        {/* Placeholder character: a plain square until the real sprites (Phase 6) */}
        <div
          ref={charRef}
          aria-hidden
          className="absolute bottom-[4.5rem] left-0 hidden h-10 w-10 border-4 border-background bg-orange pipe:block"
        />
      </div>
    </section>
  );
}
