import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CommandPalette } from "@/features/command-palette/CommandPalette";

const font = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sonata | Music Capsule",
  description: "A premium personal music archive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${font.variable} antialiased min-h-screen flex flex-col`}>
        <CommandPalette />
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8 md:py-16">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8 mt-auto text-center border-t border-[#1a1a1a]">
          <p className="text-neutral-500 text-sm tracking-wide">
            This project is open source. <a href="https://github.com/luvices/sonata.git" target="_blank" rel="noreferrer" className="text-white hover:underline underline-offset-4 transition-colors">GitHub Repository</a>
          </p>
        </footer>
      </body>
    </html>
  );
}
