import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import Hud from "@/components/Hud";
import "./globals.css";

// next/font downloads these fonts at build time and serves them from our own
// site (no request to Google at runtime). Each one becomes a CSS variable.
const pixel = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
});

const body = VT323({
  weight: "400",
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Udayverse",
  description:
    "Uday's portfolio: a retro pixel-game data pipeline from messy data to something useful.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${pixel.variable} ${body.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <Hud />
        {children}
      </body>
    </html>
  );
}
