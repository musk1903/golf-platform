import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Golf Platform",
  description: "Golf score tracking platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-screen bg-[#0F2E1D] text-white antialiased flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto px-6 py-8">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}

