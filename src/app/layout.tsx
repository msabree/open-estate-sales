import type { Metadata } from "next";
import { Anton, Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Estate Sales, Unchained — Coming Soon",
  description:
    "The free, modern alternative to EstateSales.net — built for operators who are tired of paying to list their own inventory.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark",
        "h-full",
        "scroll-smooth",
        "antialiased",
        inter.variable,
        anton.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="font-sans relative min-h-full bg-surface text-zinc-100">
        <div className="grain" aria-hidden />
        <div className="relative z-10 flex min-h-full flex-col">{children}</div>
      </body>
    </html>
  );
}
