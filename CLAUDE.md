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

The Markdown files in `content/` are the source of truth for everything about Uday (see "How to edit content"). Cravely appears only on `/projects`.

When the character reaches a station it pauses (idle animation: blink/bounce) and a project card slides up.

### Project card format
- One-line problem it solves
- What Uday built and his role
- Tech stack (tags)
- One result or number, if available
- Links: GitHub, demo, screenshots

All content lives in typed data files (see structure below), never hard-coded inside animation components.

## Redesign in progress: the branching pipeline (4 steps, before Phase 7)
The single belt becomes a **branching pipeline**. Step 1 (content only) is done; Steps 2-4 build the UI and are agreed with Uday one at a time (plan first, wait for OK). Until a step lands, the site keeps looking exactly as it does today.
- **One belt splits at a junction into three tracks, then merges back into LOAD COMPLETE.** The tracks are **Education**, **Experience** and **Projects**. Projects is the default track.
- **The junction is a control box** with a lever and signal lights; the lever sets which track the belt takes, and the lights show the active one.
- **SWITCH TRACK** is a HUD control (the HUD is still always visible) for changing track without using the lever.
- **The character evolves fully on every branch** (blob, 8-bit, 16-bit, final Uday), so each track is a complete journey, then all three merge into LOAD COMPLETE (About, contact, terminal/agent).
- **Deep links**: `/#projects`, `/#experience`, `/#education` open the page on that track (plus the existing `/#station` links).
- **Tracks in the content model**: every loaded item has a `track` (`projects`, `experience` or `education`), set by its folder. Projects are ordered by `pipelineStage` (their stage labels Extract...Query), experience and education files by an explicit `order` number (no `afterStage` any more).
- **Planned UI hooks already in the content**: a "VIEW CERTIFICATE" button on cards whose education file has `certificate:` (opens the PDF/image in a new tab), an award badge (original pixel art, drawn later; the file only says `award: "5th place"`), and a course list on degree cards.

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
  profile.md            # everything about Uday: name, links, education, tooltips, About text (frontmatter + body)
  profile.ts            # the loaded profile
  projects/<slug>.md    # one Markdown file per project (frontmatter = card fields, body = full details)
  experience/<slug>.md  # one file per Experience-track station (internship / apprenticeship)
  education/<slug>.md   # one file per Education-track station (degree, certificate, award, course)
  education.ts          # the loaded education stations (sorted by `order`) and `degrees`
  loader.ts             # reads + validates those files at build time (fails the build with the file name)
  types.ts              # Project / Checkpoint / PipelineItem types
  projects.ts           # the loaded data: projects, checkpoints, pipeline, getProject, getCheckpoint
  markdown.ts           # Markdown body -> HTML for the project pages
  site.ts               # site/game constants: stage names, total stages, hero icon colours
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
- **Phase 2 (Static content) complete.** Content lives in `content/site.ts` and `content/projects.ts`. Sticky HUD (`components/Hud.tsx`), all pipeline sections on `/`, plain list at `/projects`, resume at `/resume.pdf`. No animation yet; the HUD stage label and DATA QUALITY bar are static (5 STAGES, 100%) until Phase 3. The terminal button is disabled until Phase 7. Next up: Phase 3 (pipeline motion).
- **Phase 3 (Pipeline motion) complete.** On desktop (width >= 1024px, height >= 600px, motion allowed) the stations are laid out side by side by CSS alone (custom Tailwind variant `pipe:` in `globals.css`); `components/Pipeline.tsx` then uses GSAP ScrollTrigger (`pin` + `scrub`) to hold the section on screen and slide the track left as you scroll down, with a CSS conveyor belt and a placeholder orange square that travels ~10% to ~90% of the screen. Without JS the track scrolls sideways natively; phones and `prefers-reduced-motion` keep the vertical static layout. The HUD is live: `components/ScrollProgress.tsx` (per-frame) writes stage label + DATA QUALITY (whole-page scroll %) into `components/hudStore.ts`, `HudLive.tsx` renders them. Hash links (`#aislesave`) and keyboard focus inside the pinned track are translated into scroll positions. Cards use a compact two-column layout in the pipeline and were measured to fit at 1366x768, 1280x720 and 1024x700 with no inner scrolling. Next up: Phase 4 (stations: character pauses, cards slide in, idle animation).
- **Phase 4 (Stations) complete.** The desktop scroll timeline in `components/Pipeline.tsx` now has a dwell at every station: the track holds still while the character walks in and stops under the card (HUD label matches), then a hop slides to the next station while the character trails behind. Cards start at a "resting" look set by GSAP only (70% opacity, 40px low, 97% scale), pop to full as the character arrives and settle back on the next hop; checkpoint flags (GroovyWeb, Everlaw) raise and light up. The character idles (CSS bounce + blink, class `char-idle`) only while stopped. **All feel numbers live in the `TUNING` object at the top of `Pipeline.tsx`** (hop, dwell, scroll length via `scrollPerUnit`, resting opacity, etc.). Phones, reduced motion, short screens and no-JS keep the static layout (no dwell, no card motion). Hash links, keyboard focus, `/#station` URLs and browser Back/reload now land on the station's dwell position (`ScrollMemory.tsx`, `NavTracker.tsx`); project pages have a "BACK TO STATION" link. Verified at 1366x768, 1280x720 and 1024x700 that every card fits at its dwell with no inner scrolling. Next up: Phase 5 (responsive + accessibility polish).
- **Phase 5 (Responsive + accessibility) complete.** Lighthouse (production build): home mobile 99/100/100/100, home desktop 100/100/100/100, project page mobile 98/100/100/100, desktop 100/100/100/100 (performance/accessibility/best practices/SEO). What changed: global `:focus-visible` outline (3px off-white); "Skip to projects" link (`SkipLink.tsx`) is the first focusable element and lands inside the first station; descriptive `aria-label`s on HUD buttons ("Resume (CV PDF, opens in a new tab)", etc.), DATA QUALITY is a labeled `progressbar` with `aria-valuetext`, belt/flags/character are `aria-hidden`; card titles are `h2` on the home page (`h3` on `/projects`); resting-card date text raised for AA contrast; 12px minimum text; tap targets >= 44px on phones/touch. **Below 1024px the HUD splits**: slim top bar (name, stage, DATA QUALITY) plus a fixed bottom button bar that respects the iPhone safe area (`env(safe-area-inset-*)`, `viewport-fit=cover`); phone button labels are short (CV, GIT, IN, MAIL, >_) via CSS (`.hud-label`), the full text is in each `aria-label`. Checked at 360/390/430/768 widths: no horizontal overflow. All cards still fit at 1366x768, 1280x720 and 1024x700. Known/accepted: the HUD name link is 32px tall (above the 24px WCAG minimum, below 44px); the safe-area inset itself could not be emulated headlessly, so check the bottom bar on a real iPhone. Next up: Phase 6 (pixel art).
- **Phase 6 (Pixel art) complete.** Original character drawn as letter grids (`art/character.ts`, `art/icons.ts`) and exported to PNG sheets in `public/sprites/` with `npm run sprites` (see `art/README.md`); 32x40 frames, three-quarter view facing right, rendered with `image-rendering: pixelated` and CSS `steps()` animation (integer scale 2x, or 3x on screens >= 1200x760 so the character never overlaps a card). Four stages: 1 glitchy 1-bit blob (Extract), 2 half-resolution 8-bit (Transform), 3 detailed 16-bit (Load), 4 holding the laptop (Serve, Query). Stage swaps happen as the character stops at each station (with a short glitch flicker; checkpoints keep the current stage); the state machine lives in `Pipeline.tsx` (walk only while the page scrolls, idle while stopped, ~1.6s celebration with confetti at Serve, then idle). The laptop sits on the belt at Serve and hops to the character on arrival. Intro (`IntroArt.tsx`): three pixel source icons; scrubbed fragments clump into the blob over the first ~40% of a screen of scrolling (never pinned). Phones, reduced motion and no-JS show the static stage-4 portrait (`.sprite-static`, `role="img"`) in the hero instead. Phone HUD labels are now pixel icons (`PixelIcon.tsx`: document, code brackets, briefcase, envelope, terminal) with full `aria-label`s. Added outline colours (and denim/shoe/stubble/lip colours) beyond the original palette, documented in `art/character.ts`. Verified: all 7 cards fit at 1366x768, 1280x720, 1024x700 and 1024x768 with the character at least 13px below the nearest card; Lighthouse performance 98-100, accessibility/best practices/SEO 100. Next up: Phase 7 (terminal + agent).
- **Polish pass before Phase 7 complete.** (1) Ending: the About section is two columns on desktop; the finished sprite (laptop now tucked flat under the near arm, also in stage 4) stands in a "READY FOR QUERIES" panel and waves when About scrolls into view (`AboutSprite.tsx`, `public/sprites/wave.png`, 40x40 frames: row 0 wave, row 1 idle), again on hover/click, then idles; phones, reduced motion and no-JS keep the still portrait. (2) Station props (`art/props.ts`, `public/sprites/props.png`): hopper, gears, database, dashboard, terminal sit on the belt at 76% of each stage panel, right of where the character stops (decorative, aria-hidden). (3) HUD: phones show short labels ("2/5 TRANSFORM", "COMPLETE"; HUD height is constant at every stage, checked at 360/390/1366/1920); the final desktop label is "STAGE 5/5 · COMPLETE"; there is a guaranteed gap before DATA QUALITY. (4) Contact links are pixel buttons with HUD icons. (5) Desktop cards are centred between the HUD and the belt (padding in `Station.tsx`: `pipe:pb-[5.5rem] pipe:pt-0`, the extra 1.5rem keeps the character clear of the card at 1024x700). On very tall screens (1920x1080) the bands above and below the card are about 300px each. (6) Hero icons (`heroIcons` in `art/icons.ts`, `public/sprites/hero.png`, text in `content/site.ts`): grad cap, laptop with lightbulb (flickers on once, stays lit), cricket bat + ball. Each is a button (`IconTip.tsx`) showing a retro tooltip on hover, keyboard focus and tap; the tooltip text equals the aria-label; Escape or tapping elsewhere closes it. Fragments still fly from each icon into the blob (the middle icon hides as the blob forms there). `sources.png` was removed. Verified on the production build: card fit at 1366x768, 1280x720, 1024x700 and 1920x1080 (no card/character/prop overlap, character at least 17px below every card), 390px hero and tooltips (no horizontal overflow), stage sequence 1-2-3-4, Serve celebrate then idle; Lighthouse home mobile 98/100/100/100, desktop 100/100/100/100, project page 98/100/100/100 and 100/100/100/100. Next up: Phase 7 (terminal + agent).
- **Content migrated to Markdown (before Phase 7).** Projects live in `content/projects/<slug>.md` and checkpoints in `content/experience/<slug>.md` (see "How to add a project" below), read by `content/loader.ts` at build time and validated against the types in `content/types.ts`. The pipeline order is now derived from `pipelineStage` in each project's frontmatter (`afterStage` places each checkpoint); the stage names are `stageLabels` in `content/site.ts`. Dependencies added with approval: `yaml` (frontmatter) and `marked` (Markdown body on `/projects/<slug>`; raw HTML in a body is shown as text). Verified: text, titles, links and status of all 11 pages (home, `/projects`, 8 project/checkpoint URLs, 404) are identical before and after; the project-page HTML differs only by one wrapper `<div>` around the body. The Phase 7 agent can read the same Markdown files. Next up: Phase 7 (terminal + agent).
- **Profile moved to Markdown (before Phase 7).** `content/profile.md` now holds everything about Uday (see "How to edit content"); `site.ts` keeps only site/game constants. The hero tooltips are passed to `IntroArt` as props from the server page; `{projectCount}`/`{experienceCount}` are computed by the loader. Verified before/after: text, titles, meta descriptions, aria-labels and links of all 11 pages identical. Next up: Phase 7 (terminal + agent).
- **Redesign Step 1 (content only) complete.** Added `content/education/` (BS UCSC, CodePath with `public/certificates/codepath.pdf`, Deposit Shield hackathon award, MS SJSU, DeepLearning.AI ML Specialization in progress), validated by `content/loader.ts` (kinds, unique `order`, certificate file must exist and be png/jpg/webp/svg/pdf, award rules, links, unknown keys). `track` added to the model; `education:` removed from `profile.md` (education is now only in `content/education/`). No UI change: 11 pages compared before/after. Next: Redesign Step 2.
- **Redesign Step 2 (branch mechanics, placeholder art) complete.** Page flow: hero, intake belt, JUNCTION, chosen track, end-of-track signpost, MERGE, then LOAD COMPLETE / About / Contact.
  - *Content*: experience files have `order` (`afterStage` is gone); the loader exports `tracks` (`content/tracks.ts`); new detail pages `/experience/<slug>` and `/education/<slug>`; `/projects` lists Projects, Experience and Education; `EducationCard` (kind badge, institution, dates, first 4 courses + "+N more", trophy badge with award text, IN PROGRESS badge, VIEW CERTIFICATE in a new tab, VIEW DETAILS) and a VIEW DETAILS button on experience cards.
  - *Layout modes* (CSS + a tiny inline script that adds `js` to `<html>`; the `pipe:` variant now also requires it): **static** (no JS, or reduced motion): all three tracks stacked (Projects, Experience, Education) with headings, junction = plain links, nothing hidden or pinned; **select** (JS + motion): only one track is shown (`#tracks[data-active]`), desktop (>= 1024x600) as the pinned horizontal pipeline, phones/short screens as vertical cards. Classes `.only-static` / `.only-select` switch the junction between links and buttons.
  - *Code*: `Pipeline.tsx` is one track-aware component (props `track`, `label`); only the visible track builds its ScrollTrigger (id = track id). `TrackSection`, `Station` (all three card types, props by position, laptop at the last station), `Signpost`, `Junction` + `JunctionButtons` (aria-pressed buttons, signal dots, "N STATIONS" on hover/focus, live-region announcement, placeholder character roll), `Merge`, `IntakeBelt` = `.belt-strip`. State lives in `components/trackStore.ts` (selected/visible track, visited stations, visited tracks; remembered in sessionStorage, all wrapped in try/catch); navigation helpers in `components/trackNav.ts`; `TrackController.tsx` wires deep links, in-page links, auto-select (scrolling past the junction selects Projects) and the `#tracks[data-active]` attribute; `ScrollMemory.tsx` restores the scroll position after Back and waits for the remembered track's pin.
  - *URLs*: `/#projects`, `/#experience`, `/#education` select that track and scroll to its start; `/#<station-slug>` selects the station's track and goes to that station. Choosing a track writes `#track` with `replaceState` (no history entries). A track hash does not hijack Back/reload (the saved scroll position is restored).
  - *HUD*: two rows on desktop (name + SWITCH TRACK + links; stage label + DATA QUALITY), constant height (76px) at every scroll position; phones: top bar (name, short label, DATA QUALITY) + bottom bar with a SWITCH TRACK icon button first. Labels: "PROJECTS 2/5 · TRANSFORM", "EXPERIENCE 1/2", "EDUCATION 3/5", phones "PROJECTS 2/5" (full track names fit at 360px), plus "INTRO", "JUNCTION", "TRACK END", "COMPLETE". SWITCH TRACK lists the three tracks with signal dots (green = selected) and a checkmark on tracks visited; moving the character to the other track's start with a short hop (instant jump from far down a track, smooth from the junction). DATA QUALITY = distinct stations visited across all tracks / 12, remembered per tab (also shown on other pages). A station counts as visited when the character stops there (desktop) or it is centred on screen (phones).
  - *Evolution*: stage = `1 + round((position-1)*3/(n-1))` per track, so the blob is always the first station and the final sprite (with the laptop and the celebration) always the last (Projects 1,2,3,3,4; Experience 1,4; Education 1,2,3,3,4). Station props are placeholders chosen by position along the track (Step 3 replaces them).
  - *Verified* (production build): every card + signpost (15 panels) fits at 1366x768, 1920x1080, 1280x720 and 1024x700 with no inner scrolling and the character at least 23px below every card, no prop/laptop/flag overlap; each track start to finish (HUD labels, visited count, evolution, celebration); default track by scrolling past the junction; switching mid-track from the HUD; all three signposts (incl. FINISH); deep links `/#projects`, `/#experience`, `/#education`, `/#bs-ucsc`, `/#groovyweb`; Back from education/project/experience detail pages and "BACK TO STATION"; phones at 390 and 360 (no horizontal overflow, constant 72px top bar, bottom bar buttons >= 44px); reduced motion and no JavaScript (all three tracks stacked, junction links work); keyboard (junction buttons, SWITCH TRACK + Esc); hero tooltips, wave ending, skip link. Lighthouse: home mobile 98/100/100/100, home desktop 100/100/100/100, project page mobile 98/100/100/100, education page desktop 100/100/100/100, `/projects` mobile 98/100/100/100. Known/accepted: clicking a link inside a station re-centres the scroll position on that station's hold (existing behaviour of keyboard-focus handling); real touch/trackpad scrolling is untested. Next: Redesign Step 3 (real junction/merge art).
