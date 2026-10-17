# Udayverse — Personal Portfolio Website

## What this is
Uday's personal portfolio site. He is a master's student at San José State University (SJSU) applying for data engineering internships (also data analyst, ML engineering, software engineering, and product roles). The site should make a hiring manager think: "this person turns messy data into something useful, and builds things that are fun to use."

## Core concept: a retro pixel-game data pipeline
The page is one long, scroll-driven side-scroller styled like an old-school 8-bit/16-bit game. A pixel character travels through an ETL pipeline (Extract, Transform, Load), plus Serve and Query stages. **The character is the data**: it is assembled and upgraded as it moves through the pipeline, and at the end it becomes a polished pixel version of Uday.

Image quality stands in for data quality:

| Stage | What happens to the character | Project station |
|---|---|---|
| Intro | Pixel fragments fly in from sources (webpage, receipt, spreadsheet icons) | Name + one-line pitch |
| 1. Extract | Fragments clump into a rough, glitchy 1-bit black-and-white blob | AisleSave (receipt OCR → clean grocery price data) |
| Checkpoint | — | GroovyWeb, Data Analytics Apprentice (2024) |
| 2. Transform | Glitches scrubbed, pieces snap together into a recognizable 8-bit sprite that can walk | Airbnb Medallion Pipeline (S3 → Snowflake → dbt → Neo4j recommender) |
| 3. Load | Stored and comes out a stable, detailed 16-bit sprite | Apple Sales & Warranty Analytics Platform |
| Checkpoint | — | Everlaw, GTM Data Analyst Intern (2026) |
| 4. Serve | Final polished pixel Uday, with signature item and a small celebration | Data Lens (automated dashboard recommendation platform) |
| 5. Query | "LOAD COMPLETE" → about, contact, and the terminal/agent | AI Cricket Intelligence Platform + Ask Uday terminal |

`content-draft.md` is the source of truth for site text. Cravely appears only on `/projects`.

When the character reaches a station it pauses (idle animation: blink/bounce) and a project card slides up.

### Project card format
- One-line problem it solves
- What Uday built and his role
- Tech stack (tags)
- One result or number, if available
- Links: GitHub, demo, screenshots

All content lives in typed data files (see structure below), never hard-coded inside animation components.

## Non-negotiable rules
1. **Animation never blocks content.** No gates, minigames, or required typing. Scrolling fast must still work. A recruiter must reach projects and the resume within seconds.
2. **The HUD is always visible**: name, current stage ("STAGE 2/5"), a "DATA QUALITY" bar that fills 0% → 100% with scroll progress, and buttons for Resume, GitHub, LinkedIn, Contact, and the terminal.
3. **Mobile**: the pipeline runs vertically on small screens. No horizontal scrolling on phones.
4. **Respect `prefers-reduced-motion`**: show a static version of the pipeline with all content visible.
5. **A plain list view** of all projects exists at `/projects` for skimmers and search engines.
6. **All art is original.** Factory / conveyor-belt / machinery style. No resemblance to Mario (no green warp pipes) or any other existing game character or IP.
7. **Placeholder first**: use a simple colored square for the character until the pixel art is ready. The real sprites were added in Phase 6.
8. Keep the site fast: target a Lighthouse performance score of 90+.

## Tech stack
- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **GSAP** with ScrollTrigger for scroll-driven animation
- Pixel art made in Piskel or Aseprite, exported as PNG sprite sheets; render with `image-rendering: pixelated`
- Fonts: "Press Start 2P" for headings/HUD, "VT323" for body/terminal (via `next/font/google`)
- Hosting: **Vercel**
- Agent: Claude API called from a Next.js API route (server side only)

## Suggested structure
```
app/
  layout.tsx          # fonts, HUD, global styles
  page.tsx            # the pipeline page
  projects/page.tsx   # plain list view
  api/ask/route.ts    # agent endpoint (Phase 7)
components/
  Hud.tsx
  Pipeline.tsx        # scroll container + GSAP timeline
  Station.tsx
  ProjectCard.tsx
  Character.tsx       # sprite + evolution stage
  Terminal.tsx        # pop-up terminal (Phase 7)
content/
  projects.ts         # typed project data, one entry per station
  site.ts             # name, pitch, about, links, resume path
public/
  resume.pdf
  sprites/
```

## Visual style
- Dark background, retro palette (base: near-black, accent orange `#ff8c00`, cyan `#00bfff`, green `#00ff41` — adjust during design phase)
- Pixel borders on cards, chunky buttons, subtle CRT scanline overlay (optional, must be toggleable or very light)
- Sound effects are optional and **off by default** with a mute toggle

