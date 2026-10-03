"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";

interface ContestReport {
  id: number;
  contest: string;
  category: string;
  participants: number;
  total_entry_coins: number;
  prize_pool_usd: number;
  status: "active" | "ended";
}

const INITIAL_CONTEST_REPORTS: ContestReport[] = [
  {
    id: 1,
    contest: "Weekend Mega Championship 2024",
    category: "General Trivia",
    participants: 248,
    total_entry_coins: 12400,
    prize_pool_usd: 1500,
    status: "active",
  },
  {
    id: 2,
    contest: "Valentine Love & Cinema Trivia",
    category: "Entertainment",
    participants: 512,
    total_entry_coins: 12800,
    prize_pool_usd: 800,
    status: "ended",
  },
];

export default function ContestsReportPage() {
  const [reports, setReports] = useState<ContestReport[]>(INITIAL_CONTEST_REPORTS);
  const [search, setSearch] = useState("");

  const filtered = reports.filter(
    (r) =>
      r.contest.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "contest",
      label: "Contest",
      render: (row: ContestReport) => (
        <div>
          <span className="font-semibold text-sm text-[var(--admin-neutral-900)] dark:text-white">
            {row.contest}
          </span>
          <p className="text-xs text-[var(--admin-neutral-200)]">{row.category}</p>
        </div>
      ),
    },
    {
      key: "participants",
      label: "Participants",
      render: (row: ContestReport) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--admin-primary)]/10 text-[var(--admin-primary)]">
          {row.participants} players
        </span>
      ),
    },
    {
      key: "entry",
      label: "Total Entry Coins Collected",
      render: (row: ContestReport) => (
        <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
          <i className="ph-fill ph-coins"></i>
          <span>{row.total_entry_coins.toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: "prize",
      label: "Prize Pool",
      render: (row: ContestReport) => (
        <span className="font-bold text-xs text-emerald-500">
          ${row.prize_pool_usd.toFixed(2)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: ContestReport) => (
        <span
          className={`admin-badge ${
            row.status === "active" ? "admin-badge-success" : "admin-badge-neutral"
          } uppercase text-[10px]`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Contests Financial & Participation Report"
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search contest name..."
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        emptyText="No contest report records found"
      />
    </div>
  );
}
