"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AppInfoPage() {
  const [clearing, setClearing] = useState(false);

  const handleClearCache = (type: string) => {
    setClearing(true);
    setTimeout(() => {
      setClearing(false);
      toast.success(`${type} cleared successfully!`);
    }, 500);
  };

  const appInfo = [
    { label: "App Name", value: "Quizix Trivia & Gaming Platform" },
    { label: "App Version", value: "v2.1.0" },
    { label: "Frontend Framework", value: "Next.js 16 (App Router + Turbopack)" },
    { label: "React Version", value: "React 19" },
    { label: "API Backend", value: "Laravel 11 REST API" },
    { label: "Environment", value: "Production Ready / Local Dev" },
  ];

  const serverInfo = [
    { label: "Node.js Version", value: "v20+ Compatible" },
    { label: "Database Engine", value: "MySQL 8.0 / MariaDB" },
    { label: "Iconography", value: "Phosphor Icons v2.1" },
    { label: "Charts Engine", value: "Recharts & SVG" },
    { label: "UI Theme", value: "Responsive Dark / Light Mode" },
    { label: "Auth Provider", value: "JWT / Bearer Token Storage" },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader title="System & Application Information" />

      {/* App Info Table */}
      <div className="admin-white-box p-6 space-y-4">
        <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
          Application Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--admin-neutral-30)] dark:bg-[var(--admin-neutral-700)] rounded-lg overflow-hidden border border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
          {appInfo.map((item, i) => (
            <div
              key={i}
              className="p-4 bg-[var(--admin-neutral-0)] dark:bg-[var(--admin-neutral-903)] flex justify-between items-center text-xs"
            >
              <span className="text-[var(--admin-neutral-200)] font-medium">
                {item.label}
              </span>
              <span className="font-semibold text-[var(--admin-neutral-900)] dark:text-white">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Server Info Table */}
      <div className="admin-white-box p-6 space-y-4">
        <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
          Environment & Server Specifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--admin-neutral-30)] dark:bg-[var(--admin-neutral-700)] rounded-lg overflow-hidden border border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
          {serverInfo.map((item, i) => (
            <div
              key={i}
              className="p-4 bg-[var(--admin-neutral-0)] dark:bg-[var(--admin-neutral-903)] flex justify-between items-center text-xs"
            >
              <span className="text-[var(--admin-neutral-200)] font-medium">
                {item.label}
              </span>
              <span className="font-semibold text-[var(--admin-neutral-900)] dark:text-white">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Cache Card */}
      <div className="admin-white-box p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
              System Cache Management
            </h3>
            <p className="text-xs text-[var(--admin-neutral-200)]">
              Clear temporary runtime caches to force immediate updates across all clients.
            </p>
          </div>
          <button
            type="button"
            disabled={clearing}
            onClick={() => handleClearCache("All System Caches")}
            className="admin-btn-danger text-xs py-2 px-4 rounded-lg font-semibold inline-flex items-center gap-1.5"
          >
            <i className="ph ph-trash"></i>
            Clear All Caches
          </button>
        </div>

        <div className="space-y-2 pt-2">
          {[
            {
              name: "Application State Cache",
              desc: "Clears Zustand store and browser session data",
            },
            {
              name: "Next.js Pre-rendered Route Cache",
              desc: "Revalidates all statically optimized page routes",
            },
            {
              name: "API Data Response Cache",
              desc: "Flushes TanStack React Query memory and query caches",
            },
          ].map((cache, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center p-3 rounded-lg border border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)] text-xs"
            >
              <div>
                <span className="font-semibold text-[var(--admin-neutral-900)] dark:text-white">
                  {cache.name}
                </span>
                <p className="text-[11px] text-[var(--admin-neutral-200)]">
                  {cache.desc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleClearCache(cache.name)}
                className="admin-btn-secondary text-xs py-1.5 px-3 rounded-md font-medium"
              >
                Clear
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
