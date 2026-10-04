"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader, { TabButton } from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

import { useSupportTicketStore, SupportTicket } from "@/stores/supportTicketStore";

export default function AdminSupportTicketsPage() {
  const tickets = useSupportTicketStore((state) => state.tickets);
  const replyTicket = useSupportTicketStore((state) => state.replyTicket);
  const updateStatus = useSupportTicketStore((state) => state.updateStatus);
  const deleteTicket = useSupportTicketStore((state) => state.deleteTicket);

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    replyTicket(selectedTicket.id, replyText.trim(), "Support Admin");

    setSelectedTicket((prev) =>
      prev
        ? {
            ...prev,
            status: "answered",
            messages: [
              ...prev.messages,
              {
                sender: "admin",
                sender_name: "Support Admin",
                message: replyText.trim(),
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ],
          }
        : null
    );

    setReplyText("");
    toast.success("Reply submitted to customer");
  };

  const handleCloseTicket = (id: number) => {
    updateStatus(id, "closed");
    setSelectedTicket((prev) => (prev ? { ...prev, status: "closed" } : null));
    toast.success("Ticket closed");
  };

  const tabs: TabButton[] = [
    { label: "All Tickets", key: "all", count: tickets.length },
    {
      label: "Open",
      key: "open",
      count: tickets.filter((t) => t.status === "open").length,
    },
    {
      label: "Answered",
      key: "answered",
      count: tickets.filter((t) => t.status === "answered").length,
    },
    {
      label: "Closed",
      key: "closed",
      count: tickets.filter((t) => t.status === "closed").length,
    },
  ];

  const filtered = tickets.filter((t) => {
    if (activeTab === "open" && t.status !== "open") return false;
    if (activeTab === "answered" && t.status !== "answered") return false;
    if (activeTab === "closed" && t.status !== "closed") return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.ticket_no.toLowerCase().includes(q) ||
        t.user_name.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const columns = [
    {
      key: "ticket",
      label: "Ticket #",
      render: (row: SupportTicket) => (
        <span className="font-mono font-bold text-xs text-[var(--admin-primary)]">
          {row.ticket_no}
        </span>
      ),
    },
    {
      key: "user",
      label: "User",
      render: (row: SupportTicket) => (
        <div>
          <span className="font-semibold text-sm text-[var(--admin-neutral-900)] dark:text-white">
            {row.user_name}
          </span>
          <p className="text-xs text-[var(--admin-neutral-200)]">{row.user_email}</p>
        </div>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      render: (row: SupportTicket) => (
        <span
          onClick={() => setSelectedTicket(row)}
          className="text-xs font-medium text-[var(--admin-neutral-600)] dark:text-[var(--admin-neutral-200)] hover:text-[var(--admin-primary)] cursor-pointer line-clamp-1"
        >
          {row.subject}
        </span>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      render: (row: SupportTicket) => {
        let cls = "text-gray-500 bg-gray-500/10";
        if (row.priority === "medium") cls = "text-amber-500 bg-amber-500/10";
        if (row.priority === "high") cls = "text-red-500 bg-red-500/10";
        return (
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${cls}`}
          >
            {row.priority}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (row: SupportTicket) => {
        let cls = "admin-badge-danger";
        if (row.status === "answered") cls = "admin-badge-info";
        if (row.status === "closed") cls = "admin-badge-neutral";
        return (
          <span className={`admin-badge ${cls} uppercase text-[10px]`}>
            {row.status}
          </span>
        );
      },
    },
    {
      key: "date",
      label: "Date",
      render: (row: SupportTicket) => (
        <span className="text-xs text-[var(--admin-neutral-200)]">
          {row.created_at}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: SupportTicket) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            type="button"
            onClick={() => setSelectedTicket(row)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--admin-neutral-400)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-primary)]/10 transition text-base"
          >
            <i className="ph ph-chat-teardrop-dots"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Support Tickets"
        tabButtons={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search tickets by subject, user, number..."
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        emptyText="No support tickets found"
      />

      {/* Ticket Thread Conversation Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="admin-white-box w-full max-w-2xl p-6 relative max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 text-[var(--admin-neutral-400)] hover:text-red-500 transition text-xl"
            >
              <i className="ph ph-x"></i>
            </button>

            {/* Header */}
            <div className="border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)] pb-4 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-bold text-xs text-[var(--admin-primary)]">
                  {selectedTicket.ticket_no}
                </span>
                <span className="text-xs text-[var(--admin-neutral-200)]">•</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--admin-neutral-400)]">
                  Priority: {selectedTicket.priority}
                </span>
                <span className="text-xs text-[var(--admin-neutral-200)]">•</span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    selectedTicket.status === "open"
                      ? "bg-red-500/10 text-red-500"
                      : selectedTicket.status === "answered"
                      ? "bg-blue-500/10 text-blue-500"
                      : "bg-gray-500/10 text-gray-400"
                  }`}
                >
                  {selectedTicket.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
                {selectedTicket.subject}
              </h3>
              <p className="text-xs text-[var(--admin-neutral-200)]">
                Submitted by {selectedTicket.user_name} ({selectedTicket.user_email})
              </p>
            </div>

            {/* Conversation Flow */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4 max-h-[360px]">
              {selectedTicket.messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl text-xs ${
                    m.sender === "admin"
                      ? "bg-[var(--admin-primary)]/10 text-[var(--admin-neutral-900)] dark:text-white border border-[var(--admin-primary)]/20 ml-6"
                      : "bg-[var(--admin-neutral-10)] dark:bg-[var(--admin-neutral-900)] text-[var(--admin-neutral-700)] dark:text-[var(--admin-neutral-200)] border border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)] mr-6"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5 font-bold">
                    <span>
                      {m.sender_name}{" "}
                      {m.sender === "admin" && (
                        <span className="text-[10px] bg-[var(--admin-primary)] text-white px-1.5 py-0.5 rounded ml-1">
                          STAFF
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] font-normal text-[var(--admin-neutral-400)]">
                      {m.time}
                    </span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>
                </div>
              ))}
            </div>

            {/* Reply Input Form */}
            {selectedTicket.status !== "closed" ? (
              <form onSubmit={handleSendReply} className="space-y-3 pt-3 border-t border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
                <textarea
                  rows={3}
                  required
                  placeholder="Type your official reply to this customer..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="admin-form-control resize-none text-xs"
                />
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => handleCloseTicket(selectedTicket.id)}
                    className="admin-btn-secondary text-xs py-2 px-3 rounded-lg font-medium"
                  >
                    Close Ticket
                  </button>
                  <button
                    type="submit"
                    className="admin-btn-primary text-xs py-2 px-5 rounded-lg font-semibold inline-flex items-center gap-1.5"
                  >
                    <i className="ph ph-paper-plane-tilt"></i>
                    Send Reply
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-3 text-center text-xs bg-gray-500/10 text-gray-400 rounded-lg">
                This ticket has been marked as closed.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
