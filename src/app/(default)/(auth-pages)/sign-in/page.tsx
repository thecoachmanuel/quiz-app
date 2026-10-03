/** @format */
import SocialLogin from "@/features/auth/SocialLogin";
import AuthPageTitle from "../AuthPageTitle";
import SignInForm from "./SignInForm";

export default function SignInPage() {
  return (
    <div className="w-full pt-8 sm:pt-20 xl:px-10 2xl:px-[60px]">
      <AuthPageTitle title="Sign In" />
      <div className="flex w-full flex-col gap-3">
        <SignInForm />
        <SocialLogin />
      </div>
    </div>
  );
}
