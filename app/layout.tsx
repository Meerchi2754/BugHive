import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/authContext";
import { FormProvider } from "@/context/formContext";
import ToastProvider from "@/component/common/ToastProvider";
import QueryProvider from "@/lib/providers/tanStackQuery";
import { ThemeProvider } from "@/context/themeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bughive.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BugHive — Open Source Contribution & Reputation Platform",
    template: "%s | BugHive",
  },
  description:
    "BugHive is a structured open-source contribution portfolio where every claimed contribution is verified by live GitHub pull requests and reviewed by project maintainers through structured impact rubrics.",
  keywords: [
    "open source portfolio",
    "developer reputation",
    "GitHub contribution proof",
    "pull request verification",
    "developer portfolio",
    "code review impact score",
    "BugHive",
    "open source resume",
    "verified developer proof of work",
  ],
  authors: [{ name: "BugHive Team", url: siteUrl }],
  creator: "BugHive",
  publisher: "BugHive",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "BugHive",
    title: "BugHive — Open Source Contribution & Reputation Platform",
    description:
      "Structured open-source portfolio backed by live GitHub pull requests and peer review. Build your verified proof of work.",
    images: [
      {
        url: "/Bughive.png",
        width: 1200,
        height: 630,
        alt: "BugHive — Verified Developer Proof of Work",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BugHive — Open Source Contribution & Reputation Platform",
    description:
      "Structured open-source portfolio backed by live GitHub pull requests and peer review. Build your verified proof of work.",
    images: ["/Bughive.png"],
    creator: "@bughive",
  },
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
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icon.png", sizes: "180x180", type: "image/png" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "BugHive",
      description:
        "Structured open-source contribution portfolio and reputation platform.",
      publisher: {
        "@type": "Organization",
        name: "BugHive",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/icon.png`,
        },
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#software`,
      name: "BugHive",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Verify GitHub contributions, track impact scores, and build an authenticated open-source developer portfolio.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <FormProvider>
              <QueryProvider>{children}</QueryProvider>
              <ToastProvider />
            </FormProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
