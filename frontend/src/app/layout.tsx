import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PrelineScript from "./components/PrelineScript"
import "./globals.css";
import Image from "next/image";

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
      <body className={inter.className}>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <div className="max-w-7xl w-full items-center justify-between flex">
              <Image
                  src="/logo.svg"
                  alt="GitReal Logo"
                  width={100}
                  height={24}
                  priority
              />
          </div>
            {children}
          <div className="grid">
            {/*Footer*/}
          </div>
      </main>
      </body>
      <PrelineScript/>
    </html>
  );
}
