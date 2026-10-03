/** @format */

"use client";
import { Button } from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import OtpInput from "@/components/ui/OtpInput";
import OtpTimer from "@/components/ui/OTPTimer";
import { useOtpHandler } from "@/hooks/useOtpHandler";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { AuthStore } from "@/stores/auth";
import { AppInfoType } from "@/types";
import { UserType } from "@/types/user";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";

const OtpForm: React.FC<{ requestUrl: string }> = ({ requestUrl }) => {
  const searchParams = useSearchParams();

  const { user }: { user: UserType; getUser: () => Promise<UserType> } =
    useAuthStore((state: any) => state);

  const {
    otpInputHandler,
    setOtpInputHandler,
    otpBreakTime,
    handleSendOtp,
    handleVerify,
    isLoading,
  } = useOtpHandler(requestUrl);

  const { appInfo }: { appInfo: AppInfoType } = useAuthStore(
    (state: AuthStore) => state,
  );

  const emailVerification =
    appInfo?.service_switch?.system_config?.email_verification?.is_enabled;
  const phoneVerification =
    appInfo?.service_switch?.system_config?.phone_verification?.is_enabled;

  const signinCount = Cookies.get("sign_in_count");

  let phone = searchParams.get("phone");
  if (phone) {
    phone = `+${phone.replace(/\s+/g, "")}`;
  }

  const otp_expire_key =
    searchParams.get("email") ||
    phone ||
    (emailVerification ? user?.email : "") ||
    (phoneVerification ? user?.phone : "");

  useEffect(() => {
    if (
      phone &&
      phoneVerification &&
      !user?.phone_verified_at &&
      signinCount != "3"
    ) {
      Cookies.set("sign_in_count", "3");
    }
    if (emailVerification && !user?.email_verified_at && signinCount != "2") {
      Cookies.set("sign_in_count", "2");
    }
  }, [
    signinCount,
    user?.phone_verified_at,
    phone,
    phoneVerification,
    user?.email_verified_at,
    emailVerification,
  ]);

  const { tran } = useTranslations();

  return (
    <Suspense fallback={<Loader />}>
      <form
        className="otp-form relative flex flex-1 flex-col items-center justify-center gap-4 pt-8"
        onSubmit={(e) => handleVerify(e, otp_expire_key)}
        tabIndex={0}
      >
        <OtpInput
          setIsComplete={(isValue) =>
            setOtpInputHandler((prev) => ({
              ...prev,
              isComplete: isValue,
            }))
          }
          setIsInvalid={(isValue) =>
            setOtpInputHandler((prev) => ({
              ...prev,
              isInvalid: isValue,
            }))
          }
          setOtp={(value) =>
            setOtpInputHandler((prev) => ({
              ...prev,
              otp: value,
            }))
          }
          otp={otpInputHandler.otp}
          isInvalid={otpInputHandler.isInvalid}
          isReset={otpInputHandler.isReset}
        />

        <OtpTimer
          onClick={() => handleSendOtp(otp_expire_key)}
          loading={isLoading}
          time={otpBreakTime}
          otpTimerKey={otp_expire_key}
        />

        {otpInputHandler.isInvalid && (
          <p className="text-center text-sm text-red-500" role="alert">
            {tran("Please enter a valid OTP code")}
          </p>
        )}

        <div className="flex">
          <Button type="submit" loading={isLoading}>
            {tran("Verify")}
          </Button>
        </div>
      </form>
    </Suspense>
  );
};

export default OtpForm;
