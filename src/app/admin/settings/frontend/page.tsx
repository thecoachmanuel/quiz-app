"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ManageFrontendPage() {
  const [sections, setSections] = useState([
    { name: "Hero Banner & CTA", enabled: true },
    { name: "Featured Categories Carousel", enabled: true },
    { name: "Live & Upcoming Contests Showcase", enabled: true },
    { name: "Daily Wordling & Hexling Puzzle Promo", enabled: true },
    { name: "Global Leaderboard Preview", enabled: true },
    { name: "Mobile App Download Banner", enabled: true },
    { name: "Newsletter Subscription Section", enabled: true },
  ]);

  const toggleSection = (idx: number) => {
    setSections((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Manage Frontend Homepage Sections" />

      <div className="admin-white-box p-6 space-y-4 max-w-2xl">
        <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white mb-2">
          Homepage Layout Blocks
        </h3>
        <p className="text-xs text-[var(--admin-neutral-200)] mb-4">
          Toggle sections on or off to customize the landing page layout.
        </p>

        <div className="space-y-2.5">
          {sections.map((sec, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3.5 rounded-lg border border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)] text-xs"
            >
              <div className="flex items-center gap-2">
                <i className="ph ph-dots-six-vertical text-lg text-[var(--admin-neutral-300)] cursor-grab"></i>
                <span className="font-semibold text-sm text-[var(--admin-neutral-900)] dark:text-white">
                  {sec.name}
                </span>
              </div>

              <button
                type="button"
                onClick={() => toggleSection(i)}
                className={`w-11 h-6 rounded-full transition-colors relative focus:outline-hidden ${
                  sec.enabled
                    ? "bg-[var(--admin-primary)]"
                    : "bg-[var(--admin-neutral-40)] dark:bg-[var(--admin-neutral-700)]"
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 left-1 ${
                    sec.enabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="button"
            onClick={() => toast.success("Frontend layout updated successfully!")}
            className="admin-btn-primary py-2.5 px-6 rounded-lg text-xs font-semibold"
          >
            Save Layout
          </button>
        </div>
      </div>
    </div>
  );
}
