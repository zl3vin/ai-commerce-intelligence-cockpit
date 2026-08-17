"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Radar,
  MessagesSquare,
  Swords,
  Link2,
  Lightbulb,
  Gauge,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

const NAV = [
  { href: "/", label: "Übersicht", icon: LayoutDashboard },
  { href: "/commerce", label: "Commerce", icon: ShoppingCart },
  { href: "/ai-visibility", label: "KI-Sichtbarkeit", icon: Radar },
  { href: "/prompts", label: "Prompts", icon: MessagesSquare },
  { href: "/competitors", label: "Wettbewerber", icon: Swords },
  { href: "/sources", label: "Quellen", icon: Link2 },
  { href: "/ai-insights", label: "KI-Insights", icon: Lightbulb },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {NAV.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={clsx(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-navy-700/70 text-white"
                : "text-navy-100/70 text-slate-300 hover:bg-navy-800/60 hover:text-white"
            )}
          >
            <Icon
              size={17}
              strokeWidth={2}
              className={clsx(active ? "text-accent-teal" : "text-slate-400 group-hover:text-accent-teal")}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar trigger */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between bg-navy-950 px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-teal/20">
            <Gauge size={16} className="text-accent-teal" />
          </div>
          <span className="font-display text-sm font-semibold tracking-tight text-white">
            NORTHWEAR Cockpit
          </span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          aria-label="Navigation umschalten"
          className="rounded-md p-1.5 text-slate-300 hover:bg-navy-800"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-14 flex h-[calc(100%-3.5rem)] w-64 flex-col bg-navy-950 pt-4 shadow-pop">
            <NavLinks onNavigate={() => setOpen(false)} />
            <SidebarFooter />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-navy-950 lg:flex">
        <div className="flex h-16 items-center gap-2.5 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-teal/20">
            <Gauge size={18} className="text-accent-teal" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-[13px] font-semibold tracking-tight text-white">
              NORTHWEAR
            </div>
            <div className="text-[11px] font-medium tracking-wide text-slate-400">
              Intelligence Cockpit
            </div>
          </div>
        </div>
        <div className="mx-5 mb-4 h-px bg-white/10" />
        <NavLinks />
        <SidebarFooter />
      </aside>
    </>
  );
}

function SidebarFooter() {
  return (
    <div className="mx-3 mb-5 mt-6 flex flex-col gap-2.5">
      <a
        href="/methodology"
        className="rounded-lg border border-white/10 px-3 py-2 text-center text-[11px] font-semibold text-slate-300 hover:bg-navy-800/60 hover:text-white"
      >
        Methodik
      </a>
      <div className="rounded-lg border border-white/10 bg-navy-900/60 p-3">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-amber-400/90">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          Synthetische Demo-Daten
        </div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
          Alle Kennzahlen basieren auf simulierten Testdaten für Portfolio-Zwecke — keine echten Unternehmensdaten.
        </p>
      </div>
    </div>
  );
}