## Terminal + "Ask Uday" agent (Phase 7)
- Opens as a pop-up from the HUD terminal icon or the backtick key (`` ` ``). Never opens automatically.
- Built-in commands handled locally with no AI call: `help`, `projects`, `resume`, `about`, `contact`, `goto <stage>`, `clear`.
- Anything else is sent to `/api/ask`, which answers questions about Uday using retrieval-augmented generation (RAG): look up relevant passages from `content/` and the resume, then answer from them.
- Agent rules:
  - Answer **only** from provided content. If it isn't there, say so and point to the contact section. Never invent experience, skills, or numbers.
  - Keep answers short (2–4 sentences).
  - Stay on topic (Uday's work, skills, projects); politely decline unrelated requests.
- Safety and cost:
  - API key only in server environment variables (`ANTHROPIC_API_KEY`), never in client code.
  - Rate limit per IP (e.g. Upstash Redis or Vercel KV) and cap input length.
  - Use a small, inexpensive Claude model.

## Build phases
Work one phase at a time. The site must be working and committed at the end of each phase.

1. **Setup**: Next.js + TypeScript + Tailwind + GSAP, fonts, base layout, deploy a hello-world to Vercel.
2. **Static content**: HUD and every section rendered with real content from `content/`, no animation. Must already be a usable portfolio. Build `/projects` list view.
3. **Pipeline motion**: horizontal scroll pipeline with GSAP ScrollTrigger, placeholder square character moving along it, data-quality bar tied to scroll progress.
4. **Stations**: character pauses at each station, project cards slide in, idle animation.
5. **Responsive + accessibility**: vertical pipeline on mobile, reduced-motion fallback, keyboard navigation, alt text.
6. **Pixel art**: swap in the real sprites, four evolution stages ending in pixel Uday with his signature item; fragment fly-in intro; celebration at Serve.
7. **Terminal + agent**: pop-up terminal, local commands, `/api/ask` with RAG, rate limiting.
8. **Polish + launch**: optional sound, final Lighthouse check, test on a real phone, custom domain.

## Current status
- **Phase 1 (Setup) complete.** Next.js (App Router, TypeScript, Tailwind v4, ESLint) + GSAP, Press Start 2P / VT323 via `next/font/google` (`--font-pixel`, `--font-body`).
- **Phase 2 (Static content) complete.** Content lives in `content/site.ts` and `content/projects.ts` (text from `content-draft.md`). Sticky HUD (`components/Hud.tsx`), all pipeline sections on `/`, plain list at `/projects`, resume at `/resume.pdf`. No animation yet; the HUD stage label and DATA QUALITY bar are static (5 STAGES, 100%) until Phase 3. The terminal button is disabled until Phase 7. Next up: Phase 3 (pipeline motion).
- **Phase 3 (Pipeline motion) complete.** On desktop (width >= 1024px, height >= 600px, motion allowed) the stations are laid out side by side by CSS alone (custom Tailwind variant `pipe:` in `globals.css`); `components/Pipeline.tsx` then uses GSAP ScrollTrigger (`pin` + `scrub`) to hold the section on screen and slide the track left as you scroll down, with a CSS conveyor belt and a placeholder orange square that travels ~10% to ~90% of the screen. Without JS the track scrolls sideways natively; phones and `prefers-reduced-motion` keep the vertical static layout. The HUD is live: `components/ScrollProgress.tsx` (per-frame) writes stage label + DATA QUALITY (whole-page scroll %) into `components/hudStore.ts`, `HudLive.tsx` renders them. Hash links (`#aislesave`) and keyboard focus inside the pinned track are translated into scroll positions. Cards use a compact two-column layout in the pipeline and were measured to fit at 1366x768, 1280x720 and 1024x700 with no inner scrolling. Next up: Phase 4 (stations: character pauses, cards slide in, idle animation).
- **Phase 4 (Stations) complete.** The desktop scroll timeline in `components/Pipeline.tsx` now has a dwell at every station: the track holds still while the character walks in and stops under the card (HUD label matches), then a hop slides to the next station while the character trails behind. Cards start at a "resting" look set by GSAP only (70% opacity, 40px low, 97% scale), pop to full as the character arrives and settle back on the next hop; checkpoint flags (GroovyWeb, Everlaw) raise and light up. The character idles (CSS bounce + blink, class `char-idle`) only while stopped. **All feel numbers live in the `TUNING` object at the top of `Pipeline.tsx`** (hop, dwell, scroll length via `scrollPerUnit`, resting opacity, etc.). Phones, reduced motion, short screens and no-JS keep the static layout (no dwell, no card motion). Hash links, keyboard focus, `/#station` URLs and browser Back/reload now land on the station's dwell position (`ScrollMemory.tsx`, `NavTracker.tsx`); project pages have a "BACK TO STATION" link. Verified at 1366x768, 1280x720 and 1024x700 that every card fits at its dwell with no inner scrolling. Next up: Phase 5 (responsive + accessibility polish).
- **Phase 5 (Responsive + accessibility) complete.** Lighthouse (production build): home mobile 99/100/100/100, home desktop 100/100/100/100, project page mobile 98/100/100/100, desktop 100/100/100/100 (performance/accessibility/best practices/SEO). What changed: global `:focus-visible` outline (3px off-white); "Skip to projects" link (`SkipLink.tsx`) is the first focusable element and lands inside the first station; descriptive `aria-label`s on HUD buttons ("Resume (CV PDF, opens in a new tab)", etc.), DATA QUALITY is a labeled `progressbar` with `aria-valuetext`, belt/flags/character are `aria-hidden`; card titles are `h2` on the home page (`h3` on `/projects`); resting-card date text raised for AA contrast; 12px minimum text; tap targets >= 44px on phones/touch. **Below 1024px the HUD splits**: slim top bar (name, stage, DATA QUALITY) plus a fixed bottom button bar that respects the iPhone safe area (`env(safe-area-inset-*)`, `viewport-fit=cover`); phone button labels are short (CV, GIT, IN, MAIL, >_) via CSS (`.hud-label`), the full text is in each `aria-label`. Checked at 360/390/430/768 widths: no horizontal overflow. All cards still fit at 1366x768, 1280x720 and 1024x700. Known/accepted: the HUD name link is 32px tall (above the 24px WCAG minimum, below 44px); the safe-area inset itself could not be emulated headlessly, so check the bottom bar on a real iPhone. Next up: Phase 6 (pixel art).
- **Phase 6 (Pixel art) complete.** Original character drawn as letter grids (`art/character.ts`, `art/icons.ts`) and exported to PNG sheets in `public/sprites/` with `npm run sprites` (see `art/README.md`); 32x40 frames, three-quarter view facing right, rendered with `image-rendering: pixelated` and CSS `steps()` animation (integer scale 2x, or 3x on screens >= 1200x760 so the character never overlaps a card). Four stages: 1 glitchy 1-bit blob (Extract), 2 half-resolution 8-bit (Transform), 3 detailed 16-bit (Load), 4 holding the laptop (Serve, Query). Stage swaps happen as the character stops at each station (with a short glitch flicker; checkpoints keep the current stage); the state machine lives in `Pipeline.tsx` (walk only while the page scrolls, idle while stopped, ~1.6s celebration with confetti at Serve, then idle). The laptop sits on the belt at Serve and hops to the character on arrival. Intro (`IntroArt.tsx`): three pixel source icons; scrubbed fragments clump into the blob over the first ~40% of a screen of scrolling (never pinned). Phones, reduced motion and no-JS show the static stage-4 portrait (`.sprite-static`, `role="img"`) in the hero instead. Phone HUD labels are now pixel icons (`PixelIcon.tsx`: document, code brackets, briefcase, envelope, terminal) with full `aria-label`s. Added outline colours (and denim/shoe/stubble/lip colours) beyond the original palette, documented in `art/character.ts`. Verified: all 7 cards fit at 1366x768, 1280x720, 1024x700 and 1024x768 with the character at least 13px below the nearest card; Lighthouse performance 98-100, accessibility/best practices/SEO 100. Next up: Phase 7 (terminal + agent).
- **Project content model:** each project in `content/projects.ts` has `summary` (2-3 short bullets using only facts from `details`) and `details` (the full text). Cards (pipeline stations and the `/projects` list) show: problem line, summary bullets, highlight, tech tags, and a VIEW DETAILS button. Each project has a detail page at `/projects/[id]` (id = slug) with the full details, tech, highlight, and links. Link buttons render only when a link is set. Clicking the name in the HUD goes to `/` (scrolls to top when already home).
- `AGENTS.md` is auto-generated by Next.js and tells agents to read `node_modules/next/dist/docs/` since this Next version differs from older docs.

### Links to add later
Project `links` (`github`, `demo`, `screenshots`) are optional in `content/projects.ts`; adding one makes its button appear automatically. Currently no project has any links. Wanted for: AisleSave, Airbnb pipeline, Apple platform, Data Lens, Cricket platform, Cravely. Also: refresh `public/resume.pdf` whenever the resume changes.

## Working conventions
- Ask before adding new dependencies beyond the stack above.
- Small, focused commits after each working step, with clear messages.
- Explain changes in plain language; Uday is comfortable with code but new to Next.js and GSAP, so briefly explain framework-specific concepts when introducing them.
- Update the "Current status" section of this file at the end of each phase.
