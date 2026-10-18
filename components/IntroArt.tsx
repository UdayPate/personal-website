"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PIPE_QUERY } from "./pipeQuery";
import IconTip from "./IconTip";
import { heroIcons } from "@/content/site";

// Where each fragment starts: it takes the colour of its source icon
// (grad cap, glowing laptop, cricket bat; see content/site.ts).
const POSITIONS = ["14%", "50%", "86%"];
const ALIGN = ["left", "center", "right"] as const;
// Sprite sheet index of each icon in public/sprites/hero.png (0 cap, 1-2 laptop off/on, 3 bat).
const SHEET_INDEX = [0, 1, 3];
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
      // Centre of an element in the coordinates of `root` (where the fragments are positioned).
      const center = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        const o = root.getBoundingClientRect();
        return { x: r.left - o.left + r.width / 2, y: r.top - o.top + r.height / 2 };
      };
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
        const src = heroIcons[i % 3];
        const from = () => {
          const c = center(icons[i % 3]);
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
      // Fade the artwork only (not the wrapper), so a tooltip stays fully readable.
      const art = icons.map((el) => el.querySelector(".hero-icon"));
      tl.to(art, { opacity: 0.3, duration: 0.5 }, 0.1);
      // the middle icon sits where the blob appears; autoAlpha also hides it from the keyboard
      tl.to(icons[1], { autoAlpha: 0, duration: 0.25 }, 0.65);
      tl.to(frags, { opacity: 0, duration: 0.1 }, 0.9);
      tl.fromTo(blob, { opacity: 0 }, { opacity: 1, duration: 0.12, immediateRender: true }, 0.88);
      tl.set({}, {}, 1); // timeline lasts exactly 1 unit
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      {/* phones / reduced motion / no JS: the three icons, then the finished character */}
      <div className="mt-6 flex flex-col items-center gap-4 pipe:hidden">
        <div className="flex items-center gap-5">
          {heroIcons.map((h, i) => (
            <IconTip key={h.id} text={h.text} align={ALIGN[i]}>
              <HeroIcon index={SHEET_INDEX[i]} scale={3} bulb={h.id === "laptop"} />
            </IconTip>
          ))}
        </div>
        <div role="img" aria-label="Pixel-art portrait of Uday holding a laptop" className="sprite-static" />
      </div>
      {/* desktop with motion: icons in one row, the blob forms in the middle slot */}
      <div ref={rootRef} className="relative mx-auto mt-10 hidden h-44 w-full max-w-3xl pipe:block">
        {heroIcons.map((h, i) => (
          <div key={h.id} data-icon className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: POSITIONS[i] }}>
            <IconTip text={h.text} align={ALIGN[i]}>
              <HeroIcon index={SHEET_INDEX[i]} scale={5} bulb={h.id === "laptop"} />
            </IconTip>
          </div>
        ))}
        <div aria-hidden>
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
      </div>
    </>
  );
}

// One 16x16 icon from public/sprites/hero.png. The laptop gets a second layer
// (bulb lit) that flickers on once after load; it stays lit.
function HeroIcon({ index, scale, bulb }: { index: number; scale: number; bulb: boolean }) {
  return (
    <span aria-hidden className="hero-icon block" style={{ ["--i" as string]: index, ["--s" as string]: scale }}>
      {bulb && <span className="hero-icon bulb-on absolute inset-0" style={{ ["--i" as string]: 2, ["--s" as string]: scale }} />}
    </span>
  );
}
