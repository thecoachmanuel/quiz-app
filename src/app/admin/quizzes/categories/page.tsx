"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

import { useQuizStore, CategoryItem } from "@/stores/quizStore";

export default function QuizCategoriesPage() {
  const categories = useQuizStore((state) => state.categories);
  const addCategory = useQuizStore((state) => state.addCategory);
  const updateCategory = useQuizStore((state) => state.updateCategory);
  const deleteCategory = useQuizStore((state) => state.deleteCategory);

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formIcon, setFormIcon] = useState("ph-folder");

  const openAdd = () => {
    setEditingCategory(null);
    setFormTitle("");
    setFormIcon("ph-folder");
    setModalOpen(true);
  };

  const openEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormTitle(cat.title);
    setFormIcon(cat.icon);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.error("Title is required");
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        title: formTitle.trim(),
        icon: formIcon,
      });
      toast.success("Category updated successfully");
    } else {
      addCategory({
        title: formTitle.trim(),
        slug: "",
        icon: formIcon,
        quizzes_count: 0,
        status: "active",
      });
      toast.success("Category created successfully");
    }
    setModalOpen(false);
  };

  const toggleStatus = (id: number) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    const next = cat.status === "active" ? "inactive" : "active";
    updateCategory(id, { status: next });
    toast.success(`Category ${cat.title} is now ${next}`);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure?")) return;
    deleteCategory(id);
    toast.success("Category deleted");
  };

  const filtered = categories.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "category",
      label: "Category",
      render: (row: CategoryItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] flex items-center justify-center text-xl shrink-0">
            <i className={`ph ${row.icon}`}></i>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-[var(--admin-neutral-900)] dark:text-white">
              {row.title}
            </h4>
            <span className="text-xs text-[var(--admin-neutral-200)]">
              /{row.slug}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "quizzes_count",
      label: "Quizzes",
      render: (row: CategoryItem) => (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--admin-neutral-10)] dark:bg-[var(--admin-neutral-900)] text-[var(--admin-neutral-400)]">
          {row.quizzes_count} Quizzes
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: CategoryItem) => (
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
      render: (row: CategoryItem) => (
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
        <span>Categories</span>
      </div>

      <AdminPageHeader
        title="Quiz Categories"
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
        data={filtered}
        emptyText="No categories found"
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
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="admin-form-label">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. World Literature"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="admin-form-control"
                />
              </div>

              <div>
                <label className="admin-form-label">Phosphor Icon Class</label>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-[var(--admin-neutral-20)] dark:bg-[var(--admin-neutral-800)] flex items-center justify-center text-xl shrink-0 text-[var(--admin-primary)]">
                    <i className={`ph ${formIcon}`}></i>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. ph-books or ph-globe"
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="admin-form-control"
                  />
                </div>
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
                  {editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
