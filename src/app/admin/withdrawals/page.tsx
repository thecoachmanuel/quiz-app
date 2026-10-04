"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader, { TabButton } from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

import { useFinanceStore, WithdrawalItem } from "@/stores/financeStore";

export default function AdminWithdrawalsPage() {
  const withdrawals = useFinanceStore((state) => state.withdrawals);
  const approveWithdrawal = useFinanceStore((state) => state.approveWithdrawal);
  const rejectWithdrawal = useFinanceStore((state) => state.rejectWithdrawal);

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<WithdrawalItem | null>(null);

  const handleAction = (id: number, newStatus: "approved" | "rejected") => {
    if (newStatus === "approved") {
      approveWithdrawal(id);
    } else {
      rejectWithdrawal(id);
    }
    toast.success(
      `Withdrawal #${id} has been ${newStatus === "approved" ? "approved & paid" : "rejected"}`
    );
    setSelectedItem(null);
  };

  const tabs: TabButton[] = [
    { label: "All Withdrawals", key: "all", count: withdrawals.length },
    {
      label: "Pending",
      key: "pending",
      count: withdrawals.filter((w) => w.status === "pending").length,
    },
    {
      label: "Approved",
      key: "approved",
      count: withdrawals.filter((w) => w.status === "approved").length,
    },
    {
      label: "Rejected",
      key: "rejected",
      count: withdrawals.filter((w) => w.status === "rejected").length,
    },
  ];

  const filtered = withdrawals.filter((w) => {
    if (activeTab === "pending" && w.status !== "pending") return false;
    if (activeTab === "approved" && w.status !== "approved") return false;
    if (activeTab === "rejected" && w.status !== "rejected") return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        w.trx_id.toLowerCase().includes(q) ||
        w.user_name.toLowerCase().includes(q) ||
        w.user_email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const columns = [
    {
      key: "trx",
      label: "Transaction ID",
      render: (row: WithdrawalItem) => (
        <span className="font-mono font-semibold text-xs text-[var(--admin-primary)]">
          {row.trx_id}
        </span>
      ),
    },
    {
      key: "user",
      label: "User",
      render: (row: WithdrawalItem) => (
        <div>
          <span className="font-semibold text-sm text-[var(--admin-neutral-900)] dark:text-white">
            {row.user_name}
          </span>
          <p className="text-xs text-[var(--admin-neutral-200)]">{row.user_email}</p>
        </div>
      ),
    },
    {
      key: "method",
      label: "Payout Method",
      render: (row: WithdrawalItem) => (
        <div>
          <span className="text-xs font-semibold text-[var(--admin-neutral-900)] dark:text-white">
            {row.method}
          </span>
          <p className="text-[11px] text-[var(--admin-neutral-200)] truncate max-w-[180px]">
            {row.account_info || "—"}
          </p>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Payout Amount",
      render: (row: WithdrawalItem) => (
        <div>
          <span className="font-bold text-xs text-[var(--admin-neutral-900)] dark:text-white">
            ${row.final_amount.toFixed(2)}
          </span>
          <p className="text-[10px] text-[var(--admin-neutral-200)]">
            Req: ${row.amount.toFixed(2)}
          </p>
        </div>
      ),
    },
    {
      key: "date",
      label: "Requested Date",
      render: (row: WithdrawalItem) => (
        <span className="text-xs text-[var(--admin-neutral-200)]">
          {row.created_at}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: WithdrawalItem) => {
        let cls = "admin-badge-warning";
        if (row.status === "approved") cls = "admin-badge-success";
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
      render: (row: WithdrawalItem) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            type="button"
            onClick={() => setSelectedItem(row)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--admin-neutral-400)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-primary)]/10 transition text-base"
          >
            <i className="ph ph-eye"></i>
          </button>
          {row.status === "pending" && (
            <>
              <button
                type="button"
                onClick={() => handleAction(row.id, "approved")}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-500/10 transition text-base"
                title="Approve Payout"
              >
                <i className="ph ph-check-circle"></i>
              </button>
              <button
                type="button"
                onClick={() => handleAction(row.id, "rejected")}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500/10 transition text-base"
                title="Reject Payout"
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
        title="Withdrawals Log"
        tabButtons={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search by transaction ID, user, method..."
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        emptyText="No withdrawal records found"
      />

      {/* Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="admin-white-box w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-[var(--admin-neutral-400)] hover:text-red-500 transition text-xl"
            >
              <i className="ph ph-x"></i>
            </button>
            <h3 className="text-lg font-bold text-[var(--admin-neutral-900)] dark:text-white mb-4">
              Withdrawal Request Details
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
                <span className="text-[var(--admin-neutral-200)]">Transaction ID</span>
                <span className="font-mono font-bold text-[var(--admin-primary)]">
                  {selectedItem.trx_id}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
                <span className="text-[var(--admin-neutral-200)]">User</span>
                <span className="font-semibold text-[var(--admin-neutral-900)] dark:text-white">
                  {selectedItem.user_name} ({selectedItem.user_email})
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
                <span className="text-[var(--admin-neutral-200)]">Method</span>
                <span className="font-medium text-[var(--admin-neutral-900)] dark:text-white">
                  {selectedItem.method}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
                <span className="text-[var(--admin-neutral-200)]">Account Details</span>
                <span className="font-mono font-medium text-[var(--admin-neutral-900)] dark:text-white">
                  {selectedItem.account_info || "—"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
                <span className="text-[var(--admin-neutral-200)]">Requested Amount</span>
                <span className="font-bold text-sm text-[var(--admin-neutral-900)] dark:text-white">
                  ${selectedItem.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
                <span className="text-[var(--admin-neutral-200)]">Gateway Fee</span>
                <span className="text-red-500 font-medium">
                  -${selectedItem.fee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
                <span className="text-[var(--admin-neutral-200)]">Net Payout</span>
                <span className="font-bold text-sm text-emerald-500">
                  ${selectedItem.final_amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
                <span className="text-[var(--admin-neutral-200)]">Status</span>
                <span className="uppercase font-bold text-[var(--admin-primary)]">
                  {selectedItem.status}
                </span>
              </div>
            </div>

            {selectedItem.status === "pending" && (
              <div className="flex gap-2 justify-end pt-5">
                <button
                  type="button"
                  onClick={() => handleAction(selectedItem.id, "rejected")}
                  className="admin-btn-danger text-xs py-2 px-4 rounded-lg font-medium"
                >
                  Reject Request
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(selectedItem.id, "approved")}
                  className="admin-btn-primary text-xs py-2 px-4 rounded-lg font-medium"
                >
                  Approve & Pay
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
