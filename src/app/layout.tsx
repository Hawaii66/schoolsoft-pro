import { Toaster } from "@/components/shadcn/ui/toaster";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SchoolSoft Pro",
  description: "Get a better schoolsoft experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen flex">
        {children} <Toaster />
      </body>
    </html>
  );
}
