"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";

interface BuyCoinItem {
  id: number;
  trx_id: string;
  user_name: string;
  coins_amount: number;
  price_usd: number;
  gateway: string;
  created_at: string;
}

const INITIAL_BUY_COINS: BuyCoinItem[] = [
  {
    id: 1,
    trx_id: "COIN-84729103",
    user_name: "Alex Morgan",
    coins_amount: 500,
    price_usd: 5.0,
    gateway: "Stripe",
    created_at: "2024-03-03 14:10",
  },
  {
    id: 2,
    trx_id: "COIN-39281045",
    user_name: "Sophia Chen",
    coins_amount: 2500,
    price_usd: 20.0,
    gateway: "PayPal",
    created_at: "2024-03-02 18:20",
  },
  {
    id: 3,
    trx_id: "COIN-91827364",
    user_name: "David Miller",
    coins_amount: 1000,
    price_usd: 9.99,
    gateway: "Braintree",
    created_at: "2024-02-28 11:00",
  },
];

export default function BuyCoinsReportPage() {
  const [items, setItems] = useState<BuyCoinItem[]>(INITIAL_BUY_COINS);
  const [search, setSearch] = useState("");

  const filtered = items.filter(
    (i) =>
      i.trx_id.toLowerCase().includes(search.toLowerCase()) ||
      i.user_name.toLowerCase().includes(search.toLowerCase()) ||
      i.gateway.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "trx",
      label: "Purchase TRX",
      render: (row: BuyCoinItem) => (
        <span className="font-mono font-semibold text-xs text-[var(--admin-primary)]">
          {row.trx_id}
        </span>
      ),
    },
    {
      key: "user",
      label: "Buyer",
      render: (row: BuyCoinItem) => (
        <span className="font-semibold text-xs text-[var(--admin-neutral-900)] dark:text-white">
          {row.user_name}
        </span>
      ),
    },
    {
      key: "coins",
      label: "Coins Purchased",
      render: (row: BuyCoinItem) => (
        <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
          <i className="ph-fill ph-coins"></i>
          <span>+{row.coins_amount.toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: "price",
      label: "Amount Paid",
      render: (row: BuyCoinItem) => (
        <span className="text-xs font-bold text-emerald-500">
          ${row.price_usd.toFixed(2)}
        </span>
      ),
    },
    {
      key: "gateway",
      label: "Payment Gateway",
      render: (row: BuyCoinItem) => (
        <span className="text-xs font-medium px-2 py-0.5 rounded bg-[var(--admin-neutral-10)] dark:bg-[var(--admin-neutral-900)] text-[var(--admin-neutral-400)]">
          {row.gateway}
        </span>
      ),
    },
    {
      key: "date",
      label: "Purchase Time",
      render: (row: BuyCoinItem) => (
        <span className="text-xs text-[var(--admin-neutral-200)]">
          {row.created_at}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Coin Purchases Sales Report"
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search buyer or transaction..."
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        emptyText="No coin purchase records found"
      />
    </div>
  );
}
