import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://chrono.arthurp.fr";
const SITE_NAME = "Chrono";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Chronomètre en ligne gratuit | Minuteur & Compte à rebours",
    template: "%s | Chrono",
  },
  description:
    "Chronomètre en ligne gratuit et minuteur professionnel. Précision à la milliseconde, tours/laps, minuteurs multiples simultanés, thème sombre, raccourcis clavier. Rapide, moderne et sans publicité.",
  keywords: [
    "chronomètre en ligne",
    "chronomètre en ligne gratuit",
    "chronomètre gratuit",
    "minuteur en ligne",
    "minuteur en ligne gratuit",
    "timer en ligne",
    "timer gratuit",
    "stopwatch",
    "stopwatch online",
    "compte à rebours",
    "compte à rebours en ligne",
    "chrono en ligne",
    "minuteur gratuit",
    "chronomètre précis",
    "chronomètre milliseconde",
    "online timer",
    "online stopwatch",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "fr-FR": SITE_URL,
    },
  },
  openGraph: {
    title: "Chronomètre en ligne gratuit | Minuteur & Compte à rebours",
    description:
      "Chronomètre et minuteur en ligne : précis, rapide, gratuit. Tours/laps, minuteurs multiples, thème sombre, raccourcis clavier.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Chronomètre en ligne gratuit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chronomètre en ligne gratuit | Minuteur & Chrono",
    description:
      "Chronomètre et minuteur en ligne : précis, rapide, gratuit. Tours/laps, minuteurs multiples.",
    images: ["/icon-512.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  category: "utility",
  classification: "Utility, Productivity",
};

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Chronomètre en ligne gratuit",
  alternateName: ["Chrono", "Minuteur en ligne", "Timer en ligne"],
  description:
    "Chronomètre en ligne gratuit et minuteur professionnel. Précision à la milliseconde, tours/laps, minuteurs multiples simultanés.",
  url: SITE_URL,
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires JavaScript",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
  featureList: [
    "Chronomètre précis à la milliseconde",
    "Fonction tours/laps avec historique",
    "Minuteur avec compte à rebours",
    "Minuteurs multiples simultanés",
    "Alerte sonore en fin de minuteur",
    "Thème clair et sombre",
    "Raccourcis clavier",
    "Plein écran",
    "Copier le temps en un clic",
    "Sauvegarde automatique",
    "Fonctionne hors ligne",
  ],
  inLanguage: "fr",
  isAccessibleForFree: true,
  screenshot: `${SITE_URL}/icon-512.png`,
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Comment utiliser le chronomètre en ligne ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cliquez sur le bouton Démarrer ou appuyez sur la barre Espace pour lancer le chronomètre. Utilisez les raccourcis clavier : Espace (start/pause), L (tour), R (reset), C (copier le temps).",
      },
    },
    {
      "@type": "Question",
      name: "Le chronomètre est-il gratuit ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, le chronomètre et le minuteur sont 100% gratuits, sans publicité et sans inscription. Ils fonctionnent directement dans votre navigateur.",
      },
    },
    {
      "@type": "Question",
      name: "Puis-je utiliser plusieurs minuteurs en même temps ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, vous pouvez créer et exécuter autant de minuteurs simultanés que vous le souhaitez. Chaque minuteur fonctionne de manière indépendante avec son propre compte à rebours.",
      },
    },
    {
      "@type": "Question",
      name: "Le chronomètre fonctionne-t-il en arrière-plan ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, le chronomètre et les minuteurs continuent de fonctionner même si vous changez d'onglet ou réduisez la fenêtre. Le temps est sauvegardé automatiquement.",
      },
    },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Accueil",
      item: SITE_URL,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
