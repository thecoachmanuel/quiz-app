"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

import { useQuizStore, LevelItem } from "@/stores/quizStore";

export default function QuizLevelsPage() {
  const levels = useQuizStore((state) => state.levels);
  const addLevel = useQuizStore((state) => state.addLevel);
  const updateLevel = useQuizStore((state) => state.updateLevel);
  const deleteLevel = useQuizStore((state) => state.deleteLevel);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<LevelItem | null>(null);
  const [title, setTitle] = useState("");
  const [minScore, setMinScore] = useState(60);
  const [bonusMultiplier, setBonusMultiplier] = useState(1.0);

  const openAdd = () => {
    setEditingLevel(null);
    setTitle("");
    setMinScore(60);
    setBonusMultiplier(1.0);
    setModalOpen(true);
  };

  const openEdit = (lvl: LevelItem) => {
    setEditingLevel(lvl);
    setTitle(lvl.title);
    setMinScore(lvl.min_score);
    setBonusMultiplier(lvl.bonus_multiplier);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (editingLevel) {
      updateLevel(editingLevel.id, {
        title: title.trim(),
        min_score: Number(minScore),
        bonus_multiplier: Number(bonusMultiplier),
      });
      toast.success("Level updated successfully");
    } else {
      addLevel({
        title: title.trim(),
        quizzes_count: 0,
        min_score: Number(minScore),
        bonus_multiplier: Number(bonusMultiplier),
      });
      toast.success("Level created successfully");
    }
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure?")) return;
    deleteLevel(id);
    toast.success("Level deleted");
  };

  const columns = [
    {
      key: "title",
      label: "Level Name",
      render: (row: LevelItem) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] font-bold flex items-center justify-center text-sm">
            <i className="ph ph-gauge"></i>
          </div>
          <span className="font-semibold text-sm text-[var(--admin-neutral-900)] dark:text-white">
            {row.title}
          </span>
        </div>
      ),
    },
    {
      key: "min_score",
      label: "Min Score to Pass",
      render: (row: LevelItem) => (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600">
          {row.min_score}%
        </span>
      ),
    },
    {
      key: "multiplier",
      label: "Reward Multiplier",
      render: (row: LevelItem) => (
        <span className="text-xs font-semibold text-amber-500">
          {row.bonus_multiplier}x
        </span>
      ),
    },
    {
      key: "quizzes",
      label: "Total Quizzes",
      render: (row: LevelItem) => (
        <span className="text-xs text-[var(--admin-neutral-400)]">
          {row.quizzes_count} Quizzes
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: LevelItem) => (
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
            onClick={() => handleDelete(row.id)}
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
      <div className="flex items-center gap-2 text-xs text-[var(--admin-neutral-200)] mb-1">
        <Link
          href="/admin/quizzes"
          className="hover:text-[var(--admin-primary)] transition flex items-center gap-1"
        >
          <i className="ph ph-arrow-left"></i>
          Back to Quizzes
        </Link>
        <span>/</span>
        <span>Levels</span>
      </div>

      <AdminPageHeader
        title="Difficulty Levels"
        buttons={[
          {
            label: "Add Level",
            onClick: openAdd,
            icon: "ph ph-plus-circle",
            variant: "primary",
          },
        ]}
      />

      <AdminDataTable
        columns={columns}
        data={levels}
        emptyText="No levels found"
      />

      {/* Add / Edit Modal */}
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
              {editingLevel ? "Edit Level" : "Add New Level"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="admin-form-label">Level Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="admin-form-control"
                />
              </div>

              <div>
                <label className="admin-form-label">Min Score to Pass (%)</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value) || 0)}
                  className="admin-form-control"
                />
              </div>

              <div>
                <label className="admin-form-label">Reward Multiplier</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  value={bonusMultiplier}
                  onChange={(e) =>
                    setBonusMultiplier(parseFloat(e.target.value) || 1.0)
                  }
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
                  {editingLevel ? "Save Changes" : "Create Level"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
