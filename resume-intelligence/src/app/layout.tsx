import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AppProviders } from "@/components/providers/AppProviders";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ResumeAI — AI-Based Resume Intelligence Platform",
  description:
    "Get your resume scored, analyzed, and enhanced by AI. Match your resume with job descriptions and download optimized versions.",
  keywords: [
    "resume",
    "AI",
    "resume analysis",
    "job match",
    "ATS",
    "resume optimization",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        {/* Background Mesh */}
        <div className="bg-mesh" aria-hidden="true">
          <div className="floating-orb floating-orb-1" />
          <div className="floating-orb floating-orb-2" />
          <div className="floating-orb floating-orb-3" />
        </div>

        <AppProviders>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
