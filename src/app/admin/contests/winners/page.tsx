"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Link from "next/link";
import { useState } from "react";

interface WinnerItem {
  id: number;
  contest_title: string;
  rank: number;
  user_name: string;
  user_email: string;
  score: number;
  prize_amount: number;
  awarded_at: string;
}

const MOCK_WINNERS: WinnerItem[] = [
  {
    id: 1,
    contest_title: "Valentine Love & Cinema Trivia",
    rank: 1,
    user_name: "Sophia Chen",
    user_email: "sophia.c@example.com",
    score: 980,
    prize_amount: 400,
    awarded_at: "2024-02-16",
  },
  {
    id: 2,
    contest_title: "Valentine Love & Cinema Trivia",
    rank: 2,
    user_name: "Alex Morgan",
    user_email: "alex.morgan@example.com",
    score: 940,
    prize_amount: 250,
    awarded_at: "2024-02-16",
  },
  {
    id: 3,
    contest_title: "Valentine Love & Cinema Trivia",
    rank: 3,
    user_name: "Noah Johnson",
    user_email: "noah.j@example.com",
    score: 910,
    prize_amount: 150,
    awarded_at: "2024-02-16",
  },
  {
    id: 4,
    contest_title: "Winter Tech Bowl 2024",
    rank: 1,
    user_name: "David Miller",
    user_email: "d.miller@example.com",
    score: 1000,
    prize_amount: 500,
    awarded_at: "2024-01-20",
  },
];

export default function ContestWinnersPage() {
  const [winners, setWinners] = useState<WinnerItem[]>(MOCK_WINNERS);
  const [search, setSearch] = useState("");

  const filtered = winners.filter(
    (w) =>
      w.contest_title.toLowerCase().includes(search.toLowerCase()) ||
      w.user_name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "rank",
      label: "Rank",
      render: (row: WinnerItem) => {
        let badgeColor = "bg-[var(--admin-neutral-30)] text-[var(--admin-neutral-700)]";
        let icon = "ph-trophy";
        if (row.rank === 1) {
          badgeColor = "bg-amber-500/20 text-amber-500 border border-amber-500/30";
          icon = "ph-crown-fill text-amber-500";
        } else if (row.rank === 2) {
          badgeColor = "bg-slate-300/30 text-slate-500 border border-slate-300";
          icon = "ph-medal text-slate-400";
        } else if (row.rank === 3) {
          badgeColor = "bg-amber-700/20 text-amber-700 border border-amber-700/30";
          icon = "ph-medal text-amber-700";
        }

        return (
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${badgeColor}`}
            >
              #{row.rank}
            </span>
          </div>
        );
      },
    },
    {
      key: "user",
      label: "Winner",
      render: (row: WinnerItem) => (
        <div>
          <span className="font-semibold text-sm text-[var(--admin-neutral-900)] dark:text-white">
            {row.user_name}
          </span>
          <p className="text-xs text-[var(--admin-neutral-200)]">{row.user_email}</p>
        </div>
      ),
    },
    {
      key: "contest",
      label: "Contest",
      render: (row: WinnerItem) => (
        <span className="text-xs font-medium text-[var(--admin-neutral-500)] dark:text-[var(--admin-neutral-300)]">
          {row.contest_title}
        </span>
      ),
    },
    {
      key: "score",
      label: "Final Score",
      render: (row: WinnerItem) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--admin-primary)]/10 text-[var(--admin-primary)]">
          {row.score} pts
        </span>
      ),
    },
    {
      key: "prize",
      label: "Prize Awarded",
      render: (row: WinnerItem) => (
        <span className="font-bold text-xs text-emerald-500">
          ${row.prize_amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: "date",
      label: "Awarded Date",
      render: (row: WinnerItem) => (
        <span className="text-xs text-[var(--admin-neutral-200)]">
          {row.awarded_at}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-[var(--admin-neutral-200)] mb-1">
        <Link
          href="/admin/contests"
          className="hover:text-[var(--admin-primary)] transition flex items-center gap-1"
        >
          <i className="ph ph-arrow-left"></i>
          Back to Contests
        </Link>
        <span>/</span>
        <span>Contest Winners</span>
      </div>

      <AdminPageHeader
        title="Contest Winners & Leaderboards"
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search by winner or contest..."
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        emptyText="No winners records found"
      />
    </div>
  );
}
