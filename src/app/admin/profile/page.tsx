"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useAdminAuthStore } from "@/stores/adminAuthStore";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminProfilePage() {
  const { user, login } = useAdminAuthStore();
  const [name, setName] = useState(user?.name || "Master Administrator");
  const [email, setEmail] = useState(user?.email || "admin@softivus.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      if (user) {
        login("mock-token", { ...user, name, email });
      }
      toast.success("Profile information updated successfully!");
    }, 500);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSavingPassword(true);
    setTimeout(() => {
      setSavingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed successfully!");
    }, 500);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Admin Profile & Security" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        {/* Profile Card */}
        <div className="admin-white-box p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
            <div className="w-12 h-12 rounded-full bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] flex items-center justify-center text-xl font-bold uppercase">
              {name.substring(0, 2)}
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
                Personal Information
              </h3>
              <p className="text-xs text-[var(--admin-neutral-200)]">
                Update your administrator account details
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="admin-form-label">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="admin-form-control"
              />
            </div>

            <div>
              <label className="admin-form-label">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-form-control"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="admin-btn-primary py-2.5 px-5 rounded-lg text-xs font-semibold inline-flex items-center gap-2"
              >
                {savingProfile && <i className="ph ph-spinner animate-spin"></i>}
                Save Profile
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="admin-white-box p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl">
              <i className="ph ph-lock-key"></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
                Change Password
              </h3>
              <p className="text-xs text-[var(--admin-neutral-200)]">
                Ensure your account is using a long, random password
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="admin-form-label">Current Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="admin-form-control"
              />
            </div>

            <div>
              <label className="admin-form-label">New Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="admin-form-control"
              />
            </div>

            <div>
              <label className="admin-form-label">Confirm New Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="admin-form-control"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingPassword}
                className="admin-btn-primary py-2.5 px-5 rounded-lg text-xs font-semibold inline-flex items-center gap-2"
              >
                {savingPassword && <i className="ph ph-spinner animate-spin"></i>}
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
