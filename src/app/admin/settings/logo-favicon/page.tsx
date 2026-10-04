"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useSiteSettingsStore } from "@/stores/siteSettingsStore";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LogoFaviconPage() {
  const { settings, updateSettings } = useSiteSettingsStore();
  const [logoLight, setLogoLight] = useState(settings.logo_light);
  const [logoDark, setLogoDark] = useState(settings.logo_dark);
  const [favicon, setFavicon] = useState(settings.favicon);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Try to push to API if available
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("quiz_admin_token")
          : null;
      if (token) {
        await fetch(`/api/v1/admin/settings/logo-favicon`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            logo_light: logoLight,
            logo_dark: logoDark,
            favicon,
          }),
        }).catch(() => {});
      }
    } catch {}

    // Always persist locally so changes reflect on admin & main site
    updateSettings({ logo_light: logoLight, logo_dark: logoDark, favicon });
    setSaving(false);
    toast.success("Logo & Favicon updated successfully!");
  };

  const LogoPreview = ({
    src,
    dark,
  }: {
    src: string;
    dark?: boolean;
  }) => (
    <div
      className={`h-28 rounded-lg border border-dashed flex items-center justify-center p-3 ${
        dark
          ? "bg-[var(--admin-neutral-904)] border-[var(--admin-neutral-700)]"
          : "bg-[var(--admin-neutral-10)] dark:bg-[var(--admin-neutral-900)] border-[var(--admin-neutral-40)] dark:border-[var(--admin-neutral-700)]"
      }`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt="Logo preview"
          className="h-16 w-auto max-w-full object-contain"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
            (e.currentTarget.nextElementSibling as HTMLElement)!.style.display =
              "flex";
          }}
        />
      ) : null}
      <span
        className="font-black text-xl text-[var(--admin-primary)]"
        style={{ display: src ? "none" : "flex" }}
      >
        QUIZIX
      </span>
    </div>
  );

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
            <LogoPreview src={logoLight} />
            <div>
              <label className="admin-form-label text-left block">
                Logo Image URL
              </label>
              <input
                type="text"
                value={logoLight}
                onChange={(e) => setLogoLight(e.target.value)}
                className="admin-form-control text-xs"
                placeholder="/assets/admin/images/logo-light.png"
              />
            </div>
          </div>

          {/* Dark Logo */}
          <div className="admin-white-box p-6 space-y-4 text-center">
            <h4 className="font-bold text-sm text-[var(--admin-neutral-900)] dark:text-white">
              Dark Mode Logo
            </h4>
            <LogoPreview src={logoDark} dark />
            <div>
              <label className="admin-form-label text-left block">
                Dark Logo URL
              </label>
              <input
                type="text"
                value={logoDark}
                onChange={(e) => setLogoDark(e.target.value)}
                className="admin-form-control text-xs"
                placeholder="/assets/admin/images/logo-dark.png"
              />
            </div>
          </div>

          {/* Favicon */}
          <div className="admin-white-box p-6 space-y-4 text-center">
            <h4 className="font-bold text-sm text-[var(--admin-neutral-900)] dark:text-white">
              Browser Favicon
            </h4>
            <div className="h-28 rounded-lg bg-[var(--admin-neutral-10)] dark:bg-[var(--admin-neutral-900)] border border-dashed border-[var(--admin-neutral-40)] dark:border-[var(--admin-neutral-700)] flex items-center justify-center p-3">
              {favicon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={favicon}
                  alt="Favicon preview"
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              ) : (
                <span className="w-10 h-10 rounded-lg bg-[var(--admin-primary)] text-white font-black text-lg flex items-center justify-center">
                  Q
                </span>
              )}
            </div>
            <div>
              <label className="admin-form-label text-left block">
                Favicon URL
              </label>
              <input
                type="text"
                value={favicon}
                onChange={(e) => setFavicon(e.target.value)}
                className="admin-form-control text-xs"
                placeholder="/favicon.ico"
              />
            </div>
          </div>
        </div>

        <div className="admin-white-box p-4">
          <p className="text-xs text-[var(--admin-neutral-200)]">
            <i className="ph ph-info mr-1" />
            Logo changes apply instantly to the admin sidebar and main site header. For API-based deployments, the server will also be updated on save.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="admin-btn-primary py-2.5 px-6 rounded-lg text-xs font-semibold inline-flex items-center gap-2"
          >
            {saving && <i className="ph ph-spinner animate-spin" />}
            {saving ? "Saving..." : "Save Brand Assets"}
          </button>
        </div>
      </form>
    </div>
  );
}

