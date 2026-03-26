import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Gyakusan AI",
  description: "通信制・浪人生向けの逆算スケジュール管理",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="dark">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}

