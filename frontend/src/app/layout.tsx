import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PrelineScript from "./components/PrelineScript"
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GitReal",
  description: "Time to git real",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <PrelineScript />
    </html>
  );
}
