"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

interface MenuItem {
  id: number;
  label: string;
  url: string;
  order: number;
}

const INITIAL_NAV: MenuItem[] = [
  { id: 1, label: "Home", url: "/", order: 1 },
  { id: 2, label: "Quizzes", url: "/quizzes", order: 2 },
  { id: 3, label: "Contests", url: "/contests", order: 3 },
  { id: 4, label: "Wordling", url: "/games/wordling", order: 4 },
  { id: 5, label: "Leaderboard", url: "/leaderboard", order: 5 },
];

export default function NavigationMenuPage() {
  const [items, setItems] = useState<MenuItem[]>(INITIAL_NAV);
  const [modalOpen, setModalOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !url.trim()) return;

    setItems((prev) => [
      ...prev,
      { id: Date.now(), label, url, order: prev.length + 1 },
    ]);
    toast.success("Navigation item added");
    setModalOpen(false);
    setLabel("");
    setUrl("");
  };

  const columns = [
    {
      key: "order",
      label: "Order",
      render: (row: MenuItem) => (
        <span className="font-bold text-xs text-[var(--admin-neutral-400)]">
          #{row.order}
        </span>
      ),
    },
    {
      key: "label",
      label: "Menu Label",
      render: (row: MenuItem) => (
        <span className="font-bold text-sm text-[var(--admin-neutral-900)] dark:text-white">
          {row.label}
        </span>
      ),
    },
    {
      key: "url",
      label: "Link URL",
      render: (row: MenuItem) => (
        <span className="text-xs font-mono text-[var(--admin-primary)]">
          {row.url}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: MenuItem) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            type="button"
            onClick={() => {
              setItems((prev) => prev.filter((i) => i.id !== row.id));
              toast.success("Item removed");
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--admin-neutral-400)] hover:text-red-500 hover:bg-red-500/10 transition text-base"
          >
            <i className="ph ph-trash"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Frontend Header Navigation Menu"
        buttons={[
          {
            label: "Add Menu Item",
            onClick: () => setModalOpen(true),
            icon: "ph ph-plus-circle",
            variant: "primary",
          },
        ]}
      />

      <AdminDataTable columns={columns} data={items} emptyText="No menu items" />

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
              Add Menu Link
            </h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="admin-form-label">Link Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Badges"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="admin-form-control"
                />
              </div>

              <div>
                <label className="admin-form-label">Route URL *</label>
                <input
                  type="text"
                  required
                  placeholder="/badges"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="admin-form-control font-mono"
                />
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
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
