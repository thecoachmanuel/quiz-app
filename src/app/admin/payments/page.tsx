"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";

interface PaymentLog {
  id: number;
  trx_id: string;
  user_name: string;
  user_email: string;
  gateway: string;
  amount: number;
  currency: string;
  status: "success" | "pending" | "failed";
  created_at: string;
}

const INITIAL_PAYMENTS: PaymentLog[] = [
  {
    id: 1,
    trx_id: "PAY-84729103",
    user_name: "Alex Morgan",
    user_email: "alex.morgan@example.com",
    gateway: "Stripe",
    amount: 19.99,
    currency: "USD",
    status: "success",
    created_at: "2024-03-02 18:40",
  },
  {
    id: 2,
    trx_id: "PAY-39281045",
    user_name: "Sophia Chen",
    user_email: "sophia.c@example.com",
    gateway: "PayPal",
    amount: 49.99,
    currency: "USD",
    status: "success",
    created_at: "2024-03-01 11:20",
  },
  {
    id: 3,
    trx_id: "PAY-91827364",
    user_name: "David Miller",
    user_email: "d.miller@example.com",
    gateway: "Braintree",
    amount: 9.99,
    currency: "USD",
    status: "failed",
    created_at: "2024-02-29 09:12",
  },
];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentLog[]>(INITIAL_PAYMENTS);
  const [search, setSearch] = useState("");

  const filtered = payments.filter(
    (p) =>
      p.trx_id.toLowerCase().includes(search.toLowerCase()) ||
      p.user_name.toLowerCase().includes(search.toLowerCase()) ||
      p.gateway.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "trx",
      label: "Transaction ID",
      render: (row: PaymentLog) => (
        <span className="font-mono font-semibold text-xs text-[var(--admin-primary)]">
          {row.trx_id}
        </span>
      ),
    },
    {
      key: "user",
      label: "Customer",
      render: (row: PaymentLog) => (
        <div>
          <span className="font-semibold text-sm text-[var(--admin-neutral-900)] dark:text-white">
            {row.user_name}
          </span>
          <p className="text-xs text-[var(--admin-neutral-200)]">{row.user_email}</p>
        </div>
      ),
    },
    {
      key: "gateway",
      label: "Gateway",
      render: (row: PaymentLog) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--admin-neutral-10)] dark:bg-[var(--admin-neutral-900)] text-[var(--admin-neutral-400)]">
          {row.gateway}
        </span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (row: PaymentLog) => (
        <span className="font-bold text-xs text-[var(--admin-neutral-900)] dark:text-white">
          ${row.amount.toFixed(2)} {row.currency}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: PaymentLog) => {
        let cls = "admin-badge-warning";
        if (row.status === "success") cls = "admin-badge-success";
        if (row.status === "failed") cls = "admin-badge-danger";
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
      render: (row: PaymentLog) => (
        <span className="text-xs text-[var(--admin-neutral-200)]">
          {row.created_at}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Payment History"
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search payments by TRX ID, user..."
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        emptyText="No payment history records found"
      />
    </div>
  );
}
