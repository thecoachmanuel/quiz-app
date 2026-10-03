/** @format */

import { getLocaleCookies } from "@/hooks/server/helper";
import GlobalProvider from "@/providers/GlobalProvider";
import "@/styles/globals.css";
import { Metadata } from "next";

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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>
        <GlobalProvider>{children}</GlobalProvider>
      </body>
    </html>
  );
}
