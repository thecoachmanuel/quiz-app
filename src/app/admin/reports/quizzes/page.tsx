"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";

interface QuizReportItem {
  id: number;
  quiz_title: string;
  category: string;
  total_plays: number;
  pass_rate: number;
  avg_score: number;
  total_coins_awarded: number;
}

const MOCK_REPORTS: QuizReportItem[] = [
  {
    id: 1,
    quiz_title: "World Capitals & Geography Blitz",
    category: "Geography",
    total_plays: 1420,
    pass_rate: 68,
    avg_score: 74.2,
    total_coins_awarded: 71000,
  },
  {
    id: 2,
    quiz_title: "Mastering Science & Physics",
    category: "Science",
    total_plays: 980,
    pass_rate: 54,
    avg_score: 62.5,
    total_coins_awarded: 98000,
  },
  {
    id: 3,
    quiz_title: "Ancient Civilizations & History",
    category: "History",
    total_plays: 2150,
    pass_rate: 81,
    avg_score: 83.1,
    total_coins_awarded: 64500,
  },
];

export default function AdminQuizzesReportPage() {
  const [reports, setReports] = useState<QuizReportItem[]>(MOCK_REPORTS);
  const [search, setSearch] = useState("");

  const filtered = reports.filter(
    (r) =>
      r.quiz_title.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "title",
      label: "Quiz Title",
      render: (row: QuizReportItem) => (
        <div>
          <span className="font-semibold text-sm text-[var(--admin-neutral-900)] dark:text-white">
            {row.quiz_title}
          </span>
          <p className="text-xs text-[var(--admin-neutral-200)]">{row.category}</p>
        </div>
      ),
    },
    {
      key: "plays",
      label: "Plays",
      render: (row: QuizReportItem) => (
        <span className="text-xs font-semibold text-[var(--admin-neutral-900)] dark:text-white">
          {row.total_plays.toLocaleString()}
        </span>
      ),
    },
    {
      key: "pass_rate",
      label: "Pass Rate",
      render: (row: QuizReportItem) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 rounded-full bg-[var(--admin-neutral-30)] dark:bg-[var(--admin-neutral-700)] overflow-hidden">
            <div
              className={`h-full ${
                row.pass_rate >= 70
                  ? "bg-emerald-500"
                  : row.pass_rate >= 50
                  ? "bg-amber-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${row.pass_rate}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-[var(--admin-neutral-700)] dark:text-[var(--admin-neutral-200)]">
            {row.pass_rate}%
          </span>
        </div>
      ),
    },
    {
      key: "avg_score",
      label: "Avg Score",
      render: (row: QuizReportItem) => (
        <span className="text-xs font-semibold text-[var(--admin-primary)]">
          {row.avg_score}%
        </span>
      ),
    },
    {
      key: "coins",
      label: "Total Coins Distributed",
      render: (row: QuizReportItem) => (
        <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
          <i className="ph-fill ph-coins"></i>
          <span>{row.total_coins_awarded.toLocaleString()}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quizzes Performance Analytics"
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search quizzes..."
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        emptyText="No quiz report data found"
      />
    </div>
  );
}
