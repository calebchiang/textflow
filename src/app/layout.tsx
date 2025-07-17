import type { Metadata } from "next";
import { Geist, Geist_Mono, Open_Sans  } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TextFlow — SMS Marketing Made Simple",
  description: "TextFlow helps small businesses grow their subscriber list and send SMS campaigns effortlessly.",
  icons: {
    icon: "/logo_4.png", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable} antialiased bg-zinc-50`}>
        <Navbar />
        <Sidebar />
        {children}
      </body>
    </html>
  );
}