"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// A button that shows a small retro tooltip on mouse hover, on keyboard focus
// and on tap (touch screens can't hover). The same text is the aria-label, so
// the visible tooltip itself is hidden from screen readers to avoid a repeat.
export default function IconTip({
  text,
  align = "center",
  children,
}: {
  text: string;
  align?: "left" | "center" | "right";
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const pointer = useRef<string>("mouse");

  // Tapping elsewhere or pressing Escape closes it.
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const place = align === "left" ? "left-0" : align === "right" ? "right-0" : "left-1/2 -translate-x-1/2";

  return (
    <span
      ref={rootRef}
      className="relative block"
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
    >
      <button
        type="button"
        aria-label={text}
        aria-expanded={open}
        className="block cursor-help"
        onPointerDown={(e) => (pointer.current = e.pointerType)}
        onFocus={() => pointer.current !== "touch" && setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => (pointer.current === "mouse" ? true : !o))}
      >
        {children}
      </button>
      {open && (
        <span
          aria-hidden
          className={`pointer-events-none absolute top-full z-40 mt-3 w-56 border-2 border-cyan bg-background px-2 py-1 text-left text-lg leading-tight text-foreground shadow-[3px_3px_0_0_var(--cyan)] ${place}`}
        >
          {text}
        </span>
      )}
    </span>
  );
}
