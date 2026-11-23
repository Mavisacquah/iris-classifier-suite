import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Iris Lab | Classification Studio",
  description: "An interactive scientific dashboard for Iris species classification.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
