"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

export default function MaintenanceModePage() {
  const [maintenance, setMaintenance] = useState(false);
  const [secretKey, setSecretKey] = useState("secret-bypass-2024");
  const [message, setMessage] = useState(
    "Quizix is currently undergoing scheduled platform upgrades. We will be back online shortly!"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      `Maintenance mode is now ${maintenance ? "Active" : "Disabled"}`
    );
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Maintenance Mode" />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="admin-white-box p-6 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
            <div>
              <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
                Enable Maintenance Mode
              </h3>
              <p className="text-xs text-[var(--admin-neutral-200)]">
                When enabled, clients will see a maintenance screen instead of the regular app.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMaintenance(!maintenance)}
              className={`w-12 h-6 rounded-full transition-colors relative focus:outline-hidden ${
                maintenance
                  ? "bg-red-500"
                  : "bg-[var(--admin-neutral-40)] dark:bg-[var(--admin-neutral-700)]"
              }`}
            >
              <span
                className={`inline-block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 left-1 ${
                  maintenance ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div>
            <label className="admin-form-label">Secret Bypass Key (URL Param)</label>
            <input
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="admin-form-control font-mono text-xs"
            />
            <p className="text-[11px] text-[var(--admin-neutral-200)] mt-1">
              Admins can bypass maintenance by visiting: ?bypass={secretKey}
            </p>
          </div>

          <div>
            <label className="admin-form-label">Maintenance Notice Message</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="admin-form-control resize-none text-xs"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="admin-btn-primary py-2.5 px-6 rounded-lg text-xs font-semibold"
            >
              Save Maintenance Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
