"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CoinSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    coins_per_usd: 100,
    signup_bonus: 50,
    daily_login_bonus: 10,
    referral_bonus: 100,
    min_withdrawal_coins: 1000,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Coin economy settings updated successfully!");
    }, 600);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Coin Economy & Pricing" />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="admin-white-box p-6 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl">
              <i className="ph-fill ph-coins"></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
                Virtual Coin Economy
              </h3>
              <p className="text-xs text-[var(--admin-neutral-200)]">
                Control the exchange rate, daily free bonuses, and cash-out minimums.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="admin-form-label">
                Coins per 1.00 USD (Exchange Rate)
              </label>
              <input
                type="number"
                name="coins_per_usd"
                min={1}
                value={formData.coins_per_usd}
                onChange={handleChange}
                className="admin-form-control font-semibold"
              />
              <p className="text-[11px] text-[var(--admin-neutral-200)] mt-1">
                E.g. 100 coins = $1.00 USD
              </p>
            </div>

            <div>
              <label className="admin-form-label">New User Sign-up Bonus</label>
              <input
                type="number"
                name="signup_bonus"
                min={0}
                value={formData.signup_bonus}
                onChange={handleChange}
                className="admin-form-control"
              />
              <p className="text-[11px] text-[var(--admin-neutral-200)] mt-1">
                Coins gifted when creating an account
              </p>
            </div>

            <div>
              <label className="admin-form-label">Daily Check-in Bonus</label>
              <input
                type="number"
                name="daily_login_bonus"
                min={0}
                value={formData.daily_login_bonus}
                onChange={handleChange}
                className="admin-form-control"
              />
              <p className="text-[11px] text-[var(--admin-neutral-200)] mt-1">
                Coins given per day for logging into the app
              </p>
            </div>

            <div>
              <label className="admin-form-label">Friend Referral Reward</label>
              <input
                type="number"
                name="referral_bonus"
                min={0}
                value={formData.referral_bonus}
                onChange={handleChange}
                className="admin-form-control"
              />
              <p className="text-[11px] text-[var(--admin-neutral-200)] mt-1">
                Coins rewarded when a referred friend plays quizzes
              </p>
            </div>

            <div className="col-span-full">
              <label className="admin-form-label">
                Minimum Withdrawal Threshold (Coins)
              </label>
              <input
                type="number"
                name="min_withdrawal_coins"
                min={100}
                value={formData.min_withdrawal_coins}
                onChange={handleChange}
                className="admin-form-control"
              />
              <p className="text-[11px] text-[var(--admin-neutral-200)] mt-1">
                Minimum coins a player must accumulate before requesting a cashout (${(formData.min_withdrawal_coins / formData.coins_per_usd).toFixed(2)})
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={saving}
              className="admin-btn-primary py-2.5 px-6 rounded-lg text-xs font-semibold inline-flex items-center gap-2"
            >
              {saving && <i className="ph ph-spinner animate-spin"></i>}
              {saving ? "Saving..." : "Save Coin Settings"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
