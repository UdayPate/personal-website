import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import Hud from "@/components/Hud";
import NavTracker from "@/components/NavTracker";
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
  title: "Uday Patel | Udayverse",
  description:
    "Engineer by training, product thinker by habit. I build systems that people actually use.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${pixel.variable} ${body.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <Hud />
        <NavTracker />
        {children}
      </body>
    </html>
  );
}
