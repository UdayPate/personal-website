"use client";

import { useEffect } from "react";

// The browser's Back/Forward buttons fire `popstate`. We note that on `window`
// so the home page knows its scroll position should be restored (see ScrollMemory).
export default function NavTracker() {
  useEffect(() => {
    const onPop = () => {
      (window as unknown as { __udayBack?: boolean }).__udayBack = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return null;
}
