import { useTranslations } from "@/providers/TranslationProviders";
import React from "react";

interface LabelProps {
  title: string;
  name: string;
  required?: boolean;
  className?: string;
}
export const Label: React.FC<LabelProps> = ({
  title,
  name,
  className,
  required,
}) => {
  const { tran } = useTranslations();
  return (
    <label htmlFor={name} className={`text-sm font-medium ${className}`}>
      {tran(title)} {required && <span className="text-red-500">*</span>}
    </label>
  );
};
