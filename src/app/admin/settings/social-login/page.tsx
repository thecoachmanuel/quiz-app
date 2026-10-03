"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SocialLoginSettingsPage() {
  const [google, setGoogle] = useState({
    enabled: true,
    client_id: "your-google-client-id.apps.googleusercontent.com",
    client_secret: "••••••••••••••••",
  });

  const [facebook, setFacebook] = useState({
    enabled: false,
    app_id: "1092837465",
    app_secret: "••••••••••••••••",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Social login credentials saved!");
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Social Authentication (OAuth)" />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Google OAuth */}
        <div className="admin-white-box p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center text-xl">
                <i className="ph ph-google-logo"></i>
              </div>
              <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
                Google Login
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setGoogle({ ...google, enabled: !google.enabled })}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-hidden ${
                google.enabled
                  ? "bg-[var(--admin-primary)]"
                  : "bg-[var(--admin-neutral-40)] dark:bg-[var(--admin-neutral-700)]"
              }`}
            >
              <span
                className={`inline-block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 left-1 ${
                  google.enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div>
            <label className="admin-form-label">Google Client ID</label>
            <input
              type="text"
              value={google.client_id}
              onChange={(e) => setGoogle({ ...google, client_id: e.target.value })}
              className="admin-form-control font-mono text-xs"
            />
          </div>

          <div>
            <label className="admin-form-label">Google Client Secret</label>
            <input
              type="password"
              value={google.client_secret}
              onChange={(e) =>
                setGoogle({ ...google, client_secret: e.target.value })
              }
              className="admin-form-control font-mono text-xs"
            />
          </div>
        </div>

        {/* Facebook OAuth */}
        <div className="admin-white-box p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center text-xl">
                <i className="ph ph-facebook-logo"></i>
              </div>
              <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
                Facebook Login
              </h3>
            </div>

            <button
              type="button"
              onClick={() =>
                setFacebook({ ...facebook, enabled: !facebook.enabled })
              }
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-hidden ${
                facebook.enabled
                  ? "bg-[var(--admin-primary)]"
                  : "bg-[var(--admin-neutral-40)] dark:bg-[var(--admin-neutral-700)]"
              }`}
            >
              <span
                className={`inline-block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 left-1 ${
                  facebook.enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div>
            <label className="admin-form-label">Facebook App ID</label>
            <input
              type="text"
              value={facebook.app_id}
              onChange={(e) =>
                setFacebook({ ...facebook, app_id: e.target.value })
              }
              className="admin-form-control font-mono text-xs"
            />
          </div>

          <div>
            <label className="admin-form-label">Facebook App Secret</label>
            <input
              type="password"
              value={facebook.app_secret}
              onChange={(e) =>
                setFacebook({ ...facebook, app_secret: e.target.value })
              }
              className="admin-form-control font-mono text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="admin-btn-primary py-2.5 px-6 rounded-lg text-xs font-semibold"
          >
            Save OAuth Settings
          </button>
        </div>
      </form>
    </div>
  );
}
