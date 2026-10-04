import { getLocaleCookies } from "@/hooks/server/helper";
import GlobalProvider from "@/providers/GlobalProvider";
import "@/styles/globals.css";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  manifest: "/manifest.ts",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocaleCookies();

  return (
    <html lang={locale || "en"} suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/Satoshi-Variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <GlobalProvider>{children}</GlobalProvider>
      </body>
    </html>
  );
}