- **Project content model (now in the Markdown files):** each project in `content/projects.ts` has `summary` (2-3 short bullets using only facts from `details`) and `details` (the full text). Cards (pipeline stations and the `/projects` list) show: problem line, summary bullets, highlight, tech tags, and a VIEW DETAILS button. Each project has a detail page at `/projects/[id]` (id = slug) with the full details, tech, highlight, and links. Link buttons render only when a link is set. Clicking the name in the HUD goes to `/` (scrolls to top when already home).
- `AGENTS.md` is auto-generated by Next.js and tells agents to read `node_modules/next/dist/docs/` since this Next version differs from older docs.

### How to edit content
**The rule: anything about Uday lives in Markdown; anything about the site or game stays in code.**
- *Markdown (`content/`)*: name, pitch, subtitle, links, email, resume path, education, page title and meta description, the hero icon tooltips, the About text (`content/profile.md`); every project (`content/projects/*.md`); every internship/checkpoint (`content/experience/*.md`).
- *Code*: stage names (`stageLabels` in `content/site.ts`), UI labels ("LOAD COMPLETE", "VIEW DETAILS", "START PIPELINE", ...), the "| Udayverse" title suffix, animation settings and colours.
- Never type a fact about Uday (a date, school, number, link) into a component. If a number can be counted from the files, count it: the laptop tooltip in `profile.md` uses `{projectCount}` and `{experienceCount}`, filled in by the loader (any other `{placeholder}` fails the build).
- `content/profile.md` frontmatter: `name`, `firstName`, `pitch`, `subtitle`, `email`, `linkedin`, `github` (full https addresses), `resume` (a file that exists in `public/`), `pageTitle`, `metaDescription`, `tooltips` (`grad`, `laptop`, `cricket`). The body is the About text (plain text, one paragraph). Unknown keys, missing fields, a bad email or URL, or a missing resume file fail the build and name `content/profile.md`.
- Education lives only in `content/education/` (see below), not in `profile.md`. If something needs a degrees list, derive it: `degrees` in `content/education.ts` is every file with `kind: degree`.
- Facts should agree across files (the About text and tooltips repeat some facts from the education and experience files, so change them together).
- Restart `npm run dev` after editing content files; dev does not watch them.

