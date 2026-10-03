"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  coins: number;
  balance: number;
  status: "active" | "banned";
  email_verified: boolean;
  mobile_verified: boolean;
  two_factor_enabled: boolean;
  kyc_verified: boolean;
  joined_at: string;
  total_quizzes: number;
  total_contests: number;
  total_won: number;
}

const INITIAL_USER: UserProfile = {
  id: 1,
  first_name: "Alex",
  last_name: "Morgan",
  email: "alex.morgan@example.com",
  phone: "+1 555-0192",
  address: "742 Evergreen Terrace, Springfield, OR 97477",
  coins: 4850,
  balance: 145.5,
  status: "active",
  email_verified: true,
  mobile_verified: true,
  two_factor_enabled: false,
  kyc_verified: true,
  joined_at: "January 10, 2024",
  total_quizzes: 84,
  total_contests: 12,
  total_won: 320.0,
};

export default function AdminUserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id;

  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [formData, setFormData] = useState(INITIAL_USER);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "history">("profile");

  useEffect(() => {
    // Sync with id if loaded
  }, [userId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (key: keyof UserProfile) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setUser(formData);
      setSaving(false);
      toast.success("User information updated successfully!");
    }, 600);
  };

  const toggleBan = () => {
    const nextStatus = user.status === "active" ? "banned" : "active";
    setUser((prev) => ({ ...prev, status: nextStatus }));
    setFormData((prev) => ({ ...prev, status: nextStatus }));
    toast.success(
      `User ${nextStatus === "banned" ? "banned" : "activated"} successfully`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--admin-neutral-200)] mb-1">
            <Link
              href="/admin/users"
              className="hover:text-[var(--admin-primary)] transition flex items-center gap-1"
            >
              <i className="ph ph-arrow-left"></i>
              Back to Users
            </Link>
            <span>/</span>
            <span>User #{userId}</span>
          </div>
          <h2 className="text-xl font-bold text-[var(--admin-neutral-900)] dark:text-white">
            {user.first_name} {user.last_name}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              toast.success(`Logged in as ${user.email} in new session`);
            }}
            className="admin-btn-secondary inline-flex items-center gap-2 text-xs py-2 px-3.5 rounded-lg font-medium"
          >
            <i className="ph ph-sign-in text-base"></i>
            Sign in as User
          </button>
          <button
            type="button"
            onClick={toggleBan}
            className={`${
              user.status === "active" ? "admin-btn-danger" : "admin-btn-primary"
            } inline-flex items-center gap-2 text-xs py-2 px-3.5 rounded-lg font-medium`}
          >
            <i
              className={`ph ${
                user.status === "active" ? "ph-x-circle" : "ph-check-circle"
              } text-base`}
            ></i>
            {user.status === "active" ? "Ban User" : "Activate User"}
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="admin-white-box flex items-center gap-4 p-5">
          <div className="w-12 h-12 rounded-xl bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] flex items-center justify-center text-2xl shrink-0">
            <i className="ph ph-wallet"></i>
          </div>
          <div>
            <p className="text-xs text-[var(--admin-neutral-200)] font-medium">
              Account Balance
            </p>
            <h3 className="text-xl font-bold text-[var(--admin-neutral-900)] dark:text-white mt-0.5">
              ${user.balance.toFixed(2)}
            </h3>
          </div>
        </div>

        <div className="admin-white-box flex items-center gap-4 p-5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl shrink-0">
            <i className="ph-fill ph-coins"></i>
          </div>
          <div>
            <p className="text-xs text-[var(--admin-neutral-200)] font-medium">
              Coins Balance
            </p>
            <h3 className="text-xl font-bold text-[var(--admin-neutral-900)] dark:text-white mt-0.5">
              {user.coins.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="admin-white-box flex items-center gap-4 p-5">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-2xl shrink-0">
            <i className="ph ph-question"></i>
          </div>
          <div>
            <p className="text-xs text-[var(--admin-neutral-200)] font-medium">
              Total Quizzes
            </p>
            <h3 className="text-xl font-bold text-[var(--admin-neutral-900)] dark:text-white mt-0.5">
              {user.total_quizzes}
            </h3>
          </div>
        </div>

        <div className="admin-white-box flex items-center gap-4 p-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-2xl shrink-0">
            <i className="ph ph-trophy"></i>
          </div>
          <div>
            <p className="text-xs text-[var(--admin-neutral-200)] font-medium">
              Total Won
            </p>
            <h3 className="text-xl font-bold text-[var(--admin-neutral-900)] dark:text-white mt-0.5">
              ${user.total_won.toFixed(2)}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Form + Side Card */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Form: Edit Details */}
        <div className="col-span-12 lg:col-span-8">
          <div className="admin-white-box p-6">
            <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white mb-5">
              Information of {user.first_name} {user.last_name}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-form-label">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="admin-form-control"
                    required
                  />
                </div>
                <div>
                  <label className="admin-form-label">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="admin-form-control"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="admin-form-control"
                    required
                  />
                </div>
                <div>
                  <label className="admin-form-label">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="admin-form-control"
                  />
                </div>
              </div>

              <div>
                <label className="admin-form-label">Address</label>
                <textarea
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  className="admin-form-control resize-none"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="p-3 rounded-lg border border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)] flex flex-col justify-between">
                  <span className="text-xs font-semibold text-[var(--admin-neutral-400)] mb-2">
                    Email Verified
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggle("email_verified")}
                    className={`px-3 py-1 text-xs rounded-full font-medium transition ${
                      formData.email_verified
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-500 border border-red-500/20"
                    }`}
                  >
                    {formData.email_verified ? "Yes" : "No"}
                  </button>
                </div>

                <div className="p-3 rounded-lg border border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)] flex flex-col justify-between">
                  <span className="text-xs font-semibold text-[var(--admin-neutral-400)] mb-2">
                    Mobile Verified
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggle("mobile_verified")}
                    className={`px-3 py-1 text-xs rounded-full font-medium transition ${
                      formData.mobile_verified
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-500 border border-red-500/20"
                    }`}
                  >
                    {formData.mobile_verified ? "Yes" : "No"}
                  </button>
                </div>

                <div className="p-3 rounded-lg border border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)] flex flex-col justify-between">
                  <span className="text-xs font-semibold text-[var(--admin-neutral-400)] mb-2">
                    2FA Verification
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggle("two_factor_enabled")}
                    className={`px-3 py-1 text-xs rounded-full font-medium transition ${
                      formData.two_factor_enabled
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                    }`}
                  >
                    {formData.two_factor_enabled ? "Enabled" : "Disabled"}
                  </button>
                </div>

                <div className="p-3 rounded-lg border border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)] flex flex-col justify-between">
                  <span className="text-xs font-semibold text-[var(--admin-neutral-400)] mb-2">
                    KYC Verified
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggle("kyc_verified")}
                    className={`px-3 py-1 text-xs rounded-full font-medium transition ${
                      formData.kyc_verified
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    }`}
                  >
                    {formData.kyc_verified ? "Verified" : "Unverified"}
                  </button>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="admin-btn-primary w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
                >
                  {saving && <i className="ph ph-spinner animate-spin"></i>}
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Info Card */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="admin-white-box p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] font-bold text-2xl flex items-center justify-center mx-auto mb-3 border-2 border-[var(--admin-primary)]/20 uppercase">
              {user.first_name[0]}
              {user.last_name[0]}
            </div>
            <h4 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
              {user.first_name} {user.last_name}
            </h4>
            <p className="text-xs text-[var(--admin-neutral-200)] mt-0.5">
              {user.email}
            </p>
            <div className="inline-block mt-3">
              <span
                className={`admin-badge ${
                  user.status === "active"
                    ? "admin-badge-success"
                    : "admin-badge-danger"
                }`}
              >
                {user.status.toUpperCase()}
              </span>
            </div>

            <div className="mt-6 pt-5 border-t border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)] space-y-3 text-left">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[var(--admin-neutral-200)]">Joined</span>
                <span className="font-semibold text-[var(--admin-neutral-900)] dark:text-white">
                  {user.joined_at}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[var(--admin-neutral-200)]">Contests Joined</span>
                <span className="font-semibold text-[var(--admin-neutral-900)] dark:text-white">
                  {user.total_contests}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[var(--admin-neutral-200)]">KYC Status</span>
                <span
                  className={`font-semibold ${
                    user.kyc_verified ? "text-emerald-500" : "text-amber-500"
                  }`}
                >
                  {user.kyc_verified ? "Verified" : "Pending"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
