"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "read" | "unread";
  created_at: string;
}

const INITIAL_CONTACTS: ContactMessage[] = [
  {
    id: 1,
    name: "Michael Scott",
    email: "m.scott@dunder.com",
    subject: "Partnership Inquiry for Corporate Quizzes",
    message:
      "Hello Quizix Team, We are looking to host custom company trivia tournaments for our staff and would love to discuss a bulk enterprise plan or custom branding options.",
    status: "unread",
    created_at: "2024-03-03 15:40",
  },
  {
    id: 2,
    name: "Rachel Green",
    email: "rachel.g@ralphlauren.com",
    subject: "Question Dispute in Entertainment Quiz #12",
    message:
      "Hi, in the 90s TV trivia quiz, question 4 lists the incorrect answer for the premiere air date. Could you please double check this? Thank you!",
    status: "read",
    created_at: "2024-03-02 10:15",
  },
];

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>(INITIAL_CONTACTS);
  const [search, setSearch] = useState("");
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);

  const openMessage = (msg: ContactMessage) => {
    setSelectedMsg(msg);
    if (msg.status === "unread") {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: "read" } : m))
      );
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this message?")) return;
    setMessages((prev) => prev.filter((m) => m.id !== id));
    toast.success("Message deleted");
    if (selectedMsg?.id === id) setSelectedMsg(null);
  };

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "sender",
      label: "Sender",
      render: (row: ContactMessage) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-[var(--admin-neutral-900)] dark:text-white">
              {row.name}
            </span>
            {row.status === "unread" && (
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            )}
          </div>
          <p className="text-xs text-[var(--admin-neutral-200)]">{row.email}</p>
        </div>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      render: (row: ContactMessage) => (
        <span
          onClick={() => openMessage(row)}
          className="text-xs font-medium text-[var(--admin-neutral-500)] dark:text-[var(--admin-neutral-300)] hover:text-[var(--admin-primary)] cursor-pointer line-clamp-1"
        >
          {row.subject}
        </span>
      ),
    },
    {
      key: "date",
      label: "Received",
      render: (row: ContactMessage) => (
        <span className="text-xs text-[var(--admin-neutral-200)]">
          {row.created_at}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: ContactMessage) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            type="button"
            onClick={() => openMessage(row)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--admin-neutral-400)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-primary)]/10 transition text-base"
          >
            <i className="ph ph-envelope-open"></i>
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--admin-neutral-400)] hover:text-red-500 hover:bg-red-500/10 transition text-base"
          >
            <i className="ph ph-trash"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Contact Inquiries"
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search messages..."
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        emptyText="No contact messages found"
      />

      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="admin-white-box w-full max-w-lg p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedMsg(null)}
              className="absolute top-4 right-4 text-[var(--admin-neutral-400)] hover:text-red-500 transition text-xl"
            >
              <i className="ph ph-x"></i>
            </button>
            <h3 className="text-lg font-bold text-[var(--admin-neutral-900)] dark:text-white mb-1">
              {selectedMsg.subject}
            </h3>
            <p className="text-xs text-[var(--admin-neutral-200)] mb-4">
              From: <strong>{selectedMsg.name}</strong> ({selectedMsg.email}) on{" "}
              {selectedMsg.created_at}
            </p>

            <div className="p-4 rounded-lg bg-[var(--admin-neutral-10)] dark:bg-[var(--admin-neutral-900)] border border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)] text-xs text-[var(--admin-neutral-600)] dark:text-[var(--admin-neutral-200)] leading-relaxed whitespace-pre-wrap">
              {selectedMsg.message}
            </div>

            <div className="flex justify-between items-center pt-5">
              <button
                type="button"
                onClick={() => handleDelete(selectedMsg.id)}
                className="admin-btn-danger text-xs py-2 px-3.5 rounded-lg font-medium"
              >
                Delete Message
              </button>
              <a
                href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(
                  selectedMsg.subject
                )}`}
                className="admin-btn-primary text-xs py-2 px-4 rounded-lg font-medium inline-flex items-center gap-1.5"
              >
                <i className="ph ph-paper-plane-tilt"></i>
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
