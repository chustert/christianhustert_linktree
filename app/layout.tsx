import type { Metadata } from "next";
import "./globals.css";
import { Ubuntu } from 'next/font/google'

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Christian Hustert",
  description: "Personal homepage of Christian Hustert.",
};

const themeScript = `
  (() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);

      document.documentElement.classList.toggle("dark", isDark);
    } catch {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${ubuntu.className} bg-[#ffd166] transition-colors duration-[400ms] dark:bg-[#f3595a] min-h-dvh`}>{children}</body>
    </html>
  );
}