### Education files (`content/education/<slug>.md`)
One file per station on the Education track. Required: `kind` (`degree`, `certificate`, `award` or `course`), `order` (whole number, unique in the folder; stations are sorted by it, dates are never parsed), `title`, `institution` (school, issuer or event organizer), and `dates` (free text like `"2025"` or `"expected Dec 2027"`; only a file with `status: "in-progress"` may leave it out). Optional: `courses` (list), `certificate` (path in `public/` ending in `.png`, `.jpg`, `.jpeg`, `.webp`, `.svg` or `.pdf`; the build fails if the file does not exist), `status` (only `"in-progress"`), `award` (text like `"5th place"`; required for `kind: award`, not allowed otherwise), `project`, `role`, `teamSize` (whole number >= 1), `tech` (list), `links` (`github`, `demo`, `screenshots`, full https addresses). The Markdown body holds optional details. File names are lowercase-with-dashes and must be unique across projects, experience and education. Unknown fields and every mistake above fail the build and name the file.

### How to add a project
1. Create `content/projects/<slug>.md`. The file name is the slug: lowercase letters, digits and dashes (it becomes `/projects/<slug>` and the `#slug` anchor).
2. Frontmatter (between `---` lines). Required: `title`, `summary` (list of 1-4 short bullets using only facts from the body), `tech` (list). Optional: `dates`, `problem` (one line), `highlight`, `links` (`github`, `demo`, `screenshots`: full `https://` addresses; the buttons appear automatically). Plus exactly one of:
   - `pipelineStage: N` (1-5) to put it on that pipeline station, or
   - `projectsOnly: true` to show it only on `/projects` (like Cravely).
