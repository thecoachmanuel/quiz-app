"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

interface LangItem {
  id: number;
  name: string;
  code: string;
  direction: "ltr" | "rtl";
  is_default: boolean;
  status: "active" | "inactive";
}

const INITIAL_LANGS: LangItem[] = [
  { id: 1, name: "English", code: "en", direction: "ltr", is_default: true, status: "active" },
  { id: 2, name: "Spanish", code: "es", direction: "ltr", is_default: false, status: "active" },
  { id: 3, name: "French", code: "fr", direction: "ltr", is_default: false, status: "active" },
  { id: 4, name: "Arabic", code: "ar", direction: "rtl", is_default: false, status: "active" },
  { id: 5, name: "German", code: "de", direction: "ltr", is_default: false, status: "active" },
];

export default function LanguagesPage() {
  const [langs, setLangs] = useState<LangItem[]>(INITIAL_LANGS);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    setLangs((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        code: code.toLowerCase(),
        direction: dir,
        is_default: false,
        status: "active",
      },
    ]);
    toast.success("Language added");
    setModalOpen(false);
    setName("");
    setCode("");
  };

  const columns = [
    {
      key: "name",
      label: "Language",
      render: (row: LangItem) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-[var(--admin-neutral-900)] dark:text-white">
            {row.name}
          </span>
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-[var(--admin-neutral-20)] dark:bg-[var(--admin-neutral-800)] text-[var(--admin-primary)] font-semibold uppercase">
            {row.code}
          </span>
          {row.is_default && (
            <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
              Default
            </span>
          )}
        </div>
      ),
    },
    {
      key: "dir",
      label: "Direction",
      render: (row: LangItem) => (
        <span className="text-xs uppercase font-medium text-[var(--admin-neutral-400)]">
          {row.direction}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: LangItem) => (
        <span className="admin-badge admin-badge-success uppercase text-[10px]">
          {row.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: LangItem) => (
        <div className="flex items-center gap-1.5 justify-end">
          {!row.is_default && (
            <button
              type="button"
              onClick={() => {
                setLangs((prev) =>
                  prev.map((l) => ({ ...l, is_default: l.id === row.id }))
                );
                toast.success(`Default language set to ${row.name}`);
              }}
              className="text-[11px] font-semibold px-2 py-1 rounded bg-[var(--admin-neutral-10)] dark:bg-[var(--admin-neutral-800)] hover:bg-[var(--admin-primary)]/10 hover:text-[var(--admin-primary)] transition"
            >
              Set Default
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Languages & Localization"
        buttons={[
          {
            label: "Add Language",
            onClick: () => setModalOpen(true),
            icon: "ph ph-plus-circle",
            variant: "primary",
          },
        ]}
      />

      <AdminDataTable columns={columns} data={langs} emptyText="No languages found" />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="admin-white-box w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[var(--admin-neutral-400)] hover:text-red-500 transition text-xl"
            >
              <i className="ph ph-x"></i>
            </button>
            <h3 className="text-lg font-bold text-[var(--admin-neutral-900)] dark:text-white mb-4">
              Add New Language
            </h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="admin-form-label">Language Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. German"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="admin-form-control"
                />
              </div>

              <div>
                <label className="admin-form-label">Language Code (ISO) *</label>
                <input
                  type="text"
                  required
                  placeholder="de"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="admin-form-control uppercase font-mono"
                />
              </div>

              <div>
                <label className="admin-form-label">Text Direction</label>
                <select
                  value={dir}
                  onChange={(e) => setDir(e.target.value as "ltr" | "rtl")}
                  className="admin-form-control"
                >
                  <option value="ltr">LTR (Left to Right)</option>
                  <option value="rtl">RTL (Right to Left)</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="admin-btn-secondary text-xs py-2 px-4 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary text-xs py-2 px-4 rounded-lg font-medium"
                >
                  Add Language
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
