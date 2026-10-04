"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useUserStore } from "@/stores/userStore";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SendNotificationPage() {
  const [activeTab, setActiveTab] = useState<"email" | "sms">("email");
  const [recipientType, setRecipientType] = useState("all");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [template, setTemplate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const templates = [
    { id: "1", name: "Welcome New Users" },
    { id: "2", name: "Contest Reminder & Free Entry" },
    { id: "3", name: "Weekly Leaderboard Rewards" },
    { id: "4", name: "Account Security & 2FA Notice" },
  ];

  const handleTemplateSelect = (val: string) => {
    setTemplate(val);
    if (val === "1") {
      setSubject("Welcome to Quizix! Start your trivia journey today");
      setMessage(
        "Hi {{user_name}},\n\nWelcome to Quizix! We are thrilled to have you here. Jump into daily quizzes, earn coins, and compete with players worldwide.\n\nHappy Quizzing,\nThe Quizix Team"
      );
    } else if (val === "2") {
      setSubject("Special Contest Live Now: $500 Prize Pool!");
      setMessage(
        "Hi {{user_name}},\n\nA brand new trivia contest is live right now! Test your speed and knowledge for a chance to win from the prize pool.\n\nDon't miss out!"
      );
    } else if (val === "3") {
      setSubject("Your Weekly Coin Rewards Are Here!");
      setMessage(
        "Hi {{user_name}},\n\nCheck out your leaderboard standing this week and claim your reward coins in the app."
      );
    } else if (val === "4") {
      setSubject("Account Security: Enable 2FA on Quizix");
      setMessage(
        "Hi {{user_name}},\n\nProtect your account and rewards by enabling Two-Factor Authentication (2FA) in your profile settings today."
      );
    }
  };

  const sendNotification = useUserStore((state) => state.sendNotification);
  const users = useUserStore((state) => state.users);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in both subject and message");
      return;
    }

    setSubmitting(true);
    sendNotification({
      title: subject.trim(),
      message: message.trim(),
      target_audience: "all",
      recipients_count: users.length,
    });

    setSubmitting(false);
    toast.success(
      `${activeTab.toUpperCase()} notification dispatched and logged successfully!`
    );
    setSubject("");
    setMessage("");
    setTemplate("");
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Send Notification to Users" />

      <div className="admin-white-box p-6">
        {/* Tab switcher: Email vs SMS */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
          <div>
            <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
              Notification Channel
            </h3>
            <p className="text-xs text-[var(--admin-neutral-200)]">
              Choose the delivery method for this broadcast
            </p>
          </div>

          <div className="flex rounded-full p-1 border border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)] bg-[var(--admin-neutral-10)] dark:bg-[var(--admin-neutral-900)]">
            <button
              type="button"
              onClick={() => setActiveTab("email")}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full transition ${
                activeTab === "email"
                  ? "bg-[var(--admin-primary)] text-white shadow-sm"
                  : "text-[var(--admin-neutral-400)] hover:text-white"
              }`}
            >
              <i className="ph ph-envelope-simple text-sm"></i>
              Email Notification
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sms")}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full transition ${
                activeTab === "sms"
                  ? "bg-[var(--admin-primary)] text-white shadow-sm"
                  : "text-[var(--admin-neutral-400)] hover:text-white"
              }`}
            >
              <i className="ph ph-device-mobile text-sm"></i>
              SMS / Push Notification
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
          {/* Target audience */}
          <div>
            <label className="admin-form-label">Being Sent To</label>
            <select
              value={recipientType}
              onChange={(e) => setRecipientType(e.target.value)}
              className="admin-form-control"
            >
              <option value="all">All Registered Users</option>
              <option value="active">Active Users Only</option>
              <option value="unverified">Email Unverified Users</option>
              <option value="kyc_verified">KYC Verified Users</option>
              <option value="banned">Banned Users</option>
            </select>
          </div>

          {/* Quick template picker */}
          <div>
            <label className="admin-form-label">Preset Template (Optional)</label>
            <select
              value={template}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="admin-form-control"
            >
              <option value="">Select a Template to Prefill</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="admin-form-label">
              {activeTab === "email" ? "Email Subject" : "Notification Title"}
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Major Update: New Trivia Games & Rewards Available!"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="admin-form-control"
            />
          </div>

          {/* Body */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="admin-form-label mb-0">
                {activeTab === "email" ? "Email Body" : "Message Content"}
              </label>
              <div className="flex gap-1.5 text-[11px] text-[var(--admin-neutral-400)]">
                <span>Variables:</span>
                <code className="text-[var(--admin-primary)] font-mono">
                  &#123;&#123;user_name&#125;&#125;
                </code>
                <code className="text-[var(--admin-primary)] font-mono">
                  &#123;&#123;coins&#125;&#125;
                </code>
              </div>
            </div>
            <textarea
              rows={7}
              required
              placeholder="Write your message here. You can use dynamic variables like {{user_name}}..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="admin-form-control font-sans"
            />
          </div>

          {/* Submit action */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="admin-btn-primary py-2.5 px-6 rounded-lg text-xs font-semibold inline-flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <i className="ph ph-spinner animate-spin text-base"></i>
                  Sending Broadcast...
                </>
              ) : (
                <>
                  <i className="ph ph-paper-plane-tilt text-base"></i>
                  Send {activeTab.toUpperCase()} Notification
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setSubject("");
                setMessage("");
              }}
              className="admin-btn-secondary py-2.5 px-4 rounded-lg text-xs font-semibold"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
