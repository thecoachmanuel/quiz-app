/** @format */

"use client";

import AuthPageTitle from "@/app/(default)/(auth-pages)/AuthPageTitle";
import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { useTranslations } from "@/providers/TranslationProviders";
import { emailOrPhone } from "@/utils/helper";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import { PasswordInput } from "../../components/ui/PasswordInput";
import OtpForm from "./OtpForm";

const ChangePassOTPForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const otpVerifiedParam = searchParams.get("otp-verified");
  const [passwordResetForm, setPasswordResetForm] = useState({
    type: "email",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const otp_expire_key =
    searchParams.get("email") || searchParams.get("phone") || "";

  const {
    mutate: verifyOTP,
    isLoading: verifyLoading,
    backendErrors: passResetErrors,
  } = useQueryMutation({
    isPublic: true,
    url: "auth/forgot-password",
  });

  const handleSubmitPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    verifyOTP(
      {
        ...emailOrPhone(otp_expire_key),

        password: passwordResetForm.password,
        password_confirmation: passwordResetForm.password_confirmation,
      },
      {
        onSuccess: async () => {
          toast.success(tran("Successfully logged in"));

          router.push("/sign-in");
        },
        onError: () => {},
      },
    );
  };

  const { tran } = useTranslations();

  return (
    <Suspense fallback={<Loader />}>
      {otpVerifiedParam ? (
        <form onSubmit={handleSubmitPassword} className="flex flex-col gap-3">
          <h4 className="heading-4 pb-1 text-center">
            {tran("Change Password")}
          </h4>
          <PasswordInput
            label={tran("Password")}
            name="password"
            form={passwordResetForm}
            setForm={setPasswordResetForm}
            errors={passResetErrors}
          />
          <PasswordInput
            label={tran("Confirm Password")}
            name="password_confirmation"
            form={passwordResetForm}
            setForm={setPasswordResetForm}
            errors={passResetErrors}
          />
          <div className="pt-4">
            <Button
              type="submit"
              loading={verifyLoading}
              disabled={verifyLoading}
              className="w-full"
            >
              {tran("Save")}
            </Button>
          </div>
        </form>
      ) : (
        <>
          <AuthPageTitle title="Verify OTP" />
          <OtpForm requestUrl="auth/forgot-password" />
        </>
      )}
    </Suspense>
  );
};

export default ChangePassOTPForm;
