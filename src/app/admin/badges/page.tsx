"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

import { useBadgeStore, BadgeItem } from "@/stores/badgeStore";

export default function AdminBadgesPage() {
  const badges = useBadgeStore((state) => state.badges);
  const addBadge = useBadgeStore((state) => state.addBadge);
  const updateBadge = useBadgeStore((state) => state.updateBadge);
  const deleteBadge = useBadgeStore((state) => state.deleteBadge);
  const toggleBadgeStatus = useBadgeStore((state) => state.toggleBadgeStatus);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BadgeItem | null>(null);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [icon, setIcon] = useState("ph-medal");
  const [criteria, setCriteria] = useState("");
  const [reward, setReward] = useState(100);

  const openAdd = () => {
    setEditing(null);
    setTitle("");
    setDesc("");
    setIcon("ph-medal");
    setCriteria("");
    setReward(100);
    setModalOpen(true);
  };

  const openEdit = (b: BadgeItem) => {
    setEditing(b);
    setTitle(b.title);
    setDesc(b.description);
    setIcon(b.icon);
    setCriteria(b.criteria);
    setReward(b.reward_coins);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editing) {
      updateBadge(editing.id, {
        title: title.trim(),
        description: desc,
        icon,
        criteria,
        reward_coins: Number(reward),
      });
      toast.success("Badge updated");
    } else {
      addBadge({
        title: title.trim(),
        description: desc,
        icon,
        criteria,
        reward_coins: Number(reward),
        unlocked_count: 0,
        status: "active",
      });
      toast.success("Badge created");
    }
    setModalOpen(false);
  };

  const toggleStatus = (id: number) => {
    const badge = badges.find((b) => b.id === id);
    toggleBadgeStatus(id);
    if (badge) {
      const next = badge.status === "active" ? "inactive" : "active";
      toast.success(`Badge is now ${next}`);
    }
  };

  const columns = [
    {
      key: "badge",
      label: "Badge",
      render: (row: BadgeItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center text-xl shrink-0">
            <i className={`ph ${row.icon}`}></i>
          </div>
          <div>
            <span className="font-semibold text-sm text-[var(--admin-neutral-900)] dark:text-white">
              {row.title}
            </span>
            <p className="text-xs text-[var(--admin-neutral-200)] line-clamp-1">
              {row.description}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "criteria",
      label: "Criteria",
      render: (row: BadgeItem) => (
        <span className="text-xs font-medium px-2 py-1 rounded bg-[var(--admin-neutral-10)] dark:bg-[var(--admin-neutral-900)] text-[var(--admin-neutral-400)]">
          {row.criteria}
        </span>
      ),
    },
    {
      key: "reward",
      label: "Bonus Reward",
      render: (row: BadgeItem) => (
        <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
          <i className="ph-fill ph-coins"></i>
          <span>{row.reward_coins} coins</span>
        </div>
      ),
    },
    {
      key: "unlocked",
      label: "Players",
      render: (row: BadgeItem) => (
        <span className="text-xs text-[var(--admin-neutral-400)]">
          {row.unlocked_count} unlocked
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: BadgeItem) => (
        <button
          type="button"
          onClick={() => toggleStatus(row.id)}
          className={`admin-badge cursor-pointer ${
            row.status === "active"
              ? "admin-badge-success"
              : "admin-badge-warning"
          }`}
        >
          {row.status === "active" ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: BadgeItem) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            type="button"
            onClick={() => openEdit(row)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--admin-neutral-400)] hover:text-blue-500 hover:bg-blue-500/10 transition text-base"
          >
            <i className="ph ph-note-pencil"></i>
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm("Delete badge?")) {
                setBadges((prev) => prev.filter((b) => b.id !== row.id));
                toast.success("Badge deleted");
              }
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
        title="Badges & Achievements"
        buttons={[
          {
            label: "Add Badge",
            onClick: openAdd,
            icon: "ph ph-plus-circle",
            variant: "primary",
          },
        ]}
      />

      <AdminDataTable columns={columns} data={badges} emptyText="No badges found" />

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
              {editing ? "Edit Badge" : "Create New Badge"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="admin-form-label">Badge Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mastermind"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="admin-form-control"
                />
              </div>

              <div>
                <label className="admin-form-label">Icon Class</label>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl shrink-0">
                    <i className={`ph ${icon}`}></i>
                  </div>
                  <input
                    type="text"
                    placeholder="ph-medal, ph-crown, ph-shield-check"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="admin-form-control"
                  />
                </div>
              </div>

              <div>
                <label className="admin-form-label">Criteria</label>
                <input
                  type="text"
                  placeholder="e.g. Win 5 contests"
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                  className="admin-form-control"
                />
              </div>

              <div>
                <label className="admin-form-label">Reward Coins</label>
                <input
                  type="number"
                  min={0}
                  value={reward}
                  onChange={(e) => setReward(parseInt(e.target.value) || 0)}
                  className="admin-form-control"
                />
              </div>

              <div>
                <label className="admin-form-label">Description</label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="admin-form-control resize-none"
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
                  {editing ? "Save Changes" : "Create Badge"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
