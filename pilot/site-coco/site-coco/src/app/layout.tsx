import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react"
import localFont from "next/font/local";
import { Glass_Antiqua, Work_Sans } from "next/font/google";
import BottomNavbar from "@/components/BottomNavbar";
import { NextUIProvider } from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Coco AI",
  description: "AI styling App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>

      </head>
      <Providers>
        <body className={cn(
          'min-h-screen font-sans antialias grainy flex flex-col',
          inter.className
        )}>
          <Navbar />
          <main className="flex-grow">
            <NextUIProvider>
          {children}
          </NextUIProvider>
          <Analytics />
          </main>
           {/* <BottomNavbar/> */}
        </body>
      </Providers>
     
    </html>
  );
}
