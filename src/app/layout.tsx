import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/shell/Sidebar";
import TopBar from "@/components/shell/TopBar";

export const metadata: Metadata = {
  title: "AI Commerce Intelligence Cockpit — NORTHWEAR",
  description:
    "Portfolio-Analytics-Dashboard: klassische E-Commerce-KPIs kombiniert mit AI/GEO-Visibility-Intelligence für die Demo-Marke NORTHWEAR.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="font-sans antialiased">
        <div className="flex min-h-screen bg-surface">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
            <TopBar />
            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              <div className="mx-auto w-full max-w-[1400px]">{children}</div>
            </main>
            <footer className="border-t border-ink-300/20 px-4 py-4 text-center text-xs text-ink-400 sm:px-6 lg:px-8">
              AI Commerce Intelligence Cockpit — Portfolio-Projekt mit synthetischen Demo-Daten. Kein echtes Unternehmen.
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
