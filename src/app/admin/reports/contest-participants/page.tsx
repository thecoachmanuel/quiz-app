"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";

interface ParticipantItem {
  id: number;
  contest_title: string;
  user_name: string;
  user_email: string;
  score: number;
  rank: number;
  prize_won: number;
  joined_at: string;
}

const INITIAL_PARTICIPANTS: ParticipantItem[] = [
  {
    id: 1,
    contest_title: "Valentine Love & Cinema Trivia",
    user_name: "Sophia Chen",
    user_email: "sophia.c@example.com",
    score: 980,
    rank: 1,
    prize_won: 400,
    joined_at: "2024-02-14 11:20",
  },
  {
    id: 2,
    contest_title: "Valentine Love & Cinema Trivia",
    user_name: "Alex Morgan",
    user_email: "alex.morgan@example.com",
    score: 940,
    rank: 2,
    prize_won: 250,
    joined_at: "2024-02-14 12:45",
  },
  {
    id: 3,
    contest_title: "Weekend Mega Championship 2024",
    user_name: "Noah Johnson",
    user_email: "noah.j@example.com",
    score: 870,
    rank: 4,
    prize_won: 0,
    joined_at: "2024-03-01 10:15",
  },
];

export default function ContestParticipantsReportPage() {
  const [participants, setParticipants] =
    useState<ParticipantItem[]>(INITIAL_PARTICIPANTS);
  const [search, setSearch] = useState("");

  const filtered = participants.filter(
    (p) =>
      p.contest_title.toLowerCase().includes(search.toLowerCase()) ||
      p.user_name.toLowerCase().includes(search.toLowerCase()) ||
      p.user_email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "contest",
      label: "Contest",
      render: (row: ParticipantItem) => (
        <span className="font-semibold text-sm text-[var(--admin-neutral-900)] dark:text-white">
          {row.contest_title}
        </span>
      ),
    },
    {
      key: "user",
      label: "Player",
      render: (row: ParticipantItem) => (
        <div>
          <span className="font-medium text-xs text-[var(--admin-neutral-900)] dark:text-white">
            {row.user_name}
          </span>
          <p className="text-[11px] text-[var(--admin-neutral-200)]">
            {row.user_email}
          </p>
        </div>
      ),
    },
    {
      key: "rank",
      label: "Rank",
      render: (row: ParticipantItem) => (
        <span className="text-xs font-bold px-2 py-0.5 rounded bg-[var(--admin-primary)]/10 text-[var(--admin-primary)]">
          #{row.rank}
        </span>
      ),
    },
    {
      key: "score",
      label: "Score",
      render: (row: ParticipantItem) => (
        <span className="text-xs font-semibold text-amber-500">
          {row.score} pts
        </span>
      ),
    },
    {
      key: "prize",
      label: "Prize Won",
      render: (row: ParticipantItem) => (
        <span
          className={`text-xs font-bold ${
            row.prize_won > 0 ? "text-emerald-500" : "text-[var(--admin-neutral-300)]"
          }`}
        >
          {row.prize_won > 0 ? `$${row.prize_won.toFixed(2)}` : "—"}
        </span>
      ),
    },
    {
      key: "date",
      label: "Joined At",
      render: (row: ParticipantItem) => (
        <span className="text-xs text-[var(--admin-neutral-200)]">
          {row.joined_at}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Contest Participants & Scores"
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search player or contest..."
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        emptyText="No participant records found"
      />
    </div>
  );
}
