"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";

interface LoginLogItem {
  id: number;
  user_name: string;
  user_email: string;
  ip_address: string;
  browser: string;
  os: string;
  location: string;
  created_at: string;
}

const INITIAL_LOGS: LoginLogItem[] = [
  {
    id: 1,
    user_name: "Alex Morgan",
    user_email: "alex.morgan@example.com",
    ip_address: "192.168.1.101",
    browser: "Chrome 122",
    os: "Windows 11",
    location: "United States",
    created_at: "2024-03-03 16:10",
  },
  {
    id: 2,
    user_name: "Sophia Chen",
    user_email: "sophia.c@example.com",
    ip_address: "10.0.0.45",
    browser: "Safari 17",
    os: "macOS Sonoma",
    location: "Canada",
    created_at: "2024-03-03 14:05",
  },
  {
    id: 3,
    user_name: "David Miller",
    user_email: "d.miller@example.com",
    ip_address: "172.16.0.22",
    browser: "Firefox 123",
    os: "Ubuntu Linux",
    location: "Germany",
    created_at: "2024-03-02 20:30",
  },
  {
    id: 4,
    user_name: "Master Admin",
    user_email: "admin@softivus.com",
    ip_address: "127.0.0.1",
    browser: "Chrome 122",
    os: "Windows 11",
    location: "Localhost",
    created_at: "2024-03-03 16:25",
  },
];

export default function AdminLoginLogPage() {
  const [logs, setLogs] = useState<LoginLogItem[]>(INITIAL_LOGS);
  const [search, setSearch] = useState("");

  const filtered = logs.filter(
    (l) =>
      l.user_name.toLowerCase().includes(search.toLowerCase()) ||
      l.user_email.toLowerCase().includes(search.toLowerCase()) ||
      l.ip_address.includes(search) ||
      l.browser.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "user",
      label: "User",
      render: (row: LoginLogItem) => (
        <div>
          <span className="font-semibold text-sm text-[var(--admin-neutral-900)] dark:text-white">
            {row.user_name}
          </span>
          <p className="text-xs text-[var(--admin-neutral-200)]">{row.user_email}</p>
        </div>
      ),
    },
    {
      key: "ip",
      label: "IP Address",
      render: (row: LoginLogItem) => (
        <span className="font-mono text-xs text-[var(--admin-primary)]">
          {row.ip_address}
        </span>
      ),
    },
    {
      key: "browser",
      label: "Browser & OS",
      render: (row: LoginLogItem) => (
        <div className="text-xs text-[var(--admin-neutral-600)] dark:text-[var(--admin-neutral-300)]">
          <span>{row.browser}</span>
          <span className="text-[var(--admin-neutral-300)]"> on </span>
          <span>{row.os}</span>
        </div>
      ),
    },
    {
      key: "location",
      label: "Country / Location",
      render: (row: LoginLogItem) => (
        <span className="text-xs text-[var(--admin-neutral-400)]">
          {row.location}
        </span>
      ),
    },
    {
      key: "date",
      label: "Login Timestamp",
      render: (row: LoginLogItem) => (
        <span className="text-xs text-[var(--admin-neutral-200)]">
          {row.created_at}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="User & Admin Login Audit Log"
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search by user, email, IP, browser..."
      />

      <AdminDataTable columns={columns} data={filtered} emptyText="No logs found" />
    </div>
  );
}
