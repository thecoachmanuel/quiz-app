import SocialLogin from "@/features/auth/SocialLogin";
import { getUserCountryCode } from "@/utils/geolocation";
import AuthPageTitle from "../AuthPageTitle";
import SignUpForm from "./SignUpForm";

export default async function SignUpPage() {
  const countryCode = await getUserCountryCode();

  return (
    <div className="w-full pt-8 sm:pt-20 xl:px-10 2xl:px-[60px]">
      <AuthPageTitle title="Welcome back to QuiziX" />
      <div className="flex flex-col gap-3">
        <SignUpForm countryCode={countryCode} />
        <SocialLogin />
      </div>
    </div>
  );
}
