import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/authContext";
import { FormProvider } from "@/context/formContext";
import ToastProvider from "@/component/common/ToastProvider";
import QueryProvider from "@/lib/providers/tanStackQuery";

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

export const metadata: Metadata = {
  title: "Bug Hive",
  description:
    "BugHive is a structured open source contribution portfolio where every claimed contribution is backed by alive GitHub pull request and reviewed by a project maintainer or senior peer through a structured impact rubric",
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' }, // Great for mobile bookmarks
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        <AuthProvider>
          <FormProvider>
            <QueryProvider>{children}</QueryProvider>
            <ToastProvider />
          </FormProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
