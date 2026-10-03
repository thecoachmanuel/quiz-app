"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

export default function PwaSettingsPage() {
  const [formData, setFormData] = useState({
    app_name: "Quizix Trivia",
    short_name: "Quizix",
    theme_color: "#6366f1",
    background_color: "#1d1e24",
    display: "standalone",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Progressive Web App (PWA) manifest saved!");
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Progressive Web App (PWA) Manifest" />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="admin-white-box p-6 space-y-4">
          <div>
            <label className="admin-form-label">PWA App Name</label>
            <input
              type="text"
              value={formData.app_name}
              onChange={(e) =>
                setFormData({ ...formData, app_name: e.target.value })
              }
              className="admin-form-control"
            />
          </div>

          <div>
            <label className="admin-form-label">Short Name (Home screen label)</label>
            <input
              type="text"
              value={formData.short_name}
              onChange={(e) =>
                setFormData({ ...formData, short_name: e.target.value })
              }
              className="admin-form-control"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-form-label">Theme Color</label>
              <input
                type="text"
                value={formData.theme_color}
                onChange={(e) =>
                  setFormData({ ...formData, theme_color: e.target.value })
                }
                className="admin-form-control font-mono"
              />
            </div>
            <div>
              <label className="admin-form-label">Background Color</label>
              <input
                type="text"
                value={formData.background_color}
                onChange={(e) =>
                  setFormData({ ...formData, background_color: e.target.value })
                }
                className="admin-form-control font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="admin-btn-primary py-2.5 px-6 rounded-lg text-xs font-semibold"
            >
              Save PWA Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
