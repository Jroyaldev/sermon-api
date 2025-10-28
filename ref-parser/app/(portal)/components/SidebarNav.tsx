"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Sermons", href: "/sermons" },
  { label: "Services", href: "/services" },
  { label: "Worship", href: "/worship" },
  { label: "Volunteers", href: "/volunteers" },
  { label: "Insights", href: "/insights" },
  { label: "Settings", href: "/settings" },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="sidebar__nav">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item${isActive ? " nav-item--active" : ""}`}
          >
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
