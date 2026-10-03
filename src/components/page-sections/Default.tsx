/** @format */

"use client";
import { useTranslations } from "@/providers/TranslationProviders";
import { sanitizeText } from "@/utils/helper";
import { useEffect, useEffectEvent, useMemo, useState } from "react";
import Loader from "../ui/Loader";

const Default = ({ section }: { section: any }) => {
  const { tran } = useTranslations();

  const [mounted, setMounted] = useState(false);

  const handleMounded = useEffectEvent(() => {
    setMounted(true);
  });

  useEffect(() => {
    handleMounded();
  }, []);

  const memoContent = useMemo(() => {
    return sanitizeText(tran(section?.content));
  }, [section?.content, tran]);

  if (!mounted) {
    return <Loader />;
  }

  return (
    <div className="mx-auto my-4 w-full md:w-1/2 lg:my-6">
      <div className="" dangerouslySetInnerHTML={{ __html: memoContent }}></div>
    </div>
  );
};

export default Default;
