"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CustomCssPage() {
  const [saving, setSaving] = useState(false);
  const [cssCode, setCssCode] = useState(`/* Custom CSS Overrides */
/* Example: Custom brand highlight */
:root {
  /* --primary-custom: #6366f1; */
}
`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Custom CSS injected successfully!");
    }, 500);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Custom CSS" />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="admin-white-box p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white mb-1">
              Frontend Custom Styles
            </h3>
            <p className="text-xs text-[var(--admin-neutral-200)]">
              Add your own CSS rules without modifying core theme files.
            </p>
          </div>

          <textarea
            rows={14}
            value={cssCode}
            onChange={(e) => setCssCode(e.target.value)}
            className="w-full font-mono text-xs p-4 rounded-xl border border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)] bg-[var(--admin-neutral-904)] text-emerald-400 focus:outline-hidden leading-relaxed"
          />

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="admin-btn-primary py-2.5 px-6 rounded-lg text-xs font-semibold inline-flex items-center gap-2"
            >
              {saving && <i className="ph ph-spinner animate-spin"></i>}
              {saving ? "Saving..." : "Save Custom CSS"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
