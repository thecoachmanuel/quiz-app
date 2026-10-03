/** @format */

import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { AppInfoType } from "@/types";
import { UserType } from "@/types/user";
import { emailOrPhone } from "@/utils/helper";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { useQueryMutation } from "./mutate/useQueryMutation";
import { useAuthHandler } from "./useAuthHandler";

type useOtpHandlerTypes = {
  otpInputHandler: {
    isComplete: boolean;
    isInvalid: boolean;
    otp: string;
    isReset: boolean;
  };

  setOtpInputHandler: Dispatch<
    SetStateAction<{
      isComplete: boolean;
      isInvalid: boolean;
      otp: string;
      isReset: boolean;
    }>
  >;

  otpBreakTime: number;

  setOtpBreakTime: Dispatch<SetStateAction<number>>;

  handleSendOtp: (otp_expire_key: string) => void;

  handleVerify: (
    e: React.FormEvent<HTMLFormElement>,
    otp_expire_key: string,
  ) => void;
  isLoading: boolean;
};
export const useOtpHandler = (requestUrl: string) => {
  const { redirect } = useAuthHandler();
  const { login } = useAuthStore((state: any) => state);
  const { tran } = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const { appInfo, user }: { appInfo: AppInfoType; user: UserType } =
    useAuthStore((state) => state);

  const { getUser }: { user: UserType; getUser: () => Promise<UserType> } =
    useAuthStore((state: any) => state);

  const { mutate: verifyOTP, isLoading } = useQueryMutation({
    isPublic: true,
    url: requestUrl,
  });

  const setOtpBreakTimer = (otp_expire_key: string) => {
    const breakTime =
      Number(appInfo?.application_info?.otp?.expire_time || 2) * 60;
    const newExpiry = Date.now() + breakTime * 1000;
    localStorage.setItem(otp_expire_key, newExpiry.toString());
  };

  const [otpInputHandler, setOtpInputHandler] = useState<{
    isComplete: boolean;
    isInvalid: boolean;
    otp: string;
    isReset: boolean;
  }>({
    isComplete: false,
    isInvalid: false,
    otp: "",
    isReset: false,
  });

  const { mutate: sendOTP } = useQueryMutation({
    isPublic: true,
    url: "auth/send-otp",
  });

  const [otpBreakTime, setOtpBreakTime] = useState(0);

  const handleSendOtp = (otp_expire_key: string) => {
    sendOTP(emailOrPhone(otp_expire_key), {
      onSuccess: (response: any) => {
        toast.success(response?.data?.message);
        setOtpInputHandler((prev) => ({
          ...prev,
          isReset: true,
          isComplete: false,
          isInvalid: false,
        }));
        setOtpBreakTimer(otp_expire_key);
        setOtpBreakTime(Number(localStorage.getItem(otp_expire_key)) || 0);
        if (user) {
          const redirectUrl = redirect(user);
          if (redirectUrl) {
            router.replace(redirectUrl);
          }
        }
      },
    });
  };

  const handleVerify = (
    e: React.FormEvent<HTMLFormElement>,
    otp_expire_key: string,
  ) => {
    e.preventDefault();

    verifyOTP(
      { otp: otpInputHandler.otp, ...emailOrPhone(otp_expire_key) },
      {
        onSuccess: async (response: any) => {
          const updatedUser: UserType = await getUser();
          setOtpInputHandler((prev) => ({
            ...prev,
            isReset: true,
            isComplete: false,
            isInvalid: false,
          }));

          setOtpBreakTime(0);
          const signinCount = Cookies.get("sign_in_count");
          if (updatedUser && signinCount) {
            if (signinCount == "1") {
              Cookies.set("sign_in_count", "2");
            }
            toast.success(response?.data?.message);
            router.replace(redirect(updatedUser));
          }

          if (pathname === "/change-pass-otp") {
            toast.success(tran("Password changed successfully"));
            router.push(
              `/change-pass-otp?otp-verified=true&email=${otp_expire_key}`,
            );
          }

          if (pathname === "/2fa-verify") {
            if (!response?.data?.data?.token || !response?.data?.data?.user) {
              toast.error(tran("Something went wrong, please try again later"));
              return;
            }

            login(response?.data?.data?.token, response?.data?.data?.user);
            toast.success(tran("2FA verified successfully"));
            router.push("/");
          }
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message);
          setOtpInputHandler((prev) => ({
            ...prev,
            isReset: true,
            isComplete: false,
            isInvalid: true,
          }));
        },
      },
    );
  };

  return {
    setOtpBreakTimer,
    otpInputHandler,
    setOtpInputHandler,
    otpBreakTime,
    setOtpBreakTime,
    handleSendOtp,
    handleVerify,
    isLoading,
  } as useOtpHandlerTypes;
};
