"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * TUNING: every number that controls how the desktop pipeline *feels*.
 *
 * The scroll timeline is measured in abstract "units". One hop (the track
 * sliding from one station to the next) is `hop` units, and each station adds a
 * `dwell`. The units are turned into real scrolling by `scrollPerUnit`, so:
 *
 *   total scroll distance = (stations * dwell + (stations - 1) * hop)
 *                           * scrollPerUnit * screen width
 *   with 7 stations at the defaults: 8.8 units * 0.85 = about 7.5 screen widths
 *   (about 10,200 px on a 1366px-wide screen).
 *
 * Want it shorter or snappier? Lower `scrollPerUnit`. Want longer pauses at
 * stations? Raise `dwell`. Everything else below is a detail of the pause.
 */
const TUNING = {
  /** Units of timeline for the track to slide one station to the next. */
  hop: 1.0,
  /** Units the track holds still at each station (walk-in + pop + idle). */
  dwell: 0.4,
  /** Total scroll length: screen widths of scrolling per timeline unit. */
  scrollPerUnit: 0.85,

  /** Part of the dwell spent walking in; the character stops when it ends. */
  walkIn: 0.15,
  /** Units the card takes to pop up once the character has stopped. */
  popDuration: 0.1,
  /** Units the card takes to settle back when the next hop starts. */
  settleDuration: 0.2,

  /** Card "resting" look: before the character arrives and after it leaves. */
  restingOpacity: 0.7,
  restingOffsetY: 40, // px lower than its popped-up position
  restingScale: 0.97,

  /** Where the character stands on screen (fraction of screen width). */
  stopAt: 0.5, // at a station, under the card
  trailAt: 0.15, // trailing behind while the track slides
} as const;

// Same condition as the `pipe:` variant in globals.css. CSS lays the panels out
// side by side; this only adds the pinning and motion on top.
const PIPE_QUERY =
  "(min-width: 1024px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";

