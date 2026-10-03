"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RobotsTxtPage() {
  const [robots, setRobots] = useState(`User-agent: *
Disallow: /admin/
Disallow: /api/
Allow: /

Sitemap: https://quiz.softivus.com/sitemap.xml
`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Robots.txt directives saved!");
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Robots.txt Crawler Directives" />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="admin-white-box p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white mb-1">
              Search Crawler Rules
            </h3>
            <p className="text-xs text-[var(--admin-neutral-200)]">
              Specify instructions for automated web crawlers and indexers.
            </p>
          </div>

          <textarea
            rows={8}
            value={robots}
            onChange={(e) => setRobots(e.target.value)}
            className="admin-form-control font-mono text-xs"
          />

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="admin-btn-primary py-2.5 px-6 rounded-lg text-xs font-semibold"
            >
              Save Robots.txt
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
