import OtpForm from "@/features/auth/OtpForm";
import AuthPageTitle from "../AuthPageTitle";

export default function Verify2fa() {
  return (
    <div className="w-full pt-8 sm:pt-20 xl:px-10 2xl:px-[60px]">
      <AuthPageTitle title="Verify 2FA OTP" />
      <OtpForm requestUrl="auth/sign-in-with-2fa" />
    </div>
  );
}
