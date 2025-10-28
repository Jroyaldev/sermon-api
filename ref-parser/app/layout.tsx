import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pastor Portal",
  description:
    "A modern planning experience for pastors, worship leaders, and church administrators.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="app-body">{children}</body>
    </html>
  );
}
