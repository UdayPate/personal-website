# Pixel art

Everything is drawn as text grids (one letter = one pixel) and exported to PNG.

- `character.ts`: the character. Stage 3 (16-bit) `HEAD` + `TORSO`, stage 2 (8-bit, half resolution) `HEAD8` + `TORSO8`, and the stage-4 `LAPTOP`. The letter legend is at the top of the file. Walk, idle and celebrate frames are composed from these parts by `scripts/build-sprites.mjs`; stage 1 (glitch blob) is derived from stage 3 there.
- `icons.ts`: the 12x12 HUD icons and the 16x16 hero icons (grad cap, laptop with lightbulb on/off, cricket bat + ball). `props.ts`: the five 16x16 station props. `character.ts` also holds the tucked laptop and the wave pose is built in the script.
- `preview/`: images rendered by the build for a quick look.

Edit a letter, then run:

```
npm run sprites
```

That rewrites `public/sprites/*.png` (stage-1..4 sheets, `wave.png`, `props.png`, `hero.png`, `laptop.png`) and `art/preview/*.png`. Each stage sheet is 4 columns x 3 rows of 32x40 frames: walk, idle (stand, bounce, stand, blink), celebrate.
