"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

interface ContestCat {
  id: number;
  title: string;
  slug: string;
  contests_count: number;
  status: "active" | "inactive";
}

const INITIAL_CONTEST_CATS: ContestCat[] = [
  { id: 1, title: "General Trivia", slug: "general-trivia", contests_count: 12, status: "active" },
  { id: 2, title: "Technology", slug: "technology", contests_count: 8, status: "active" },
  { id: 3, title: "Science", slug: "science", contests_count: 6, status: "active" },
  { id: 4, title: "Sports", slug: "sports", contests_count: 14, status: "active" },
  { id: 5, title: "Entertainment", slug: "entertainment", contests_count: 9, status: "active" },
];

export default function ContestCategoriesPage() {
  const [categories, setCategories] = useState<ContestCat[]>(INITIAL_CONTEST_CATS);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ContestCat | null>(null);
  const [title, setTitle] = useState("");

  const openAdd = () => {
    setEditing(null);
    setTitle("");
    setModalOpen(true);
  };

  const openEdit = (cat: ContestCat) => {
    setEditing(cat);
    setTitle(cat.title);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    if (editing) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...c, title, slug } : c))
      );
      toast.success("Category updated");
    } else {
      setCategories((prev) => [
        ...prev,
        { id: Date.now(), title, slug, contests_count: 0, status: "active" },
      ]);
      toast.success("Category created");
    }
    setModalOpen(false);
  };

  const columns = [
    {
      key: "title",
      label: "Category Name",
      render: (row: ContestCat) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center text-sm">
            <i className="ph ph-trophy"></i>
          </div>
          <div>
            <span className="font-semibold text-sm text-[var(--admin-neutral-900)] dark:text-white">
              {row.title}
            </span>
            <p className="text-xs text-[var(--admin-neutral-200)]">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "count",
      label: "Contests",
      render: (row: ContestCat) => (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--admin-neutral-10)] dark:bg-[var(--admin-neutral-900)] text-[var(--admin-neutral-400)]">
          {row.contests_count} Contests
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: ContestCat) => (
        <span className="admin-badge admin-badge-success text-[10px] uppercase">
          {row.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: ContestCat) => (
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
              if (confirm("Delete category?")) {
                setCategories((prev) => prev.filter((c) => c.id !== row.id));
                toast.success("Category deleted");
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
      <div className="flex items-center gap-2 text-xs text-[var(--admin-neutral-200)] mb-1">
        <Link
          href="/admin/contests"
          className="hover:text-[var(--admin-primary)] transition flex items-center gap-1"
        >
          <i className="ph ph-arrow-left"></i>
          Back to Contests
        </Link>
        <span>/</span>
        <span>Categories</span>
      </div>

      <AdminPageHeader
        title="Contest Categories"
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search categories..."
        buttons={[
          {
            label: "Add Category",
            onClick: openAdd,
            icon: "ph ph-plus-circle",
            variant: "primary",
          },
        ]}
      />

      <AdminDataTable
        columns={columns}
        data={categories.filter((c) =>
          c.title.toLowerCase().includes(search.toLowerCase())
        )}
        emptyText="No contest categories found"
      />

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
              {editing ? "Edit Category" : "Add Contest Category"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="admin-form-label">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Olympiad"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  {editing ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
