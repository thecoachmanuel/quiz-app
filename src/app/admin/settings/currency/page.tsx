"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

interface CurrencyItem {
  id: number;
  name: string;
  code: string;
  symbol: string;
  rate: number;
  is_default: boolean;
  status: "active" | "inactive";
}

const INITIAL_CURRENCIES: CurrencyItem[] = [
  { id: 1, name: "US Dollar", code: "USD", symbol: "$", rate: 1.0, is_default: true, status: "active" },
  { id: 2, name: "Euro", code: "EUR", symbol: "€", rate: 0.92, is_default: false, status: "active" },
  { id: 3, name: "British Pound", code: "GBP", symbol: "£", rate: 0.79, is_default: false, status: "active" },
  { id: 4, name: "Canadian Dollar", code: "CAD", symbol: "$", rate: 1.35, is_default: false, status: "active" },
  { id: 5, name: "Australian Dollar", code: "AUD", symbol: "$", rate: 1.52, is_default: false, status: "active" },
];

export default function CurrencySettingsPage() {
  const [currencies, setCurrencies] = useState<CurrencyItem[]>(INITIAL_CURRENCIES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CurrencyItem | null>(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [symbol, setSymbol] = useState("$");
  const [rate, setRate] = useState(1.0);

  const openAdd = () => {
    setEditing(null);
    setName("");
    setCode("");
    setSymbol("$");
    setRate(1.0);
    setModalOpen(true);
  };

  const openEdit = (c: CurrencyItem) => {
    setEditing(c);
    setName(c.name);
    setCode(c.code);
    setSymbol(c.symbol);
    setRate(c.rate);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    if (editing) {
      setCurrencies((prev) =>
        prev.map((c) =>
          c.id === editing.id ? { ...c, name, code: code.toUpperCase(), symbol, rate } : c
        )
      );
      toast.success("Currency updated");
    } else {
      setCurrencies((prev) => [
        ...prev,
        {
          id: Date.now(),
          name,
          code: code.toUpperCase(),
          symbol,
          rate,
          is_default: false,
          status: "active",
        },
      ]);
      toast.success("Currency added");
    }
    setModalOpen(false);
  };

  const setDefault = (id: number) => {
    setCurrencies((prev) =>
      prev.map((c) => ({ ...c, is_default: c.id === id }))
    );
    toast.success("Default base currency updated");
  };

  const columns = [
    {
      key: "currency",
      label: "Currency",
      render: (row: CurrencyItem) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-[var(--admin-neutral-900)] dark:text-white">
            {row.name}
          </span>
          <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-[var(--admin-neutral-20)] dark:bg-[var(--admin-neutral-800)] text-[var(--admin-primary)] font-semibold">
            {row.code} ({row.symbol})
          </span>
          {row.is_default && (
            <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
              Base
            </span>
          )}
        </div>
      ),
    },
    {
      key: "rate",
      label: "Exchange Rate (vs USD)",
      render: (row: CurrencyItem) => (
        <span className="text-xs font-semibold text-[var(--admin-neutral-900)] dark:text-white">
          1 USD = {row.rate} {row.code}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: CurrencyItem) => (
        <div className="flex items-center gap-1.5 justify-end">
          {!row.is_default && (
            <button
              type="button"
              onClick={() => setDefault(row.id)}
              className="text-[11px] font-semibold px-2 py-1 rounded bg-[var(--admin-neutral-10)] dark:bg-[var(--admin-neutral-800)] hover:bg-[var(--admin-primary)]/10 hover:text-[var(--admin-primary)] transition"
            >
              Make Base
            </button>
          )}
          <button
            type="button"
            onClick={() => openEdit(row)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--admin-neutral-400)] hover:text-blue-500 hover:bg-blue-500/10 transition text-base"
          >
            <i className="ph ph-note-pencil"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Currencies & Exchange Rates"
        buttons={[
          {
            label: "Add Currency",
            onClick: openAdd,
            icon: "ph ph-plus-circle",
            variant: "primary",
          },
        ]}
      />

      <AdminDataTable columns={columns} data={currencies} emptyText="No currencies found" />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="admin-white-box w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[var(--admin-neutral-400)] hover:text-red-500 transition text-xl"
            >
              <i className="ph ph-x"></i>
            </button>
            <h3 className="text-lg font-bold text-[var(--admin-neutral-900)] dark:text-white mb-4">
              {editing ? "Edit Currency" : "Add Currency"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="admin-form-label">Currency Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Japanese Yen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="admin-form-control"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-form-label">ISO Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="JPY"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="admin-form-control uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="admin-form-label">Symbol</label>
                  <input
                    type="text"
                    required
                    placeholder="¥"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="admin-form-control"
                  />
                </div>
              </div>

              <div>
                <label className="admin-form-label">Rate (1 USD = X Currency)</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value) || 1.0)}
                  className="admin-form-control"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="admin-btn-secondary text-xs py-2 px-4 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary text-xs py-2 px-4 rounded-lg font-medium"
                >
                  {editing ? "Save Changes" : "Create Currency"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
