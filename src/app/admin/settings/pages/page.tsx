"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

interface StaticPage {
  id: number;
  title: string;
  slug: string;
  updated_at: string;
}

const INITIAL_PAGES: StaticPage[] = [
  { id: 1, title: "Terms and Conditions", slug: "terms-conditions", updated_at: "2024-02-10" },
  { id: 2, title: "Privacy Policy", slug: "privacy-policy", updated_at: "2024-02-10" },
  { id: 3, title: "Fair Play & Anti-Cheat Policy", slug: "fair-play", updated_at: "2024-01-15" },
  { id: 4, title: "About Quizix", slug: "about-us", updated_at: "2024-01-05" },
];

export default function ManagePages() {
  const [pages, setPages] = useState<StaticPage[]>(INITIAL_PAGES);
  const [editing, setEditing] = useState<StaticPage | null>(null);

  const columns = [
    {
      key: "title",
      label: "Page Title",
      render: (row: StaticPage) => (
        <div>
          <span className="font-bold text-sm text-[var(--admin-neutral-900)] dark:text-white">
            {row.title}
          </span>
          <p className="text-xs text-[var(--admin-neutral-200)]">/{row.slug}</p>
        </div>
      ),
    },
    {
      key: "date",
      label: "Last Modified",
      render: (row: StaticPage) => (
        <span className="text-xs text-[var(--admin-neutral-200)]">
          {row.updated_at}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: StaticPage) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            type="button"
            onClick={() => setEditing(row)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--admin-neutral-400)] hover:text-blue-500 hover:bg-blue-500/10 transition text-base"
          >
            <i className="ph ph-note-pencil"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Manage Frontend Static Pages" />

      <AdminDataTable columns={columns} data={pages} emptyText="No pages found" />

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="admin-white-box w-full max-w-xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setEditing(null)}
              className="absolute top-4 right-4 text-[var(--admin-neutral-400)] hover:text-red-500 transition text-xl"
            >
              <i className="ph ph-x"></i>
            </button>
            <h3 className="text-lg font-bold text-[var(--admin-neutral-900)] dark:text-white mb-4">
              Edit {editing.title}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Page content updated!");
                setEditing(null);
              }}
              className="space-y-4"
            >
              <div>
                <label className="admin-form-label">Page Title</label>
                <input
                  type="text"
                  required
                  defaultValue={editing.title}
                  className="admin-form-control"
                />
              </div>

              <div>
                <label className="admin-form-label">Page Content (HTML/Markdown)</label>
                <textarea
                  rows={8}
                  defaultValue="<h3>1. Acceptance of Terms</h3><p>Welcome to Quizix. By accessing our platform, you agree to comply with our rules and fair-play standards...</p>"
                  className="admin-form-control font-mono text-xs"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="admin-btn-secondary text-xs py-2 px-4 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary text-xs py-2 px-4 rounded-lg font-medium"
                >
                  Save Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
