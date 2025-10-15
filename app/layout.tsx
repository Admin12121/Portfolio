import type { Metadata, Viewport } from "next";
import { RootProvider } from "fumadocs-ui/provider";
import "@/style/globals.css";
import localFont from "next/font/local";

import { META_THEME_COLORS, SITE_INFO } from "@/config/site";
import { USER } from "@/features/profile/data/user";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const geistSansLight = localFont({
  src: "./fonts/AtAero-Light.woff2",
  variable: "--font-geist-sans-light",
  weight: "300",
});

const geistSansRegular = localFont({
  src: "./fonts/AtAero-Regular.woff2",
  variable: "--font-geist-sans-regular",
  weight: "400",
});

const geistSansMedium = localFont({
  src: "./fonts/AtAero-Medium.woff2",
  variable: "--font-geist-sans-medium",
  weight: "500",
});

const geistSansSemibold = localFont({
  src: "./fonts/AtAero-Semibold.woff2",
  variable: "--font-geist-sans-semibold",
  weight: "600",
});

const geistSansBold = localFont({
  src: "./fonts/AtAero-Bold.woff2",
  variable: "--font-geist-sans-bold",
  weight: "700",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_INFO.url),
  alternates: {
    canonical: "/",
  },
  title: {
    template: `%s – ${SITE_INFO.name}`,
    default: `${USER.displayName} – ${USER.jobTitle}`,
  },
  description: SITE_INFO.description,
  keywords: SITE_INFO.keywords,
  authors: [
    {
      name: "admin12121",
      url: SITE_INFO.url,
    },
  ],
  creator: "admin12121",
  openGraph: {
    siteName: SITE_INFO.name,
    url: "/",
    type: "profile",
    firstName: USER.firstName,
    lastName: USER.lastName,
    username: USER.username,
    gender: USER.gender,
    images: [
      {
        url: SITE_INFO.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_INFO.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@vicky_tajpuriya",
    images: [SITE_INFO.ogImage],
  },
  // icons: {
  //   icon: [
  //     {
  //       url: "https://assets.chanhdai.com/images/favicon.ico",
  //       sizes: "any",
  //     },
  //     {
  //       url: "https://assets.chanhdai.com/images/favicon.svg",
  //       type: "image/svg+xml",
  //     },
  //   ],
  //   apple: {
  //     url: "https://assets.chanhdai.com/images/apple-touch-icon.png",
  //     type: "image/png",
  //     sizes: "180x180",
  //   },
  // },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: META_THEME_COLORS.light,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSansLight.variable} ${geistSansRegular.variable} ${geistSansMedium.variable} ${geistSansSemibold.variable} ${geistSansBold.variable}`}
      >
        <RootProvider>
          <Navbar />
          {children}
          <Footer />
        </RootProvider>
      </body>
    </html>
  );
}
