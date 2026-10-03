/** @format */
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "@/providers/TranslationProviders";

import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { setLocaleCookies } from "@/hooks/server/helper";
import { cn } from "@/utils/cn";
import { useEffect, useMemo } from "react";

type Props = {
  className?: string;
};

export default function SelectLanguage({ className }: Props) {
  const { locale } = useTranslations();
  const { data: langData } = useGetQuery({
    url: "/langs",
  });

  const handleLanguageChange = async (item: any) => {
    await setLocaleCookies(item.code);
    window.location.reload();
  };

  const currentLang = useMemo(
    () => langData?.find((item: any) => item.code === locale),
    [langData, locale],
  );

  useEffect(() => {
    if (locale === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }, [locale]);

  if (!langData || langData.length <= 1) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus-visible:outline-none">
        <button
          className={cn(
            "bg-primary/20 rounded border border-slate-400 px-2 py-1 text-sm",
            className,
          )}
        >
          {currentLang?.name}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {langData?.map((item: any) => (
          <DropdownMenuItem
            className={cn(
              "text-sm text-black",
              currentLang?.code === item.code && "bg-primary/20",
            )}
            key={item.code}
            onClick={() => handleLanguageChange(item)}
          >
            {item.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
