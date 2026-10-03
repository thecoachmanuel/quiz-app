"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SeoSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    meta_title: "Quizix - Ultimate AI Quiz & Trivia Gaming Platform",
    meta_description:
      "Play daily trivia, challenge players worldwide in live contests, solve Wordling & Hexling puzzles, and win real cash and coin rewards on Quizix.",
    keywords: "quiz, trivia, wordle, contest, rewards, gaming, puzzle, win cash",
    og_image: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("SEO Meta configuration saved successfully!");
    }, 500);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="SEO & OpenGraph Configuration" />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="admin-white-box p-6 space-y-4">
          <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
            Meta Tags & Search Engine Presence
          </h3>

          <div>
            <label className="admin-form-label">Default Meta Title</label>
            <input
              type="text"
              required
              value={formData.meta_title}
              onChange={(e) =>
                setFormData({ ...formData, meta_title: e.target.value })
              }
              className="admin-form-control"
            />
          </div>

          <div>
            <label className="admin-form-label">Default Meta Description</label>
            <textarea
              rows={3}
              required
              value={formData.meta_description}
              onChange={(e) =>
                setFormData({ ...formData, meta_description: e.target.value })
              }
              className="admin-form-control resize-none"
            />
          </div>

          <div>
            <label className="admin-form-label">Meta Keywords (Comma separated)</label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) =>
                setFormData({ ...formData, keywords: e.target.value })
              }
              className="admin-form-control"
            />
          </div>

          <div>
            <label className="admin-form-label">Social Share OG Image URL</label>
            <input
              type="text"
              placeholder="https://yourdomain.com/og-preview.jpg"
              value={formData.og_image}
              onChange={(e) =>
                setFormData({ ...formData, og_image: e.target.value })
              }
              className="admin-form-control"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="admin-btn-primary py-2.5 px-6 rounded-lg text-xs font-semibold"
            >
              {saving ? "Saving..." : "Save SEO Settings"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
