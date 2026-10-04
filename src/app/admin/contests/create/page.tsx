"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { useContestStore } from "@/stores/contestStore";

export default function CreateContestPage() {
  const router = useRouter();
  const addContest = useContestStore((state) => state.addContest);
  const storeCategories = useContestStore((state) => state.categories);

  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "General Trivia",
    start_time: "",
    end_time: "",
    entry_fee: 50,
    prize_pool: 1000,
    description: "",
    status: "upcoming" as "active" | "upcoming" | "ended",
  });

  const categories = storeCategories.length
    ? storeCategories.map((c) => c.title)
    : [
        "General Trivia",
        "Technology",
        "Science",
        "Sports",
        "Entertainment",
        "History",
      ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter a contest title");
      return;
    }

    setSubmitting(true);
    try {
      addContest({
        title: formData.title.trim(),
        category: formData.category,
        start_time: formData.start_time || new Date().toISOString(),
        end_time: formData.end_time || new Date(Date.now() + 86400000 * 3).toISOString(),
        entry_fee: Number(formData.entry_fee) || 0,
        prize_pool: Number(formData.prize_pool) || 1000,
        description: formData.description,
        status: formData.status,
        participants_count: 0,
        image: "/contest-image.png",
      });

      toast.success("Contest created successfully!");
      router.push("/admin/contests");
    } catch {
      toast.error("Failed to create contest");
    } finally {
      setSubmitting(false);
    }
  };

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
        <span>Create Contest</span>
      </div>

      <AdminPageHeader title="Create New Contest" />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="admin-white-box p-6 space-y-4">
          <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
            Contest Information
          </h3>

          <div>
            <label className="admin-form-label">Contest Title *</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Saturday Night Live Trivia Royale"
              value={formData.title}
              onChange={handleChange}
              className="admin-form-control"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="admin-form-label">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="admin-form-control"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="admin-form-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="admin-form-control"
              >
                <option value="upcoming">Upcoming</option>
                <option value="active">Active (Live Now)</option>
                <option value="ended">Ended</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="admin-form-label">Start Time *</label>
              <input
                type="datetime-local"
                name="start_time"
                required
                value={formData.start_time}
                onChange={handleChange}
                className="admin-form-control"
              />
            </div>

            <div>
              <label className="admin-form-label">End Time *</label>
              <input
                type="datetime-local"
                name="end_time"
                required
                value={formData.end_time}
                onChange={handleChange}
                className="admin-form-control"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="admin-form-label">Entry Fee (Coins)</label>
              <input
                type="number"
                name="entry_fee"
                min={0}
                value={formData.entry_fee}
                onChange={handleChange}
                className="admin-form-control"
              />
            </div>

            <div>
              <label className="admin-form-label">Prize Pool ($)</label>
              <input
                type="number"
                name="prize_pool"
                min={0}
                value={formData.prize_pool}
                onChange={handleChange}
                className="admin-form-control"
              />
            </div>
          </div>

          <div>
            <label className="admin-form-label">Rules & Description</label>
            <textarea
              name="description"
              rows={4}
              placeholder="Outline rules, tiebreakers, eligibility, etc..."
              value={formData.description}
              onChange={handleChange}
              className="admin-form-control resize-none"
            />
          </div>

          <div className="flex gap-2 justify-end pt-3">
            <button
              type="button"
              onClick={() => router.push("/admin/contests")}
              className="admin-btn-secondary text-xs py-2.5 px-4 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="admin-btn-primary text-xs py-2.5 px-6 rounded-lg font-semibold inline-flex items-center gap-2"
            >
              {submitting && <i className="ph ph-spinner animate-spin"></i>}
              {submitting ? "Publishing Contest..." : "Create Contest"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
