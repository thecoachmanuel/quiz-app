"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

interface FeatureSwitch {
  key: string;
  title: string;
  description: string;
  enabled: boolean;
  category: "auth" | "security" | "gameplay" | "communication";
}

const INITIAL_FEATURES: FeatureSwitch[] = [
  {
    key: "user_registration",
    title: "User Registration",
    description: "Allow new players to sign up for accounts.",
    enabled: true,
    category: "auth",
  },
  {
    key: "email_verification",
    title: "Email Verification",
    description: "Require email verification before accessing contests.",
    enabled: true,
    category: "auth",
  },
  {
    key: "social_login",
    title: "Social Logins (Google / Facebook)",
    description: "Permit single-sign-on through social OAuth providers.",
    enabled: true,
    category: "auth",
  },
  {
    key: "kyc_verification",
    title: "KYC Identity Verification",
    description: "Require government ID verification before cash withdrawals.",
    enabled: true,
    category: "security",
  },
  {
    key: "two_factor_auth",
    title: "2FA Authentication",
    description: "Enable optional two-factor authentication for users.",
    enabled: true,
    category: "security",
  },
  {
    key: "push_notifications",
    title: "Web Push Notifications",
    description: "Send browser notifications for live contests & daily rewards.",
    enabled: true,
    category: "communication",
  },
  {
    key: "coin_purchases",
    title: "Coin Store & Deposits",
    description: "Allow users to buy coins via payment gateways.",
    enabled: true,
    category: "gameplay",
  },
  {
    key: "cash_withdrawals",
    title: "Cash Withdrawals",
    description: "Allow players to withdraw contest prize earnings.",
    enabled: true,
    category: "gameplay",
  },
  {
    key: "referral_rewards",
    title: "Referral Program",
    description: "Reward players with bonus coins for inviting friends.",
    enabled: true,
    category: "gameplay",
  },
];

export default function SystemConfigurationPage() {
  const [features, setFeatures] = useState<FeatureSwitch[]>(INITIAL_FEATURES);

  const toggleFeature = (key: string) => {
    setFeatures((prev) =>
      prev.map((f) => {
        if (f.key === key) {
          const next = !f.enabled;
          toast.success(`${f.title} is now ${next ? "Enabled" : "Disabled"}`);
          return { ...f, enabled: next };
        }
        return f;
      })
    );
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="System Features Configuration" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feat) => (
          <div
            key={feat.key}
            className="admin-white-box p-5 flex flex-col justify-between border border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)] transition hover:shadow-xs"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-bold text-sm text-[var(--admin-neutral-900)] dark:text-white">
                  {feat.title}
                </h4>
                <button
                  type="button"
                  onClick={() => toggleFeature(feat.key)}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-hidden ${
                    feat.enabled
                      ? "bg-[var(--admin-primary)]"
                      : "bg-[var(--admin-neutral-40)] dark:bg-[var(--admin-neutral-700)]"
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 left-1 ${
                      feat.enabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-[var(--admin-neutral-200)] leading-relaxed">
                {feat.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)] flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--admin-neutral-400)]">
                Status
              </span>
              <span
                className={`text-xs font-semibold ${
                  feat.enabled ? "text-emerald-500" : "text-gray-400"
                }`}
              >
                {feat.enabled ? "Active" : "Disabled"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
