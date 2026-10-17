"use client";

import { usePathname } from "next/navigation";

// First focusable element on every page; visible only when focused.
export default function SkipLink() {
  const pathname = usePathname();
  const [href, label] =
    pathname === "/"
      ? ["#aislesave", "Skip to projects"]
      : pathname === "/projects"
        ? ["#projects-list", "Skip to projects"]
        : ["#content", "Skip to content"];
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[100] focus:border-4 focus:border-green focus:bg-background focus:px-3 focus:py-2 focus:font-pixel focus:text-xs focus:text-green"
    >
      {label}
    </a>
  );
}
