"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader, { TabButton } from "@/components/admin/AdminPageHeader";
import { useState } from "react";

interface TransactionItem {
  id: number;
  trx_id: string;
  user_name: string;
  user_email: string;
  type: "+" | "-";
  amount: number;
  post_balance: number;
  charge: number;
  details: string;
  created_at: string;
}

const INITIAL_TRANSACTIONS: TransactionItem[] = [
  {
    id: 1,
    trx_id: "TX-99882143",
    user_name: "Alex Morgan",
    user_email: "alex.morgan@example.com",
    type: "+",
    amount: 100.0,
    post_balance: 145.5,
    charge: 0,
    details: "Deposit via Stripe Gateway",
    created_at: "2024-03-03 14:22",
  },
  {
    id: 2,
    trx_id: "TX-88773254",
    user_name: "Sophia Chen",
    user_email: "sophia.c@example.com",
    type: "+",
    amount: 250.0,
    post_balance: 380.0,
    charge: 0,
    details: "Won 2nd prize in Valentine Trivia Royale",
    created_at: "2024-02-16 11:30",
  },
  {
    id: 3,
    trx_id: "TX-77664365",
    user_name: "David Miller",
    user_email: "d.miller@example.com",
    type: "-",
    amount: 50.0,
    post_balance: 0.0,
    charge: 1.0,
    details: "Withdrawal request payout",
    created_at: "2024-02-27 12:00",
  },
  {
    id: 4,
    trx_id: "TX-66555476",
    user_name: "Noah Johnson",
    user_email: "noah.j@example.com",
    type: "+",
    amount: 40.0,
    post_balance: 512.25,
    charge: 0,
    details: "Referral commission bonus",
    created_at: "2024-02-25 09:15",
  },
];

export default function AdminTransactionsReportPage() {
  const [transactions, setTransactions] =
    useState<TransactionItem[]>(INITIAL_TRANSACTIONS);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const tabs: TabButton[] = [
    { label: "All Transactions", key: "all", count: transactions.length },
    {
      label: "Credits (+)",
      key: "credit",
      count: transactions.filter((t) => t.type === "+").length,
    },
    {
      label: "Debits (-)",
      key: "debit",
      count: transactions.filter((t) => t.type === "-").length,
    },
  ];

  const filtered = transactions.filter((t) => {
    if (activeTab === "credit" && t.type !== "+") return false;
    if (activeTab === "debit" && t.type !== "-") return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.trx_id.toLowerCase().includes(q) ||
        t.user_name.toLowerCase().includes(q) ||
        t.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const columns = [
    {
      key: "trx",
      label: "TRX ID",
      render: (row: TransactionItem) => (
        <span className="font-mono font-semibold text-xs text-[var(--admin-primary)]">
          {row.trx_id}
        </span>
      ),
    },
    {
      key: "user",
      label: "User",
      render: (row: TransactionItem) => (
        <div>
          <span className="font-semibold text-sm text-[var(--admin-neutral-900)] dark:text-white">
            {row.user_name}
          </span>
          <p className="text-xs text-[var(--admin-neutral-200)]">{row.user_email}</p>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (row: TransactionItem) => (
        <span
          className={`font-bold text-xs ${
            row.type === "+" ? "text-emerald-500" : "text-red-500"
          }`}
        >
          {row.type}${row.amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: "post_balance",
      label: "Post Balance",
      render: (row: TransactionItem) => (
        <span className="text-xs font-semibold text-[var(--admin-neutral-900)] dark:text-white">
          ${row.post_balance.toFixed(2)}
        </span>
      ),
    },
    {
      key: "details",
      label: "Details",
      render: (row: TransactionItem) => (
        <span className="text-xs text-[var(--admin-neutral-500)] dark:text-[var(--admin-neutral-300)]">
          {row.details}
        </span>
      ),
    },
    {
      key: "date",
      label: "Transacted At",
      render: (row: TransactionItem) => (
        <span className="text-xs text-[var(--admin-neutral-200)]">
          {row.created_at}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Transactions Ledger"
        tabButtons={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search TRX ID, user, or details..."
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        emptyText="No transactions found"
      />
    </div>
  );
}
