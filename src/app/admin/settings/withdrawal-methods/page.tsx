"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

interface MethodItem {
  id: number;
  name: string;
  min_limit: number;
  max_limit: number;
  fixed_charge: number;
  percent_charge: number;
  status: "active" | "inactive";
}

const INITIAL_METHODS: MethodItem[] = [
  { id: 1, name: "PayPal Direct", min_limit: 10, max_limit: 2000, fixed_charge: 1.0, percent_charge: 2.0, status: "active" },
  { id: 2, name: "Direct Bank Wire", min_limit: 50, max_limit: 5000, fixed_charge: 5.0, percent_charge: 1.0, status: "active" },
  { id: 3, name: "Crypto USDT (TRC20)", min_limit: 20, max_limit: 10000, fixed_charge: 1.0, percent_charge: 0.5, status: "active" },
];

export default function WithdrawalMethodsPage() {
  const [methods, setMethods] = useState<MethodItem[]>(INITIAL_METHODS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MethodItem | null>(null);

  const [name, setName] = useState("");
  const [minLimit, setMinLimit] = useState(10);
  const [maxLimit, setMaxLimit] = useState(2000);
  const [fixedFee, setFixedFee] = useState(1.0);
  const [percentFee, setPercentFee] = useState(2.0);

  const openAdd = () => {
    setEditing(null);
    setName("");
    setMinLimit(10);
    setMaxLimit(2000);
    setFixedFee(1.0);
    setPercentFee(2.0);
    setModalOpen(true);
  };

  const openEdit = (m: MethodItem) => {
    setEditing(m);
    setName(m.name);
    setMinLimit(m.min_limit);
    setMaxLimit(m.max_limit);
    setFixedFee(m.fixed_charge);
    setPercentFee(m.percent_charge);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editing) {
      setMethods((prev) =>
        prev.map((m) =>
          m.id === editing.id
            ? {
                ...m,
                name,
                min_limit: minLimit,
                max_limit: maxLimit,
                fixed_charge: fixedFee,
                percent_charge: percentFee,
              }
            : m
        )
      );
      toast.success("Method updated");
    } else {
      setMethods((prev) => [
        ...prev,
        {
          id: Date.now(),
          name,
          min_limit: minLimit,
          max_limit: maxLimit,
          fixed_charge: fixedFee,
          percent_charge: percentFee,
          status: "active",
        },
      ]);
      toast.success("Method added");
    }
    setModalOpen(false);
  };

  const toggleStatus = (id: number) => {
    setMethods((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "active" ? "inactive" : "active" }
          : m
      )
    );
  };

  const columns = [
    {
      key: "name",
      label: "Method",
      render: (row: MethodItem) => (
        <span className="font-bold text-sm text-[var(--admin-neutral-900)] dark:text-white">
          {row.name}
        </span>
      ),
    },
    {
      key: "limits",
      label: "Limits (Min - Max)",
      render: (row: MethodItem) => (
        <span className="text-xs font-semibold text-[var(--admin-neutral-700)] dark:text-[var(--admin-neutral-200)]">
          ${row.min_limit.toFixed(2)} — ${row.max_limit.toFixed(2)}
        </span>
      ),
    },
    {
      key: "charge",
      label: "Processing Charge",
      render: (row: MethodItem) => (
        <span className="text-xs text-red-500 font-medium">
          ${row.fixed_charge.toFixed(2)} + {row.percent_charge}%
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: MethodItem) => (
        <button
          type="button"
          onClick={() => toggleStatus(row.id)}
          className={`admin-badge cursor-pointer ${
            row.status === "active" ? "admin-badge-success" : "admin-badge-warning"
          }`}
        >
          {row.status}
        </button>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: MethodItem) => (
        <div className="flex items-center gap-1.5 justify-end">
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
        title="Withdrawal Payout Methods"
        buttons={[
          {
            label: "Add Method",
            onClick: openAdd,
            icon: "ph ph-plus-circle",
            variant: "primary",
          },
        ]}
      />

      <AdminDataTable columns={columns} data={methods} emptyText="No methods found" />

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
              {editing ? "Edit Payout Method" : "Add Payout Method"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="admin-form-label">Method Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bank Transfer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="admin-form-control"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-form-label">Min Limit ($)</label>
                  <input
                    type="number"
                    min={1}
                    value={minLimit}
                    onChange={(e) => setMinLimit(parseFloat(e.target.value) || 0)}
                    className="admin-form-control"
                  />
                </div>
                <div>
                  <label className="admin-form-label">Max Limit ($)</label>
                  <input
                    type="number"
                    min={1}
                    value={maxLimit}
                    onChange={(e) => setMaxLimit(parseFloat(e.target.value) || 0)}
                    className="admin-form-control"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-form-label">Fixed Fee ($)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    value={fixedFee}
                    onChange={(e) => setFixedFee(parseFloat(e.target.value) || 0)}
                    className="admin-form-control"
                  />
                </div>
                <div>
                  <label className="admin-form-label">Percent Fee (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    value={percentFee}
                    onChange={(e) => setPercentFee(parseFloat(e.target.value) || 0)}
                    className="admin-form-control"
                  />
                </div>
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
                  {editing ? "Save Changes" : "Create Method"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
