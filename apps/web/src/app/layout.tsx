import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KrishiSetu (ಕೃಷಿಸೇತು) | Farm Intelligence & Autonomous Decision Ecosystem",
  description: "Unified soil-to-seed intelligence, disease pathology, satellite NDVI, and APMC market arbitrage for smallholder farmers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-krishi-darkbg text-slate-900 dark:text-slate-100 antialiased selection:bg-krishi-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
