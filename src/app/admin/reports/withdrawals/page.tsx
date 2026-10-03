"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";

interface WithdrawalReportItem {
  id: number;
  trx_id: string;
  user_name: string;
  amount: number;
  fee: number;
  net_amount: number;
  method: string;
  status: "paid" | "rejected";
  processed_at: string;
}

const INITIAL_WITHDRAWAL_REPORTS: WithdrawalReportItem[] = [
  {
    id: 1,
    trx_id: "WD-58392019",
    user_name: "Sophia Chen",
    amount: 300.0,
    fee: 5.0,
    net_amount: 295.0,
    method: "Bank Transfer",
    status: "paid",
    processed_at: "2024-03-01 16:10",
  },
  {
    id: 2,
    trx_id: "WD-99482711",
    user_name: "David Miller",
    amount: 50.0,
    fee: 1.0,
    net_amount: 49.0,
    method: "Crypto (USDT)",
    status: "rejected",
    processed_at: "2024-02-27 12:00",
  },
];

export default function WithdrawalsReportPage() {
  const [reports, setReports] = useState<WithdrawalReportItem[]>(
    INITIAL_WITHDRAWAL_REPORTS
  );
  const [search, setSearch] = useState("");

  const filtered = reports.filter(
    (r) =>
      r.trx_id.toLowerCase().includes(search.toLowerCase()) ||
      r.user_name.toLowerCase().includes(search.toLowerCase()) ||
      r.method.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "trx",
      label: "TRX ID",
      render: (row: WithdrawalReportItem) => (
        <span className="font-mono font-semibold text-xs text-[var(--admin-primary)]">
          {row.trx_id}
        </span>
      ),
    },
    {
      key: "user",
      label: "User",
      render: (row: WithdrawalReportItem) => (
        <span className="font-semibold text-xs text-[var(--admin-neutral-900)] dark:text-white">
          {row.user_name}
        </span>
      ),
    },
    {
      key: "amount",
      label: "Gross Amount",
      render: (row: WithdrawalReportItem) => (
        <span className="text-xs font-semibold text-[var(--admin-neutral-700)] dark:text-[var(--admin-neutral-200)]">
          ${row.amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: "fee",
      label: "Fee",
      render: (row: WithdrawalReportItem) => (
        <span className="text-xs font-semibold text-red-500">
          -${row.fee.toFixed(2)}
        </span>
      ),
    },
    {
      key: "net",
      label: "Net Paid",
      render: (row: WithdrawalReportItem) => (
        <span className="text-xs font-bold text-emerald-500">
          ${row.net_amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: "method",
      label: "Method",
      render: (row: WithdrawalReportItem) => (
        <span className="text-xs font-medium px-2 py-0.5 rounded bg-[var(--admin-neutral-10)] dark:bg-[var(--admin-neutral-900)] text-[var(--admin-neutral-400)]">
          {row.method}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: WithdrawalReportItem) => (
        <span
          className={`admin-badge ${
            row.status === "paid" ? "admin-badge-success" : "admin-badge-danger"
          } uppercase text-[10px]`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "date",
      label: "Processed Date",
      render: (row: WithdrawalReportItem) => (
        <span className="text-xs text-[var(--admin-neutral-200)]">
          {row.processed_at}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Withdrawals Payouts Report"
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search withdrawals..."
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        emptyText="No withdrawal report records found"
      />
    </div>
  );
}
