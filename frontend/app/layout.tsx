import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeadDesk Mini",
  description: "Lead capture made simple",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}

        <footer className="mt-auto border-t border-zinc-800 bg-zinc-950 py-4 text-center text-xs text-zinc-500">
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-300"
          >
            Built as part of the Digital Heroes Technical Assessment
          </a>
        </footer>
      </body>
    </html>
  );
}
