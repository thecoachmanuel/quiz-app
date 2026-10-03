"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LogoFaviconPage() {
  const [logoLight, setLogoLight] = useState("/images/logo.png");
  const [logoDark, setLogoDark] = useState("/images/logo-dark.png");
  const [favicon, setFavicon] = useState("/images/favicon.png");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Logo & Favicon updated successfully!");
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Brand Logos & Favicon" />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Light Logo */}
          <div className="admin-white-box p-6 space-y-4 text-center">
            <h4 className="font-bold text-sm text-[var(--admin-neutral-900)] dark:text-white">
              Light Mode Logo
            </h4>
            <div className="h-28 rounded-lg bg-[var(--admin-neutral-10)] dark:bg-[var(--admin-neutral-900)] border border-dashed border-[var(--admin-neutral-40)] dark:border-[var(--admin-neutral-700)] flex items-center justify-center p-3">
              <span className="font-black text-xl text-[var(--admin-primary)]">
                QUIZIX
              </span>
            </div>
            <div>
              <label className="admin-form-label text-left block">Logo Image URL</label>
              <input
                type="text"
                value={logoLight}
                onChange={(e) => setLogoLight(e.target.value)}
                className="admin-form-control text-xs"
              />
            </div>
          </div>

          {/* Dark Logo */}
          <div className="admin-white-box p-6 space-y-4 text-center">
            <h4 className="font-bold text-sm text-[var(--admin-neutral-900)] dark:text-white">
              Dark Mode Logo
            </h4>
            <div className="h-28 rounded-lg bg-[var(--admin-neutral-904)] border border-dashed border-[var(--admin-neutral-700)] flex items-center justify-center p-3">
              <span className="font-black text-xl text-white">
                QUIZIX
              </span>
            </div>
            <div>
              <label className="admin-form-label text-left block">Dark Logo URL</label>
              <input
                type="text"
                value={logoDark}
                onChange={(e) => setLogoDark(e.target.value)}
                className="admin-form-control text-xs"
              />
            </div>
          </div>

          {/* Favicon */}
          <div className="admin-white-box p-6 space-y-4 text-center">
            <h4 className="font-bold text-sm text-[var(--admin-neutral-900)] dark:text-white">
              Browser Favicon
            </h4>
            <div className="h-28 rounded-lg bg-[var(--admin-neutral-10)] dark:bg-[var(--admin-neutral-900)] border border-dashed border-[var(--admin-neutral-40)] dark:border-[var(--admin-neutral-700)] flex items-center justify-center p-3">
              <span className="w-10 h-10 rounded-lg bg-[var(--admin-primary)] text-white font-black text-lg flex items-center justify-center">
                Q
              </span>
            </div>
            <div>
              <label className="admin-form-label text-left block">Favicon URL</label>
              <input
                type="text"
                value={favicon}
                onChange={(e) => setFavicon(e.target.value)}
                className="admin-form-control text-xs"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="admin-btn-primary py-2.5 px-6 rounded-lg text-xs font-semibold"
          >
            Save Brand Assets
          </button>
        </div>
      </form>
    </div>
  );
}
