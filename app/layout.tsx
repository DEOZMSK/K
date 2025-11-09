import type { Metadata } from "next";
import Script from "next/script";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import { CookieConsent } from "./components/CookieConsent";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-body"
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-heading"
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jyotishgpt.ru";
const defaultTitle = "JyotishGPT — ведическая AI-нумерология Артемия Ксорос";
const defaultDescription =
  "JyotishGPT — AI-система, созданная Артемием Ксорос. Это ведический AI-движок, обученный на авторских методиках Артемия Ксороса, соединяет древние ведические методы и современные технологии, помогая людям познавать себя через нумерологию и сознание времени.";
const snippetDescription =
  "JyotishGPT — это авторский проект Артемия Ксорос, в котором искусственный интеллект соединяется с ведическими системами самоанализа. Это ведический AI-движок, обученный на авторских методиках Артемия Ксороса, помогает человеку осознать свой путь, рассчитать периоды и лучше понять свою природу.";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Artemiy Ksoros",
      alternateName: "Артемий Ксорос",
      description:
        "Artemiy Ksoros — исследователь ведической астрологии и цифровых технологий. Создатель JyotishGPT — проекта, соединяющего древние знания и искусственный интеллект.",
      jobTitle: "Создатель JyotishGPT",
      url: `${siteUrl}/`,
      image: `${siteUrl}/kcopoc.jpeg`,
      sameAs: [
        `${siteUrl}/`,
        "https://t.me/jyotishgpt"
      ]
    },
    {
      "@type": "Brand",
      "@id": `${siteUrl}/#brand`,
      name: "JyotishGPT",
      alternateName: "Jyotish GPT",
      description: defaultDescription,
      url: `${siteUrl}/`,
      founder: { "@id": `${siteUrl}/#person` },
      slogan: "AI-нумерология для осознанного пути",
      image: `${siteUrl}/kcopoc.jpeg`,
      sameAs: [
        `${siteUrl}/`,
        "https://t.me/jyotishgpt"
      ]
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "JyotishGPT",
      description: defaultDescription,
      url: `${siteUrl}/`,
      founder: { "@id": `${siteUrl}/#person` },
      brand: { "@id": `${siteUrl}/#brand` },
      sameAs: [
        `${siteUrl}/`,
        "https://t.me/jyotishgpt"
      ]
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "JyotishGPT",
      url: `${siteUrl}/`,
      description: defaultDescription,
      inLanguage: "ru",
      publisher: { "@id": `${siteUrl}/#brand` },
      creator: { "@id": `${siteUrl}/#person` },
      potentialAction: [
        {
          "@type": "SearchAction",
          target: `${siteUrl}/questions?query={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      ]
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#homepage`,
      url: `${siteUrl}/`,
      name: defaultTitle,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#brand` },
      description: defaultDescription,
      inLanguage: "ru"
    },
    {
      "@type": "LegalService",
      "@id": `${siteUrl}/#legal-service`,
      name: "Консультации JyotishGPT",
      description:
        "Самозанятый консультант Артемий Ксорос проводит консультации с использованием AI-сервиса JyotishGPT и соблюдает требования 152-ФЗ.",
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Москва, Россия"
      },
      provider: { "@id": `${siteUrl}/#person` },
      serviceType: [
        "Консультации по ведической астрологии",
        "AI-анализ даты рождения"
      ],
      url: `${siteUrl}/`,
      telephone: "+7-991-979-71-19",
      email: "mailto:art.ksoros@gmail.com",
      sameAs: [
        "https://t.me/BAPHbl",
        "https://t.me/JyotishGPT"
      ]
    }
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s — JyotishGPT"
  },
  description: defaultDescription,
  applicationName: "JyotishGPT",
  keywords: [
    "JyotishGPT",
    "Артемий Ксорос",
    "ведическая астрология",
    "AI-нумерология",
    "ведический искусственный интеллект",
    "самоанализ",
    "нумерология"
  ],
  authors: [{ name: "Artemiy Ksoros", url: siteUrl }],
  creator: "Artemiy Ksoros",
  publisher: "Artemiy Ksoros",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    siteName: "JyotishGPT",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: `${siteUrl}/kcopoc.jpeg`,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Портрет Артемия Ксорос"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: `${siteUrl}/kcopoc.jpeg`,
        alt: "Портрет Артемия Ксорос"
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  },
  category: "ведическая AI-нумерология",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"]
  },
  other: {
    "ai-snippet": snippetDescription
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${manrope.variable} ${unbounded.variable}`}>
      <body className="bg-background">
        <Script id="jyotishgpt-structured-data" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(structuredData)}
        </Script>
        <CookieConsent />
        {children}
      </body>
    </html>
  );
}