3. Below the frontmatter, write the full details in Markdown (paragraphs, lists, links). It must not be empty.
4. Each stage 1-5 needs exactly one project. To replace a station's project, change the old file to `projectsOnly: true` (remove its `pipelineStage`) in the same change. Two projects on one stage, or an empty stage, fails the build with the file names.
5. For an internship/checkpoint, create `content/experience/<slug>.md` with `title`, `dates`, `bullets` (list) and `order` (whole number, unique among experience files; sorted by it, not by date). It becomes a station on the Experience track. The body is optional details shown on `/experience/<slug>`.
6. Run `npm run build` (any typo, unknown field, wrong type or bad link stops it and names the file). Restart `npm run dev` after editing content files; dev does not watch them.

### Links to add later
Project `links` (`github`, `demo`, `screenshots`) are optional in `content/projects.ts`; adding one makes its button appear automatically. Currently no project has any links. Wanted for: AisleSave, Airbnb pipeline, Apple platform, Data Lens, Cricket platform, Cravely. Also: refresh `public/resume.pdf` whenever the resume changes.

## Working conventions
- Ask before adding new dependencies beyond the stack above.
- Small, focused commits after each working step, with clear messages.
- Explain changes in plain language; Uday is comfortable with code but new to Next.js and GSAP, so briefly explain framework-specific concepts when introducing them.
- Update the "Current status" section of this file at the end of each phase.
