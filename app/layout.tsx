import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Github } from "lucide-react";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import Header from "./_components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { ApplicationProvider } from "@/context/ApplicationContext";
import { CandidateProvider } from "@/context/CandidateContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Candiview",
  description: "Developed by empsloc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ApplicationProvider>
              <CandidateProvider>
                <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-6 sm:py-8 md:py-12">
                  <Header />
                  {/* Page content */}
                  {children}
                </main>

                {/* Footer */}
                <footer className="w-full border-t py-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                  Developer:{" "}
                  <Link
                    className="flex gap-1 items-center"
                    target="_blank"
                    href="https://github.com/empsloc"
                  >
                    <Github size={16} />
                    <div className="hover:underline">empsloc</div>
                  </Link>
                </footer>
              </CandidateProvider>
            </ApplicationProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
