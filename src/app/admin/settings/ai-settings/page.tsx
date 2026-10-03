"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AiSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    api_key: "sk-proj-demo-openai-key-sample-placeholder",
    model: "gpt-4o-mini",
    temperature: 0.7,
    max_tokens: 1500,
    system_prompt:
      "You are an expert trivia quiz author. Generate high quality multiple choice trivia questions with 4 distinct options, exactly 1 correct answer, and an educational explanation.",
  });

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
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("AI Integration settings saved!");
    }, 600);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="AI Question Generator Settings" />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="admin-white-box p-6 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-2xl">
              <i className="ph-fill ph-sparkle"></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
                OpenAI Integration
              </h3>
              <p className="text-xs text-[var(--admin-neutral-200)]">
                Powers automatic trivia question generation across all quiz categories.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="admin-form-label">OpenAI API Key *</label>
              <input
                type="password"
                name="api_key"
                required
                value={formData.api_key}
                onChange={handleChange}
                className="admin-form-control font-mono text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-form-label">Model Selection</label>
                <select
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="admin-form-control"
                >
                  <option value="gpt-4o">GPT-4o (Highest Accuracy)</option>
                  <option value="gpt-4o-mini">GPT-4o Mini (Fast & Cost Efficient)</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Legacy)</option>
                </select>
              </div>

              <div>
                <label className="admin-form-label">Creativity (Temperature)</label>
                <input
                  type="number"
                  step="0.1"
                  min={0.1}
                  max={1.0}
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  className="admin-form-control"
                />
              </div>
            </div>

            <div>
              <label className="admin-form-label">System Instruction Prompt</label>
              <textarea
                rows={4}
                name="system_prompt"
                value={formData.system_prompt}
                onChange={handleChange}
                className="admin-form-control resize-none text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={saving}
              className="admin-btn-primary py-2.5 px-6 rounded-lg text-xs font-semibold inline-flex items-center gap-2"
            >
              {saving && <i className="ph ph-spinner animate-spin"></i>}
              {saving ? "Saving..." : "Save AI Configuration"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
