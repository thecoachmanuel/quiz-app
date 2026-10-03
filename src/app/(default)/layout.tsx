/** @format */

import DynamicFavicon from "@/components/HOC/DynamicFavicon";
import {
  getAppInfo,
  getMenus,
  getPages,
  getTranslations,
} from "@/hooks/server";
import { getLocaleCookies } from "@/hooks/server/helper";
import { AuthStoreProvider } from "@/providers/AuthStoreProviders";
import { ExtensionsProvider } from "@/providers/ExtensionsProvider";
import { MenuProvider } from "@/providers/MenuProvider";
import { PageProvider } from "@/providers/PageProvider";
import { ThemeColorProvider } from "@/providers/ThemeProvider";
import { TranslationProvider } from "@/providers/TranslationProviders";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [pages, info, menu] = await Promise.all([
    getPages(),
    getAppInfo(),
    getMenus(),
  ]);

  const locale = await getLocaleCookies(info?.application_info?.locale);

  const translations = await getTranslations(locale);

  const favicon = info?.application_info?.logo_favicon?.favicon;

  return (
    <TranslationProvider translations={translations} locale={locale}>
      <ThemeColorProvider
        themeColor={info?.application_info?.theme}
        firebaseConfig={info?.firebase}
      >
        <PageProvider pagesData={pages}>
          <MenuProvider menuData={menu}>
            <AuthStoreProvider info={info}>
              <ExtensionsProvider info={info}>
                <DynamicFavicon favicon={favicon}>{children}</DynamicFavicon>
              </ExtensionsProvider>
            </AuthStoreProvider>
          </MenuProvider>
        </PageProvider>
      </ThemeColorProvider>
    </TranslationProvider>
  );
}
