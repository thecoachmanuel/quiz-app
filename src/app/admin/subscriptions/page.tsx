"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

interface SubscriberItem {
  id: number;
  email: string;
  created_at: string;
}

const INITIAL_SUBS: SubscriberItem[] = [
  { id: 1, email: "john.doe@gmail.com", created_at: "2024-03-01 10:20" },
  { id: 2, email: "sarah.smith@yahoo.com", created_at: "2024-02-28 14:15" },
  { id: 3, email: "emily.rose@outlook.com", created_at: "2024-02-25 18:30" },
  { id: 4, email: "mark.zuck@meta.com", created_at: "2024-02-20 09:10" },
];

export default function AdminSubscriptionsPage() {
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>(INITIAL_SUBS);
  const [search, setSearch] = useState("");

  const handleDelete = (id: number) => {
    if (!confirm("Remove this subscriber?")) return;
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
    toast.success("Subscriber removed");
  };

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "email",
      label: "Subscriber Email",
      render: (row: SubscriberItem) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] flex items-center justify-center text-sm">
            <i className="ph ph-envelope-simple"></i>
          </div>
          <span className="font-semibold text-sm text-[var(--admin-neutral-900)] dark:text-white">
            {row.email}
          </span>
        </div>
      ),
    },
    {
      key: "date",
      label: "Subscribed Date",
      render: (row: SubscriberItem) => (
        <span className="text-xs text-[var(--admin-neutral-200)]">
          {row.created_at}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: SubscriberItem) => (
        <div className="flex items-center gap-1.5 justify-end">
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
        title="Newsletter Subscribers"
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search email..."
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        emptyText="No subscribers found"
      />
    </div>
  );
}
