"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PIPE_QUERY } from "./pipeQuery";

// Where each fragment starts: it takes the colour of its source icon.
const SOURCES = [
  { icon: 0, left: "14%", color: "#4aa3ff" }, // webpage
  { icon: 1, left: "50%", color: "#e8e8e8" }, // receipt
  { icon: 2, left: "86%", color: "#3ddc84" }, // spreadsheet
];
const FRAGMENTS = 33;

// Hero artwork.
//  - Phones, reduced motion and no-JS: the finished sprite, standing still.
//  - Desktop with motion: three source icons; as the visitor starts scrolling,
//    pixel fragments fly out of them and clump into the stage-1 blob.
//    (Scrubbed to scroll position, never pinned, nothing waits on it.)
export default function IntroArt() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current!;
    const section = root.closest("section")!;
    const hud = document.querySelector<HTMLElement>("[data-hud]");
    const mm = gsap.matchMedia();

    mm.add(PIPE_QUERY, () => {
      const icons = Array.from(root.querySelectorAll<HTMLElement>("[data-icon]"));
      const frags = Array.from(root.querySelectorAll<HTMLElement>("[data-frag]"));
      const blob = root.querySelector<HTMLElement>("[data-blob]")!;
      const center = (el: HTMLElement) => ({ x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight / 2 });
      // deterministic "random" so every load looks the same
      const rnd = (i: number, k: number) => {
        const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
        return v - Math.floor(v);
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: () => `top top+=${hud?.offsetHeight ?? 56}`, // progress 0 at the top of the page
          end: () => `+=${window.innerHeight * 0.4}`, // done after ~40% of a screen of scrolling
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      frags.forEach((frag, i) => {
        const src = SOURCES[i % 3];
        const from = () => {
          const c = center(icons[src.icon]);
          return { x: c.x - 3 + (rnd(i, 1) - 0.5) * 70, y: c.y - 3 + (rnd(i, 2) - 0.5) * 60 };
        };
        const to = () => {
          const c = center(blob);
          return { x: c.x - 3 + (rnd(i, 3) - 0.5) * blob.offsetWidth * 0.7, y: c.y - 3 + (rnd(i, 4) - 0.5) * blob.offsetHeight * 0.8 };
        };
        tl.fromTo(
          frag,
          { x: () => from().x, y: () => from().y, opacity: 1, backgroundColor: src.color },
          {
            x: () => to().x,
            y: () => to().y,
            // fragments turn black-and-white as they join the 1-bit blob
            backgroundColor: i % 2 ? "#f4f4f4" : "#9a9a9a",
            duration: 0.55,
            ease: "power1.inOut",
          },
          rnd(i, 5) * 0.35,
        );
      });
      tl.to(icons, { opacity: 0.3, duration: 0.5 }, 0.1);
      tl.to(icons[1], { opacity: 0, duration: 0.25 }, 0.65); // the middle icon sits where the blob appears
      tl.to(frags, { opacity: 0, duration: 0.1 }, 0.9);
      tl.fromTo(blob, { opacity: 0 }, { opacity: 1, duration: 0.12, immediateRender: true }, 0.88);
      tl.set({}, {}, 1); // timeline lasts exactly 1 unit
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      {/* phones / reduced motion / no JS: the sources, then the finished character */}
      <div className="mt-6 flex flex-col items-center gap-4 pipe:hidden">
        <div aria-hidden className="flex items-center gap-5">
          {SOURCES.map((s) => (
            <div key={s.icon} className="intro-icon" style={{ ["--s" as string]: 3, ["--i" as string]: s.icon }} />
          ))}
        </div>
        <div role="img" aria-label="Pixel-art portrait of Uday holding a laptop" className="sprite-static" />
      </div>
      {/* desktop with motion: icons in one row, the blob forms in the middle slot */}
      <div ref={rootRef} aria-hidden className="relative mx-auto mt-10 hidden h-44 w-full max-w-3xl pipe:block">
        {SOURCES.map((s) => (
          <div
            key={s.icon}
            data-icon
            className="intro-icon absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ left: s.left, ["--i" as string]: s.icon, ["--s" as string]: 5 }}
          />
        ))}
        {Array.from({ length: FRAGMENTS }, (_, i) => (
          <span key={i} data-frag className="frag" />
        ))}
        <div
          data-blob
          data-stage="1"
          data-anim="idle"
          className="char absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ ["--s" as string]: 4 }}
        >
          <div className="sprite" />
        </div>
      </div>
    </>
  );
}
