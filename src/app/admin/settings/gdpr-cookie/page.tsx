"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

export default function GdprCookiePage() {
  const [enabled, setEnabled] = useState(true);
  const [message, setMessage] = useState(
    "We use cookies to enhance your trivia experience, personalize quizzes, and analyze platform traffic. By continuing to use our website, you agree to our Privacy Policy."
  );
  const [buttonText, setButtonText] = useState("Accept All Cookies");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("GDPR Cookie consent settings saved!");
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="GDPR Cookie Consent Settings" />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="admin-white-box p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
            <div>
              <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
                Show Cookie Banner
              </h3>
              <p className="text-xs text-[var(--admin-neutral-200)]">
                Displays a privacy banner to EU & international visitors.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEnabled(!enabled)}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-hidden ${
                enabled
                  ? "bg-[var(--admin-primary)]"
                  : "bg-[var(--admin-neutral-40)] dark:bg-[var(--admin-neutral-700)]"
              }`}
            >
              <span
                className={`inline-block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 left-1 ${
                  enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div>
            <label className="admin-form-label">Cookie Policy Text</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="admin-form-control resize-none text-xs"
            />
          </div>

          <div>
            <label className="admin-form-label">Accept Button Label</label>
            <input
              type="text"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              className="admin-form-control"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="admin-btn-primary py-2.5 px-6 rounded-lg text-xs font-semibold"
            >
              Save GDPR Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
