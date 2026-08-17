"use client";

import { Info } from "lucide-react";
import { useState, useId } from "react";
import clsx from "clsx";

export default function InfoTooltip({
  children,
  side = "bottom",
}: {
  children: React.ReactNode;
  side?: "bottom" | "top";
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-describedby={id}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-ink-400 hover:text-accent-teal focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal"
      >
        <Info size={13} />
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className={clsx(
            "absolute z-50 w-60 rounded-md border border-ink-300/20 bg-navy-950 px-3 py-2 text-[11.5px] leading-relaxed text-slate-100 shadow-pop",
            side === "bottom" ? "top-6" : "bottom-6",
            "left-1/2 -translate-x-1/2"
          )}
        >
          {children}
        </span>
      )}
    </span>
  );
}
