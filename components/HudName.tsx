"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Always goes to "/". Already on the home page, it scrolls back to the top instead.
export default function HudName({ name }: { name: string }) {
  const pathname = usePathname();
  return (
    <Link
      href="/"
      className="font-pixel text-xs text-orange"
      onClick={(e) => {
        if (pathname === "/") {
          e.preventDefault();
          window.scrollTo({ top: 0 });
        }
      }}
    >
      {name.toUpperCase()}
    </Link>
  );
}
