/** @format */

import {
  ONBOARDING_POSITION,
  ONBOARDING_STEPS,
  PROTECTED_PATHS,
} from "@/configs";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { AppInfoType, RecaptchaType } from "@/types";
import { UserType } from "@/types/user";
import { emailOrPhone } from "@/utils/helper";
import { UseMutateFunction } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useQueryMutation } from "./mutate/useQueryMutation";

type useAuthHandlerTypes = {
  recaptcha: RecaptchaType;
  authConfig: {
    recaptcha: RecaptchaType;
    is_phone_enabled: boolean;
    is_email_enabled: boolean;
    is_kyc_enabled: boolean;
    is_agreement_enabled: boolean;
  };
  sendOTP: UseMutateFunction<
    AxiosResponse<any, any>,
    any,
    {
      [key: string]: any;
    },
    unknown
  >;
  verifyOTP: UseMutateFunction<
    AxiosResponse<any, any>,
    any,
    {
      [key: string]: any;
    },
    unknown
  >;
  otpSendLoading: boolean;
  verifyLoading: boolean;
  redirect: (user: UserType) => string;
  setKycWaitingStep: () => void;
  setOtpBreakTimer: (otp_expire_key: string) => void;
  authProviders: (providers: any[]) => any[];
};
export const useAuthHandler = () => {
  const { appInfo }: { appInfo: AppInfoType; user: UserType } = useAuthStore(
    (state) => state,
  );
  const path = usePathname();

  const authConfig = useMemo(() => {
    return {
      recaptcha: appInfo?.extensions?.recaptcha,
      is_phone_enabled:
        appInfo?.service_switch?.system_config?.phone_verification?.is_enabled,
      is_email_enabled:
        appInfo?.service_switch?.system_config?.email_verification?.is_enabled,
      is_kyc_enabled:
        appInfo?.service_switch?.system_config?.is_kyc_enabled?.is_enabled,
      is_agreement_enabled:
        appInfo?.service_switch?.system_config?.agreement_trams_and_policy
          ?.is_enabled,
    };
  }, [appInfo]);

  // filter enabled auth providers
  const authProviders = useCallback(
    (providers: any[]) => {
      const enabledAuthProviders = appInfo?.application_info?.auth_providers;
      if (!enabledAuthProviders) return [];

      return providers.filter((provider) =>
        enabledAuthProviders.some(
          (p) => p.id === provider.provider && p.is_enabled,
        ),
      );
    },
    [appInfo?.application_info?.auth_providers],
  );

  const { mutate: sendOTP, isLoading: otpSendLoading } = useQueryMutation({
    isPublic: true,
    url: "auth/send-otp",
  });

  const setOtpBreakTimer = (otp_expire_key: string) => {
    const breakTime =
      Number(appInfo?.application_info?.otp?.expire_time || 2) * 60;
    const newExpiry = Date.now() + breakTime * 1000;
    localStorage.setItem(otp_expire_key, newExpiry.toString());
  };

  const redirect = (user: UserType) => {
    const { is_email_enabled, is_phone_enabled, is_kyc_enabled } = authConfig;
    const signinCount = Cookies.get("sign_in_count");

    const needsEmailVerification =
      is_email_enabled && !user?.email_verified_at && user?.email;
    const needsPhoneVerification =
      is_phone_enabled && !user?.phone_verified_at && user?.phone;

    if (needsEmailVerification || needsPhoneVerification) {
      Cookies.set(ONBOARDING_POSITION, ONBOARDING_STEPS.verification.value);

      if (needsEmailVerification) {
        const otpBreakTime = localStorage.getItem(user.email);
        const otpExpired = !otpBreakTime || Number(otpBreakTime) < Date.now();

        if (signinCount === "2" && otpExpired) {
          sendOTP(emailOrPhone(user.email));
        }

        setOtpBreakTimer(user.email);
        return `/verify-otp/?email=${user.email}`;
      }

      // Phone verification step
      if (needsPhoneVerification) {
        const otpBreakTime = localStorage.getItem(user.phone);
        const otpExpired = !otpBreakTime || Number(otpBreakTime) < Date.now();

        if (signinCount === "3" && otpExpired) {
          sendOTP(emailOrPhone(user.phone));
        }

        setOtpBreakTimer(user.phone);
        return `/verify-otp/?phone=${user.phone}`;
      }
    }

    const kycPending = user?.kyc?.status === "pending";
    const kycRejected = user?.kyc?.status === "rejected";
    const waitingStep =
      Cookies.get(ONBOARDING_POSITION) === ONBOARDING_STEPS.waiting.value;

    if (
      is_kyc_enabled &&
      !user?.is_kyc_verified &&
      (kycRejected || !user.kyc)
    ) {
      Cookies.set(ONBOARDING_POSITION, ONBOARDING_STEPS.kyc.value);
      return "/kyc";
    }

    if (is_kyc_enabled && !user?.is_kyc_verified && waitingStep) {
      return "/waiting";
    }

    if (kycPending) {
      Cookies.set(ONBOARDING_POSITION, ONBOARDING_STEPS.waiting.value);
      return "/waiting";
    }

    Cookies.set(ONBOARDING_POSITION, ONBOARDING_STEPS.completed.value);

    const isOnProtectedPath = PROTECTED_PATHS.some(
      (p) => typeof path === "string" && path.startsWith(p),
    );

    if (!isOnProtectedPath) {
      return "/dashboard/profile";
    }
  };

  const setKycWaitingStep = () => {
    Cookies.set(ONBOARDING_POSITION, ONBOARDING_STEPS.waiting.value);
  };

  return {
    authConfig,
    sendOTP,
    otpSendLoading,
    redirect,
    setKycWaitingStep,
    setOtpBreakTimer,
    authProviders,
  } as useAuthHandlerTypes;
};
