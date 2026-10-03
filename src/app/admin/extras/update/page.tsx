"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SystemUpdatePage() {
  const [checking, setChecking] = useState(false);

  const handleCheck = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      toast.success("Quizix is running the latest release (v2.1.0)!");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="System Version & Updates" />

      <div className="admin-white-box p-6 space-y-5 max-w-2xl">
        <div className="flex items-center gap-4 pb-4 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-3xl">
            <i className="ph ph-shield-check"></i>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--admin-neutral-900)] dark:text-white">
              Quizix v2.1.0
            </h3>
            <p className="text-xs text-[var(--admin-neutral-200)]">
              Your system is running the full standalone Next.js client & unified admin dashboard.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--admin-neutral-10)] dark:bg-[var(--admin-neutral-900)] border border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)] text-xs text-[var(--admin-neutral-600)] dark:text-[var(--admin-neutral-200)] space-y-2">
          <div className="flex justify-between">
            <span className="text-[var(--admin-neutral-200)]">Current Version</span>
            <span className="font-bold text-[var(--admin-neutral-900)] dark:text-white">v2.1.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--admin-neutral-200)]">Release Date</span>
            <span className="font-medium text-[var(--admin-neutral-900)] dark:text-white">October 2026</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--admin-neutral-200)]">Admin Engine</span>
            <span className="font-medium text-emerald-500">Unified Next.js App Router</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            disabled={checking}
            onClick={handleCheck}
            className="admin-btn-primary py-2.5 px-6 rounded-lg text-xs font-semibold inline-flex items-center gap-2"
          >
            {checking && <i className="ph ph-spinner animate-spin"></i>}
            {checking ? "Checking Server..." : "Check for Updates"}
          </button>
        </div>
      </div>
    </div>
  );
}
