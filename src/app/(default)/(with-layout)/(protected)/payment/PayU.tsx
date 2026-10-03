/** @format */
"use client";
import { useTranslations } from "@/providers/TranslationProviders";
import { PayUConfigTypes } from "@/types/payment";
import React, { useEffect, useRef } from "react";

type PayUProps = {
  config: PayUConfigTypes | null;
};

const PayU: React.FC<PayUProps> = ({ config }) => {
  const { tran } = useTranslations();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (config?.params?.paymentData?.hash && formRef.current) {
      formRef.current.submit();
    }
  }, [config]);

  if (!config?.params?.paymentData?.hash) return null;

  return (
    config?.params?.paymentData?.hash && (
      <div className="mx-auto flex min-h-screen w-full flex-col items-center justify-center p-6">
        <div className="w-full max-w-md rounded border p-6 shadow-lg">
          <form
            ref={formRef}
            action={config?.params?.requestUrl}
            method="POST"
            id="payu-form"
          >
            {Object.entries(config?.params?.paymentData).map(([key, value]) => (
              <input key={key} type="hidden" name={key} value={String(value)} />
            ))}
          </form>
          <p className="mt-4 text-center text-sm text-gray-500">
            {tran("Please wait while we redirect you to PayU.")}
          </p>
        </div>
      </div>
    )
  );
};

export default PayU;
