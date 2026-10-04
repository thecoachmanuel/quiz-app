"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader, { TabButton } from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

import { useFinanceStore, DepositItem } from "@/stores/financeStore";

export default function AdminDepositsPage() {
  const deposits = useFinanceStore((state) => state.deposits);
  const approveDeposit = useFinanceStore((state) => state.approveDeposit);
  const rejectDeposit = useFinanceStore((state) => state.rejectDeposit);

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedDeposit, setSelectedDeposit] = useState<DepositItem | null>(null);

  const handleAction = (id: number, newStatus: "completed" | "rejected") => {
    if (newStatus === "completed") {
      approveDeposit(id);
    } else {
      rejectDeposit(id);
    }
    toast.success(
      `Deposit #${id} has been ${newStatus === "completed" ? "approved" : "rejected"}`
    );
    setSelectedDeposit(null);
  };

  const tabs: TabButton[] = [
    { label: "All Deposits", key: "all", count: deposits.length },
    {
      label: "Pending",
      key: "pending",
      count: deposits.filter((d) => d.status === "pending").length,
    },
    {
      label: "Completed",
      key: "completed",
      count: deposits.filter((d) => d.status === "completed").length,
    },
    {
      label: "Rejected",
      key: "rejected",
      count: deposits.filter((d) => d.status === "rejected").length,
    },
  ];

  const filtered = deposits.filter((d) => {
    if (activeTab === "pending" && d.status !== "pending") return false;
    if (activeTab === "completed" && d.status !== "completed") return false;
    if (activeTab === "rejected" && d.status !== "rejected") return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        d.trx_id.toLowerCase().includes(q) ||
        d.user_name.toLowerCase().includes(q) ||
        d.user_email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const columns = [
    {
      key: "trx",
      label: "Transaction ID",
      render: (row: DepositItem) => (
        <span className="font-mono font-semibold text-xs text-[var(--admin-primary)]">
          {row.trx_id}
        </span>
      ),
    },
    {
      key: "user",
      label: "User",
      render: (row: DepositItem) => (
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
      render: (row: DepositItem) => (
        <span className="text-xs font-medium px-2 py-0.5 rounded bg-[var(--admin-neutral-10)] dark:bg-[var(--admin-neutral-900)] text-[var(--admin-neutral-400)]">
          {row.gateway}
        </span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (row: DepositItem) => (
        <div>
          <span className="font-bold text-xs text-[var(--admin-neutral-900)] dark:text-white">
            ${row.amount.toFixed(2)}
          </span>
          {row.fee > 0 && (
            <p className="text-[10px] text-[var(--admin-neutral-200)]">
              +${row.fee.toFixed(2)} fee
            </p>
          )}
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (row: DepositItem) => (
        <span className="text-xs text-[var(--admin-neutral-200)]">
          {row.created_at}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: DepositItem) => {
        let cls = "admin-badge-warning";
        if (row.status === "completed") cls = "admin-badge-success";
        if (row.status === "rejected") cls = "admin-badge-danger";
        return (
          <span className={`admin-badge ${cls} uppercase text-[10px]`}>
            {row.status}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: DepositItem) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            type="button"
            onClick={() => setSelectedDeposit(row)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--admin-neutral-400)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-primary)]/10 transition text-base"
          >
            <i className="ph ph-eye"></i>
          </button>
          {row.status === "pending" && (
            <>
              <button
                type="button"
                onClick={() => handleAction(row.id, "completed")}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-500/10 transition text-base"
                title="Approve"
              >
                <i className="ph ph-check-circle"></i>
              </button>
              <button
                type="button"
                onClick={() => handleAction(row.id, "rejected")}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500/10 transition text-base"
                title="Reject"
              >
                <i className="ph ph-x-circle"></i>
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Deposits Log"
        tabButtons={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search by transaction ID, user..."
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        emptyText="No deposit records found"
      />

      {/* Details Modal */}
      {selectedDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="admin-white-box w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedDeposit(null)}
              className="absolute top-4 right-4 text-[var(--admin-neutral-400)] hover:text-red-500 transition text-xl"
            >
              <i className="ph ph-x"></i>
            </button>
            <h3 className="text-lg font-bold text-[var(--admin-neutral-900)] dark:text-white mb-4">
              Deposit Details
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
                <span className="text-[var(--admin-neutral-200)]">Transaction ID</span>
                <span className="font-mono font-bold text-[var(--admin-primary)]">
                  {selectedDeposit.trx_id}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
                <span className="text-[var(--admin-neutral-200)]">User</span>
                <span className="font-semibold text-[var(--admin-neutral-900)] dark:text-white">
                  {selectedDeposit.user_name} ({selectedDeposit.user_email})
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
                <span className="text-[var(--admin-neutral-200)]">Gateway</span>
                <span className="font-medium text-[var(--admin-neutral-900)] dark:text-white">
                  {selectedDeposit.gateway}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
                <span className="text-[var(--admin-neutral-200)]">Amount</span>
                <span className="font-bold text-sm text-[var(--admin-neutral-900)] dark:text-white">
                  ${selectedDeposit.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
                <span className="text-[var(--admin-neutral-200)]">Status</span>
                <span className="uppercase font-bold text-[var(--admin-primary)]">
                  {selectedDeposit.status}
                </span>
              </div>
            </div>

            {selectedDeposit.status === "pending" && (
              <div className="flex gap-2 justify-end pt-5">
                <button
                  type="button"
                  onClick={() => handleAction(selectedDeposit.id, "rejected")}
                  className="admin-btn-danger text-xs py-2 px-4 rounded-lg font-medium"
                >
                  Reject Deposit
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(selectedDeposit.id, "completed")}
                  className="admin-btn-primary text-xs py-2 px-4 rounded-lg font-medium"
                >
                  Approve Deposit
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
