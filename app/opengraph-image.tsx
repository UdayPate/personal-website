import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

// The picture shown when the site is shared (LinkedIn, messages, social). 1200x630, pixel style:
// name, pitch and subtitle come from content/profile.md; the sprite is the final pixel Uday.
// Fonts: Press Start 2P and VT323 (SIL Open Font License, see assets/fonts).
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateImageMetadata() {
  return [{ id: "preview", alt: `${profile.name}: ${profile.pitch}`, size, contentType }];
}


export default async function Image() {
  const [pixel, vt, spriteBytes] = await Promise.all([
    readFile(new URL("../assets/fonts/PressStart2P-Regular.ttf", import.meta.url)),
    readFile(new URL("../assets/fonts/VT323-Regular.ttf", import.meta.url)),
    readFile(new URL("../assets/social/sprite.png", import.meta.url)),
  ]);
  const sprite = `data:image/png;base64,${Buffer.from(spriteBytes).toString("base64")}`;
  const treads = Array.from({ length: 48 }, (_, i) => i);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#0a0a0f", border: "12px solid #ff8c00", padding: "36px 48px 0 48px", position: "relative" }}>
        <div style={{ display: "flex", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: 700 }}>
            <div style={{ fontFamily: "PressStart", fontSize: 22, color: "#00ff41", marginBottom: 28, display: "flex" }}>UDAYVERSE</div>
            <div style={{ fontFamily: "PressStart", fontSize: 62, lineHeight: 1.25, color: "#ff8c00", display: "flex", flexWrap: "wrap" }}>{profile.name.toUpperCase()}</div>
            <div style={{ fontFamily: "VT323", fontSize: 44, lineHeight: 1.15, color: "#e8e8e8", marginTop: 28, display: "flex" }}>{profile.pitch}</div>
            <div style={{ fontFamily: "PressStart", fontSize: 15, lineHeight: 1.5, color: "#00bfff", marginTop: 28, display: "flex" }}>{profile.subtitle}</div>
          </div>
          <div style={{ display: "flex", flex: 1, alignItems: "flex-end", justifyContent: "center" }}>
            {/* already scaled 10x, so it is shown at its natural size and stays crisp */}
            <img alt="" src={sprite} width={340} height={420} style={{ marginBottom: 6 }} />
          </div>
        </div>
        {/* conveyor belt along the bottom */}
        <div style={{ display: "flex", height: 66, marginLeft: -48, marginRight: -48, borderTop: "6px solid #ff8c00", background: "#14141c" }}>
          {treads.map((i) => (
            <div key={i} style={{ width: 4, height: 60, marginLeft: i === 0 ? 10 : 21, background: "rgba(255,140,0,0.35)" }} />
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "PressStart", data: pixel.buffer.slice(pixel.byteOffset, pixel.byteOffset + pixel.byteLength) as ArrayBuffer, style: "normal", weight: 400 },
        { name: "VT323", data: vt.buffer.slice(vt.byteOffset, vt.byteOffset + vt.byteLength) as ArrayBuffer, style: "normal", weight: 400 },
      ],
    },
  );
}
