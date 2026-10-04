"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { useQuizStore } from "@/stores/quizStore";

export default function CreateQuizPage() {
  const router = useRouter();
  const addQuiz = useQuizStore((state) => state.addQuiz);
  const storeCategories = useQuizStore((state) => state.categories);
  const storeLevels = useQuizStore((state) => state.levels);

  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Geography",
    level: "Intermediate",
    duration_minutes: 5,
    passing_score: 70,
    reward_coins: 50,
    entry_fee: 0,
    description: "",
    status: "published" as "published" | "draft",
    image: "",
  });

  const categories = storeCategories.length
    ? storeCategories.map((c) => c.title)
    : [
        "Geography",
        "Science",
        "History",
        "Entertainment",
        "Technology",
        "Sports",
        "General Knowledge",
      ];

  const levels = storeLevels.length
    ? storeLevels.map((l) => l.title)
    : ["Beginner", "Intermediate", "Advanced", "Master"];

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
      toast.error("Please enter a quiz title");
      return;
    }

    setSubmitting(true);
    try {
      const created = addQuiz({
        title: formData.title.trim(),
        category: formData.category,
        level: formData.level,
        duration_minutes: Number(formData.duration_minutes) || 5,
        passing_score: Number(formData.passing_score) || 70,
        reward_coins: Number(formData.reward_coins) || 50,
        entry_fee: Number(formData.entry_fee) || 0,
        description: formData.description,
        status: formData.status,
        image: formData.image || "/quiz-banner.png",
        total_questions: 0,
        play_count: 0,
      });

      toast.success("Quiz created successfully! Now add questions.");
      router.push(`/admin/quizzes/${created.id}/questions`);
    } catch {
      toast.error("Failed to create quiz");
    } finally {
      setSubmitting(false);
    }
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
        <span>Create Quiz</span>
      </div>

      <AdminPageHeader title="Create New Quiz" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Info */}
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
                  placeholder="e.g. World Capitals & Geography Blitz"
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
                  placeholder="Describe this quiz, who it's for, and what knowledge is tested..."
                  value={formData.description}
                  onChange={handleChange}
                  className="admin-form-control resize-none"
                />
              </div>
            </div>

            {/* Rules & Rewards */}
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

          {/* Sidebar / Status & Image */}
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
                <p className="text-[11px] text-[var(--admin-neutral-200)] mt-1">
                  Leave blank to use default category cover
                </p>
              </div>

              <div className="pt-2 border-t border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
                <button
                  type="submit"
                  disabled={submitting}
                  className="admin-btn-primary w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
                >
                  {submitting && <i className="ph ph-spinner animate-spin"></i>}
                  {submitting ? "Saving Quiz..." : "Save & Proceed"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
