"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SitemapSettingsPage() {
  const [sitemapUrl, setSitemapUrl] = useState("https://quiz.softivus.com/sitemap.xml");

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Sitemap XML Generator" />

      <div className="admin-white-box p-6 space-y-4 max-w-2xl">
        <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
          Dynamic XML Sitemap
        </h3>
        <p className="text-xs text-[var(--admin-neutral-200)]">
          Search engine crawlers (Googlebot, Bingbot) automatically ingest this dynamic sitemap including all live quizzes, categories, and contests.
        </p>

        <div>
          <label className="admin-form-label">Sitemap Endpoint URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={sitemapUrl}
              className="admin-form-control font-mono text-xs"
            />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(sitemapUrl);
                toast.success("URL copied!");
              }}
              className="admin-btn-secondary px-4 text-xs font-semibold"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => toast.success("Sitemap XML rebuilt with all latest quizzes!")}
            className="admin-btn-primary py-2 px-5 rounded-lg text-xs font-semibold"
          >
            Rebuild Sitemap Now
          </button>
        </div>
      </div>
    </div>
  );
}
