import type { ReactNode } from "react";
import Header from "./components/Header";
import SidebarNav from "./components/SidebarNav";
import VerseCard from "./components/VerseCard";
import { inspirationalVerse } from "../data/mock-data";

export default function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="portal-shell">
      <aside className="sidebar">
        <div className="sidebar__logo">Pastor Portal</div>
        <div className="sidebar__section-title">Navigation</div>
        <SidebarNav />
        <VerseCard verse={inspirationalVerse} />
      </aside>
      <div className="main-content">
        <Header />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
