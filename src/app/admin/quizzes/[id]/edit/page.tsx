"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function EditQuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params?.id;
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "World Capitals & Geography Blitz",
    category: "Geography",
    level: "Intermediate",
    duration_minutes: 5,
    passing_score: 70,
    reward_coins: 50,
    entry_fee: 0,
    description:
      "Test your global geographical knowledge! Can you guess capitals, famous landmarks, and continental borders?",
    status: "published",
    image: "",
  });

  const categories = [
    "Geography",
    "Science",
    "History",
    "Entertainment",
    "Technology",
    "Sports",
    "General Knowledge",
  ];

  const levels = ["Beginner", "Intermediate", "Advanced", "Master"];

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
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Quiz updated successfully!");
    }, 600);
  };

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
        <span>Edit Quiz #{quizId}</span>
      </div>

      <AdminPageHeader
        title={`Edit: ${formData.title}`}
        buttons={[
          {
            label: "Manage Questions (15)",
            href: `/admin/quizzes/${quizId}/questions`,
            icon: "ph ph-list-numbers",
            variant: "primary",
          },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="admin-white-box p-6 space-y-4">
              <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
                Quiz Details
              </h3>

              <div>
                <label className="admin-form-label">Quiz Title *</label>
                <input
                  type="text"
                  name="title"
                  required
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
                  <label className="admin-form-label">Difficulty Level *</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="admin-form-control"
                  >
                    {levels.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="admin-form-label">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="admin-form-control resize-none"
                />
              </div>
            </div>

            <div className="admin-white-box p-6 space-y-4">
              <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
                Timing & Coin Economy
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="admin-form-label">Duration (Mins)</label>
                  <input
                    type="number"
                    name="duration_minutes"
                    min={1}
                    value={formData.duration_minutes}
                    onChange={handleChange}
                    className="admin-form-control"
                  />
                </div>

                <div>
                  <label className="admin-form-label">Pass Score (%)</label>
                  <input
                    type="number"
                    name="passing_score"
                    min={10}
                    max={100}
                    value={formData.passing_score}
                    onChange={handleChange}
                    className="admin-form-control"
                  />
                </div>

                <div>
                  <label className="admin-form-label">Reward Coins</label>
                  <input
                    type="number"
                    name="reward_coins"
                    min={0}
                    value={formData.reward_coins}
                    onChange={handleChange}
                    className="admin-form-control"
                  />
                </div>

                <div>
                  <label className="admin-form-label">Entry Fee Coins</label>
                  <input
                    type="number"
                    name="entry_fee"
                    min={0}
                    value={formData.entry_fee}
                    onChange={handleChange}
                    className="admin-form-control"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="admin-white-box p-6 space-y-4">
              <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
                Publication
              </h3>

              <div>
                <label className="admin-form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="admin-form-control"
                >
                  <option value="published">Published (Live)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>

              <div>
                <label className="admin-form-label">Cover Image URL</label>
                <input
                  type="text"
                  name="image"
                  placeholder="https://example.com/quiz-thumb.jpg"
                  value={formData.image}
                  onChange={handleChange}
                  className="admin-form-control"
                />
              </div>

              <div className="pt-2 border-t border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
                <button
                  type="submit"
                  disabled={submitting}
                  className="admin-btn-primary w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
                >
                  {submitting && <i className="ph ph-spinner animate-spin"></i>}
                  {submitting ? "Updating Quiz..." : "Update Quiz"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
