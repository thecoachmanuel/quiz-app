"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ServicesSettingsPage() {
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState("G-XYZ12345");
  const [facebookPixelId, setFacebookPixelId] = useState("1234567890");
  const [tawkToId, setTawkToId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("External analytics & third-party services saved!");
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="External Services & Analytics" />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="admin-white-box p-6 space-y-4">
          <div>
            <label className="admin-form-label">Google Analytics 4 Measurement ID</label>
            <input
              type="text"
              placeholder="G-..."
              value={googleAnalyticsId}
              onChange={(e) => setGoogleAnalyticsId(e.target.value)}
              className="admin-form-control font-mono text-xs"
            />
          </div>

          <div>
            <label className="admin-form-label">Meta / Facebook Pixel ID</label>
            <input
              type="text"
              placeholder="e.g. 1234567890"
              value={facebookPixelId}
              onChange={(e) => setFacebookPixelId(e.target.value)}
              className="admin-form-control font-mono text-xs"
            />
          </div>

          <div>
            <label className="admin-form-label">Tawk.to Live Chat Property ID</label>
            <input
              type="text"
              placeholder="Optional live chat widget key"
              value={tawkToId}
              onChange={(e) => setTawkToId(e.target.value)}
              className="admin-form-control font-mono text-xs"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="admin-btn-primary py-2.5 px-6 rounded-lg text-xs font-semibold"
            >
              Save Services
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
