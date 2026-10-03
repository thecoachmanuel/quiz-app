"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

interface SocialItem {
  id: number;
  name: string;
  url: string;
  icon: string;
  status: "active" | "inactive";
}

const INITIAL_SOCIALS: SocialItem[] = [
  { id: 1, name: "Facebook", url: "https://facebook.com/quizix", icon: "ph-facebook-logo", status: "active" },
  { id: 2, name: "Twitter / X", url: "https://x.com/quizix", icon: "ph-x-logo", status: "active" },
  { id: 3, name: "Instagram", url: "https://instagram.com/quizix", icon: "ph-instagram-logo", status: "active" },
  { id: 4, name: "Discord", url: "https://discord.gg/quizix", icon: "ph-discord-logo", status: "active" },
];

export default function SocialMediasPage() {
  const [socials, setSocials] = useState<SocialItem[]>(INITIAL_SOCIALS);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("ph-link");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    setSocials((prev) => [
      ...prev,
      { id: Date.now(), name, url, icon, status: "active" },
    ]);
    toast.success("Social link added");
    setModalOpen(false);
    setName("");
    setUrl("");
  };

  const columns = [
    {
      key: "name",
      label: "Platform",
      render: (row: SocialItem) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] flex items-center justify-center text-lg">
            <i className={`ph ${row.icon}`}></i>
          </div>
          <span className="font-bold text-sm text-[var(--admin-neutral-900)] dark:text-white">
            {row.name}
          </span>
        </div>
      ),
    },
    {
      key: "url",
      label: "Profile / Channel URL",
      render: (row: SocialItem) => (
        <a
          href={row.url}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-[var(--admin-primary)] hover:underline font-mono"
        >
          {row.url}
        </a>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: SocialItem) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            type="button"
            onClick={() => {
              setSocials((prev) => prev.filter((s) => s.id !== row.id));
              toast.success("Link deleted");
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
        title="Social Media Links"
        buttons={[
          {
            label: "Add Social Link",
            onClick: () => setModalOpen(true),
            icon: "ph ph-plus-circle",
            variant: "primary",
          },
        ]}
      />

      <AdminDataTable columns={columns} data={socials} emptyText="No social links found" />

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
              Add Social Profile
            </h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="admin-form-label">Platform Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. YouTube"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="admin-form-control"
                />
              </div>

              <div>
                <label className="admin-form-label">Profile URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://youtube.com/@quizix"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="admin-form-control"
                />
              </div>

              <div>
                <label className="admin-form-label">Phosphor Icon Class</label>
                <input
                  type="text"
                  placeholder="ph-youtube-logo"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="admin-form-control"
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
                  Add Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
