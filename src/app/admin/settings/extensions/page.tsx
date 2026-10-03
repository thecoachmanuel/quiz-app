"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

interface Extension {
  id: string;
  name: string;
  description: string;
  installed: boolean;
  active: boolean;
}

const EXTENSIONS: Extension[] = [
  {
    id: "firebase",
    name: "Firebase Cloud Messaging",
    description: "Powers real-time web push notifications for live trivia games.",
    installed: true,
    active: true,
  },
  {
    id: "recaptcha",
    name: "Google reCAPTCHA v3",
    description: "Protects login and register forms against bot spam.",
    installed: true,
    active: true,
  },
  {
    id: "pusher",
    name: "Pusher WebSocket Service",
    description: "Powers live head-to-head trivia matchmaking and real-time scores.",
    installed: true,
    active: false,
  },
];

export default function ExtensionsSettingsPage() {
  const [exts, setExts] = useState<Extension[]>(EXTENSIONS);

  const toggleActive = (id: string) => {
    setExts((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const next = !e.active;
          toast.success(`${e.name} is now ${next ? "Enabled" : "Disabled"}`);
          return { ...e, active: next };
        }
        return e;
      })
    );
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="System Extensions & Plugins" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {exts.map((ext) => (
          <div
            key={ext.id}
            className="admin-white-box p-5 flex flex-col justify-between border border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-sm text-[var(--admin-neutral-900)] dark:text-white">
                  {ext.name}
                </h4>
                <button
                  type="button"
                  onClick={() => toggleActive(ext.id)}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-hidden ${
                    ext.active
                      ? "bg-[var(--admin-primary)]"
                      : "bg-[var(--admin-neutral-40)] dark:bg-[var(--admin-neutral-700)]"
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 left-1 ${
                      ext.active ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-[var(--admin-neutral-200)]">
                {ext.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)] flex justify-between items-center text-xs">
              <span className="text-[11px] text-[var(--admin-neutral-400)]">Status</span>
              <span
                className={`font-semibold ${
                  ext.active ? "text-emerald-500" : "text-gray-400"
                }`}
              >
                {ext.active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
