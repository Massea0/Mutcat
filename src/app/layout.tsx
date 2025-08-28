import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from 'sonner';

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "MUCTAT - Ministère de l'Urbanisme du Sénégal",
  description: "Site officiel du Ministère de l'Urbanisme, des Collectivités Territoriales et de l'Aménagement des Territoires de la République du Sénégal",
  keywords: "MUCTAT, urbanisme, Sénégal, aménagement territoire, collectivités territoriales, Dakar",
  authors: [{ name: "MUCTAT" }],
  openGraph: {
    title: "MUCTAT - Ministère de l'Urbanisme du Sénégal",
    description: "Site officiel du Ministère de l'Urbanisme, des Collectivités Territoriales et de l'Aménagement des Territoires",
    url: "https://muctat.sn",
    siteName: "MUCTAT",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MUCTAT - Ministère de l'Urbanisme du Sénégal",
    description: "Site officiel du Ministère de l'Urbanisme, des Collectivités Territoriales et de l'Aménagement des Territoires",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 pt-20">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}