const REST = { y: TUNING.restingOffsetY, opacity: TUNING.restingOpacity, scale: TUNING.restingScale };
const POPPED = { y: 0, opacity: 1, scale: 1 };
const FLAG_DIM = { y: 44, backgroundColor: "#3a3a45" };
const FLAG_LIT = { y: 0, backgroundColor: "#00ff41" };

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

      const T = TUNING;
      const panels = Array.from(track.querySelectorAll<HTMLElement>("[data-station]"));
      const n = panels.length;
      const W = () => section.clientWidth; // visible width
      // Camera position (track offset) that shows panel i exactly.
      const cam = (i: number) => Math.min(panels[i].offsetLeft, track.offsetWidth - W());
      const size = () => char.offsetWidth;

      // Timeline layout, in units. Station i's block is: dwell, then hop to i+1.
      const blockStart = (i: number) => i * (T.dwell + T.hop);
      const arriveAt = (i: number) => blockStart(i) + T.walkIn; // character stops
      const leaveAt = (i: number) => blockStart(i) + T.dwell; // next hop begins
      const total = n * T.dwell + (n - 1) * T.hop;
      const unitsToPx = () => W() * T.scrollPerUnit;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: () => `top top+=${hudH()}`, // pin just under the HUD
          end: () => `+=${total * unitsToPx()}`, // stay pinned this many px of scrolling
          pin: true, // hold the section on screen; GSAP adds spacer space below
          scrub: true, // tie the animation to scroll position (no catch-up delay)
          invalidateOnRefresh: true, // recompute the numbers above on resize
          anticipatePin: 1,
        },
      });

      // Starting looks. Set here, when GSAP runs, so without JS everything is
      // fully visible. (Reverted automatically by mm.revert().)
      const cards = panels.map((p) => p.querySelector<HTMLElement>(":scope > article"));
      const flags = panels.map((p) => p.querySelector<HTMLElement>("[data-flag-cloth]"));
      cards.forEach((c) => c && gsap.set(c, REST));
      flags.forEach((f) => f && gsap.set(f, FLAG_DIM));
      gsap.set(char, { x: () => W() * T.trailAt - size() / 2 });

      const no = { immediateRender: false };
      for (let i = 0; i < n; i++) {
        // Character walks in while the track holds still, then stops.
        tl.fromTo(
          char,
          { x: () => cam(i) + W() * T.trailAt - size() / 2 },
          { x: () => cam(i) + W() * T.stopAt - size() / 2, duration: T.walkIn, ...no },
          blockStart(i),
        );
        // Card pops up as the character arrives; checkpoint flag lights up.
        const card = cards[i];
        if (card) {
          tl.fromTo(card, REST, { ...POPPED, duration: T.popDuration, ease: "power2.out", ...no }, arriveAt(i));
        }
        const flag = flags[i];
        if (flag) {
          tl.fromTo(flag, FLAG_DIM, { ...FLAG_LIT, duration: T.popDuration, ease: "power2.out", ...no }, arriveAt(i));
        }

        if (i === n - 1) break; // last station: no further hop
        // Next hop: card settles back, track slides one panel, character trails.
        if (card) {
          tl.fromTo(card, POPPED, { ...REST, duration: T.settleDuration, ease: "power2.in", ...no }, leaveAt(i));
        }
        tl.fromTo(
          track,
          { x: () => -cam(i) },
          { x: () => -cam(i + 1), duration: T.hop, ...no },
          leaveAt(i),
        );
        tl.fromTo(
          char,
          { x: () => cam(i) + W() * T.stopAt - size() / 2 },
          // Moves less than the track, so it falls back to the trailing spot.
          { x: () => cam(i + 1) + W() * T.trailAt - size() / 2, duration: T.hop, ...no },
          leaveAt(i),
        );
      }
      // Make sure the timeline lasts through the final dwell.
      tl.set({}, {}, total);

      // Idle animation (CSS) runs only while the character stands at a station.
      let idle = false;
      tl.eventCallback("onUpdate", () => {
        const t = tl.time();
        let at = false;
        for (let i = 0; i < n; i++) if (t >= arriveAt(i) && t <= leaveAt(i)) at = true;
        if (at !== idle) {
          idle = at;
          char.classList.toggle("char-idle", at);
        }
      });

      // A hash jump or keyboard focus can't scroll a pinned track natively, so
      // translate "show this panel" into the matching page scroll position:
      // the middle of that station's idle hold.
      const goTo = (panel: HTMLElement) => {
        const st = tl.scrollTrigger;
        const i = panels.indexOf(panel);
        if (!st || i < 0) return;
        const hold = arriveAt(i) + T.popDuration + (leaveAt(i) - arriveAt(i) - T.popDuration) / 2;
        window.scrollTo({ top: st.start + (hold / total) * (st.end - st.start) });
      };
      const onClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
        if (!a || a.getAttribute("href") === "#") return;
        const panel = section.querySelector<HTMLElement>(a.getAttribute("href")!);
        if (!panel) return;
        e.preventDefault();
        goTo(panel);
        // Keyboard users (e.g. the skip link) continue from inside that station.
        panel.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
      };
      const onFocus = (e: FocusEvent) => {
        const panel = (e.target as HTMLElement).closest<HTMLElement>("[data-station]");
        if (panel) goTo(panel);
      };
      // Browsers may still nudge a hidden-overflow box sideways (focus, hash
      // navigation). Keep it at 0; GSAP's transform is the only thing moving.
      const onSectionScroll = () => {
        if (section.scrollLeft !== 0) section.scrollLeft = 0;
      };
      document.addEventListener("click", onClick);
      track.addEventListener("focusin", onFocus);
      section.addEventListener("scroll", onSectionScroll);

      // Arriving at /#station (e.g. from a project page's back link).
      const hashPanel = window.location.hash
        ? panels.find((p) => `#${p.id}` === window.location.hash)
        : undefined;
      if (hashPanel) {
        ScrollTrigger.refresh();
        section.scrollLeft = 0;
        goTo(hashPanel);
      }

      return () => {
        document.removeEventListener("click", onClick);
        track.removeEventListener("focusin", onFocus);
        section.removeEventListener("scroll", onSectionScroll);
        ScrollTrigger.removeEventListener("refreshInit", setHudVar);
        char.classList.remove("char-idle");
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
        {/* Placeholder character: a plain square until the real sprites (Phase 6).
            The outer box is moved by GSAP; the inner box does the idle bounce. */}
        <div
          ref={charRef}
          aria-hidden
          className="absolute bottom-[4.5rem] left-0 hidden h-10 w-10 pipe:block"
        >
          <div className="char-body relative h-full w-full border-4 border-background bg-orange">
            <span className="char-eye absolute left-1 top-2 h-2 w-2 bg-background" />
            <span className="char-eye absolute right-1 top-2 h-2 w-2 bg-background" />
          </div>
        </div>
      </div>
    </section>
  );
}
