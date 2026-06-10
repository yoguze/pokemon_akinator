import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ポケモンアキネーター",
  description: "AIが思い浮かべたポケモンを質問で当てるゲーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
