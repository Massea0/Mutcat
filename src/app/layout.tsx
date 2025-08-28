import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { QueryProvider } from '@/providers/query-provider'
import { I18nProvider } from '@/lib/i18n/context'

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://muctat.sn'),
  title: {
    default: "MUCTAT - Ministère de l'Urbanisme du Sénégal",
    template: "%s | MUCTAT"
  },
  description: "Site officiel du Ministère de l'Urbanisme, des Collectivités Territoriales et de l'Aménagement des Territoires de la République du Sénégal. Découvrez nos projets, actualités et services.",
  keywords: "MUCTAT, urbanisme, Sénégal, aménagement territoire, collectivités territoriales, Dakar, logement social, smart cities, développement urbain",
  authors: [{ name: "MUCTAT", url: "https://muctat.sn" }],
  creator: "MUCTAT",
  publisher: "République du Sénégal",
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/fr',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: "MUCTAT - Ministère de l'Urbanisme du Sénégal",
    description: "Bâtir ensemble le Sénégal de demain. Projets urbains, logements sociaux, aménagement du territoire.",
    url: "https://muctat.sn",
    siteName: "MUCTAT",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MUCTAT - Ministère de l\'Urbanisme du Sénégal',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MUCTAT - Ministère de l'Urbanisme du Sénégal",
    description: "Site officiel du Ministère de l'Urbanisme, des Collectivités Territoriales et de l'Aménagement des Territoires",
    site: "@MUCTAT_SN",
    creator: "@MUCTAT_SN",
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
  category: 'government',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <I18nProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
          <Toaster position="top-right" richColors />
        </I18nProvider>
      </body>
    </html>
  );
}