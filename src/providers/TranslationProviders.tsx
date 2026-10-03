"use client";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";

interface TranslationContextType {
  translations: Record<string, string>;
  tran: (key: string) => string;
  locale: string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined,
);

export const TranslationProvider = ({
  children,
  translations,
  locale,
}: {
  children: ReactNode;
  translations: Record<string, string>;
  locale: string;
}) => {
  const tran = useCallback(
    (key: string) => {
      return (typeof translations === "object" && translations[key]) || key;
    },
    [translations],
  );

  const value = useMemo(
    () => ({
      translations,
      tran,
      locale,
    }),
    [translations, tran, locale],
  );

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslations = () => {
  const ctx = useContext(TranslationContext);
  if (!ctx)
    throw new Error("useTranslations must be used within TranslationProvider");
  return ctx;
};
