"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AdsSettingsPage() {
  const [adsenseEnabled, setAdsenseEnabled] = useState(false);
  const [publisherId, setPublisherId] = useState("ca-pub-1234567890");
  const [bannerSlot, setBannerSlot] = useState("1029384756");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Ad integration settings saved!");
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Monetization & Ad Networks" />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="admin-white-box p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
            <div>
              <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
                Google AdSense
              </h3>
              <p className="text-xs text-[var(--admin-neutral-200)]">
                Display responsive ad banners between trivia questions.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setAdsenseEnabled(!adsenseEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-hidden ${
                adsenseEnabled
                  ? "bg-[var(--admin-primary)]"
                  : "bg-[var(--admin-neutral-40)] dark:bg-[var(--admin-neutral-700)]"
              }`}
            >
              <span
                className={`inline-block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 left-1 ${
                  adsenseEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div>
            <label className="admin-form-label">AdSense Publisher ID</label>
            <input
              type="text"
              value={publisherId}
              onChange={(e) => setPublisherId(e.target.value)}
              className="admin-form-control font-mono text-xs"
            />
          </div>

          <div>
            <label className="admin-form-label">Default Banner Ad Slot ID</label>
            <input
              type="text"
              value={bannerSlot}
              onChange={(e) => setBannerSlot(e.target.value)}
              className="admin-form-control font-mono text-xs"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="admin-btn-primary py-2.5 px-6 rounded-lg text-xs font-semibold"
            >
              Save Ad Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
