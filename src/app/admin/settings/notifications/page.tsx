"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

export default function NotificationSettingsPage() {
  const [smtp, setSmtp] = useState({
    host: "smtp.mailgun.org",
    port: 587,
    username: "postmaster@quizix.com",
    password: "••••••••••••",
    encryption: "tls",
    from_name: "Quizix Trivia",
    from_email: "noreply@quizix.com",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("SMTP Email settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Email & Notification Settings (SMTP)" />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="admin-white-box p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-2xl">
              <i className="ph ph-envelope-simple"></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
                SMTP Server Configuration
              </h3>
              <p className="text-xs text-[var(--admin-neutral-200)]">
                Used to dispatch password reset links, OTP codes, and contest announcements.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="admin-form-label">SMTP Host *</label>
              <input
                type="text"
                required
                value={smtp.host}
                onChange={(e) => setSmtp({ ...smtp, host: e.target.value })}
                className="admin-form-control"
              />
            </div>

            <div>
              <label className="admin-form-label">SMTP Port *</label>
              <input
                type="number"
                required
                value={smtp.port}
                onChange={(e) =>
                  setSmtp({ ...smtp, port: parseInt(e.target.value) || 587 })
                }
                className="admin-form-control"
              />
            </div>

            <div>
              <label className="admin-form-label">SMTP Username *</label>
              <input
                type="text"
                required
                value={smtp.username}
                onChange={(e) => setSmtp({ ...smtp, username: e.target.value })}
                className="admin-form-control"
              />
            </div>

            <div>
              <label className="admin-form-label">SMTP Password *</label>
              <input
                type="password"
                required
                value={smtp.password}
                onChange={(e) => setSmtp({ ...smtp, password: e.target.value })}
                className="admin-form-control"
              />
            </div>

            <div>
              <label className="admin-form-label">Encryption Protocol</label>
              <select
                value={smtp.encryption}
                onChange={(e) => setSmtp({ ...smtp, encryption: e.target.value })}
                className="admin-form-control"
              >
                <option value="tls">TLS</option>
                <option value="ssl">SSL</option>
                <option value="none">None</option>
              </select>
            </div>

            <div>
              <label className="admin-form-label">Sender "From" Email</label>
              <input
                type="email"
                required
                value={smtp.from_email}
                onChange={(e) => setSmtp({ ...smtp, from_email: e.target.value })}
                className="admin-form-control"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="admin-btn-primary py-2.5 px-6 rounded-lg text-xs font-semibold"
            >
              Save SMTP Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
