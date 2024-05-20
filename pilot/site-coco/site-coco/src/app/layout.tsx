import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react"
import { ChakraProvider } from '@chakra-ui/react'

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Coco AI",
  description: "AI styling App",
};
const siteURL = process.env.REACT_APP_SITE_URL


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
          <ChakraProvider>
          {children}
          </ChakraProvider>
          <Analytics />
          </main>
           {/* <BottomNavbar/> */}
        </body>
      </Providers>
     
    </html>
  );
}
