"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

interface KycField {
  id: string;
  label: string;
  type: "text" | "file" | "select";
  required: boolean;
}

const INITIAL_FIELDS: KycField[] = [
  { id: "1", label: "Full Legal Name", type: "text", required: true },
  { id: "2", label: "National ID / Passport Number", type: "text", required: true },
  { id: "3", label: "Government Photo ID (Front & Back)", type: "file", required: true },
  { id: "4", label: "Proof of Address (Utility Bill)", type: "file", required: false },
];

export default function KycSettingsPage() {
  const [fields, setFields] = useState<KycField[]>(INITIAL_FIELDS);

  const toggleRequired = (id: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, required: !f.required } : f))
    );
  };

  const deleteField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    toast.success("Field removed");
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="KYC Verification Form Configuration" />

      <div className="admin-white-box p-6 space-y-4 max-w-3xl">
        <div>
          <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white mb-1">
            Required Documents & Fields
          </h3>
          <p className="text-xs text-[var(--admin-neutral-200)]">
            Users must submit these fields and documents before requesting large cash payouts.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {fields.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between p-3.5 rounded-lg border border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)] text-xs"
            >
              <div>
                <span className="font-semibold text-sm text-[var(--admin-neutral-900)] dark:text-white">
                  {f.label}
                </span>
                <span className="ml-2 text-[11px] font-mono text-[var(--admin-primary)] uppercase">
                  ({f.type})
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleRequired(f.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                    f.required
                      ? "bg-red-500/10 text-red-500 border border-red-500/20"
                      : "bg-gray-500/10 text-gray-400"
                  }`}
                >
                  {f.required ? "Mandatory" : "Optional"}
                </button>
                <button
                  type="button"
                  onClick={() => deleteField(f.id)}
                  className="w-7 h-7 rounded flex items-center justify-center text-[var(--admin-neutral-400)] hover:text-red-500 hover:bg-red-500/10 transition"
                >
                  <i className="ph ph-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={() => toast.success("KYC Form configuration saved!")}
            className="admin-btn-primary py-2.5 px-6 rounded-lg text-xs font-semibold"
          >
            Save KYC Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
