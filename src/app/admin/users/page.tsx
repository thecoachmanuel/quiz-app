"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader, { TabButton } from "@/components/admin/AdminPageHeader";
import { adminFetch } from "@/configs/adminApi";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface UserItem {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  coins: number;
  balance: number;
  status: "active" | "banned";
  email_verified_at: string | null;
  is_kyc_verified: boolean;
  created_at: string;
}

const MOCK_USERS: UserItem[] = [
  {
    id: 1,
    first_name: "Alex",
    last_name: "Morgan",
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 555-0192",
    coins: 4850,
    balance: 145.5,
    status: "active",
    email_verified_at: "2024-01-15",
    is_kyc_verified: true,
    created_at: "2024-01-10",
  },
  {
    id: 2,
    first_name: "Sophia",
    last_name: "Chen",
    name: "Sophia Chen",
    email: "sophia.c@example.com",
    phone: "+1 555-0143",
    coins: 12200,
    balance: 380.0,
    status: "active",
    email_verified_at: "2024-01-18",
    is_kyc_verified: true,
    created_at: "2024-01-12",
  },
  {
    id: 3,
    first_name: "David",
    last_name: "Miller",
    name: "David Miller",
    email: "d.miller@example.com",
    phone: "+1 555-0188",
    coins: 350,
    balance: 0.0,
    status: "banned",
    email_verified_at: "2024-02-01",
    is_kyc_verified: false,
    created_at: "2024-01-28",
  },
  {
    id: 4,
    first_name: "Emma",
    last_name: "Watson",
    name: "Emma Watson",
    email: "emma.w@example.com",
    phone: "+44 20 7946 0912",
    coins: 6120,
    balance: 85.0,
    status: "active",
    email_verified_at: null,
    is_kyc_verified: false,
    created_at: "2024-02-05",
  },
  {
    id: 5,
    first_name: "Liam",
    last_name: "O'Connor",
    name: "Liam O'Connor",
    email: "liam.oc@example.com",
    phone: "+353 1 496 0123",
    coins: 840,
    balance: 20.0,
    status: "active",
    email_verified_at: "2024-02-10",
    is_kyc_verified: false,
    created_at: "2024-02-08",
  },
  {
    id: 6,
    first_name: "Noah",
    last_name: "Johnson",
    name: "Noah Johnson",
    email: "noah.j@example.com",
    phone: "+1 555-0177",
    coins: 15400,
    balance: 512.25,
    status: "active",
    email_verified_at: "2024-01-05",
    is_kyc_verified: true,
    created_at: "2024-01-02",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>(MOCK_USERS);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [balanceModal, setBalanceModal] = useState<{
    user: UserItem;
    type: "add" | "subtract";
  } | null>(null);
  const [modalAmount, setModalAmount] = useState("");
  const [modalRemark, setModalRemark] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminFetch("/users");
      if (res && res.data && Array.isArray(res.data)) {
        setUsers(res.data);
      }
    } catch {
      // Fallback to mock data for standalone preview
      setUsers(MOCK_USERS);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = (id: number) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const next = u.status === "active" ? "banned" : "active";
          toast.success(
            `User ${u.name} is now ${next === "banned" ? "banned" : "active"}`
          );
          return { ...u, status: next };
        }
        return u;
      })
    );
  };

  const handleBalanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!balanceModal) return;
    const amt = parseFloat(modalAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid positive number");
      return;
    }

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === balanceModal.user.id) {
          const newBal =
            balanceModal.type === "add"
              ? u.balance + amt
              : Math.max(0, u.balance - amt);
          return { ...u, balance: parseFloat(newBal.toFixed(2)) };
        }
        return u;
      })
    );

    toast.success(
      `${balanceModal.type === "add" ? "Added" : "Subtracted"} $${amt.toFixed(
        2
      )} ${balanceModal.type === "add" ? "to" : "from"} ${balanceModal.user.name}'s balance`
    );
    setBalanceModal(null);
    setModalAmount("");
    setModalRemark("");
  };

  // Filter tabs
  const tabCounts = {
    all: users.length,
    active: users.filter((u) => u.status === "active").length,
    banned: users.filter((u) => u.status === "banned").length,
    unverified_email: users.filter((u) => !u.email_verified_at).length,
    unverified_kyc: users.filter((u) => !u.is_kyc_verified).length,
  };

  const tabs: TabButton[] = [
    { label: "All Users", key: "all", count: tabCounts.all },
    { label: "Active", key: "active", count: tabCounts.active },
    { label: "Banned", key: "banned", count: tabCounts.banned },
    {
      label: "Email Unverified",
      key: "unverified_email",
      count: tabCounts.unverified_email,
    },
    {
      label: "KYC Unverified",
      key: "unverified_kyc",
      count: tabCounts.unverified_kyc,
    },
  ];

  const filteredUsers = users.filter((u) => {
    // Tab filter
    if (activeTab === "active" && u.status !== "active") return false;
    if (activeTab === "banned" && u.status !== "banned") return false;
    if (activeTab === "unverified_email" && u.email_verified_at) return false;
    if (activeTab === "unverified_kyc" && u.is_kyc_verified) return false;

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const columns = [
    {
      key: "user",
      label: "User",
      render: (row: UserItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] font-semibold flex items-center justify-center text-sm border border-[var(--admin-primary)]/20 uppercase shrink-0">
            {row.first_name[0]}
            {row.last_name ? row.last_name[0] : ""}
          </div>
          <div>
            <Link
              href={`/admin/users/${row.id}`}
              className="font-medium text-sm text-[var(--admin-neutral-900)] dark:text-white hover:text-[var(--admin-primary)] transition"
            >
              {row.name}
            </Link>
            <p className="text-xs text-[var(--admin-neutral-200)]">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (row: UserItem) => (
        <span className="text-xs text-[var(--admin-neutral-400)]">
          {row.phone || "—"}
        </span>
      ),
    },
    {
      key: "coins",
      label: "Coins",
      render: (row: UserItem) => (
        <div className="flex items-center gap-1.5 font-medium text-xs text-amber-500">
          <i className="ph-fill ph-coins text-sm"></i>
          <span>{row.coins.toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: "balance",
      label: "Balance",
      render: (row: UserItem) => (
        <span className="font-semibold text-xs text-[var(--admin-neutral-900)] dark:text-white">
          ${row.balance.toFixed(2)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: UserItem) => (
        <span
          className={`admin-badge ${
            row.status === "active" ? "admin-badge-success" : "admin-badge-danger"
          }`}
        >
          {row.status === "active" ? "Active" : "Banned"}
        </span>
      ),
    },
    {
      key: "kyc",
      label: "KYC",
      render: (row: UserItem) => (
        <span
          className={`admin-badge ${
            row.is_kyc_verified ? "admin-badge-success" : "admin-badge-warning"
          }`}
        >
          {row.is_kyc_verified ? "Verified" : "Pending"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: UserItem) => (
        <div className="flex items-center gap-1.5 justify-end">
          <Link
            href={`/admin/users/${row.id}`}
            title="View Details"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--admin-neutral-400)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-primary)]/10 transition text-base"
          >
            <i className="ph ph-eye"></i>
          </Link>
          <button
            type="button"
            title="Add Balance"
            onClick={() => setBalanceModal({ user: row, type: "add" })}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-500/10 transition text-base"
          >
            <i className="ph ph-plus-circle"></i>
          </button>
          <button
            type="button"
            title="Subtract Balance"
            onClick={() => setBalanceModal({ user: row, type: "subtract" })}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-500 hover:bg-amber-500/10 transition text-base"
          >
            <i className="ph ph-minus-circle"></i>
          </button>
          <button
            type="button"
            title={row.status === "active" ? "Ban User" : "Activate User"}
            onClick={() => handleToggleBan(row.id)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition text-base ${
              row.status === "active"
                ? "text-red-500 hover:bg-red-500/10"
                : "text-green-600 hover:bg-green-600/10"
            }`}
          >
            <i
              className={`ph ${
                row.status === "active" ? "ph-prohibit" : "ph-check-circle"
              }`}
            ></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Manage Users"
        tabButtons={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search by name, email, phone..."
        buttons={[
          {
            label: "Send Notification",
            href: "/admin/users/notifications",
            icon: "ph ph-paper-plane-tilt",
            variant: "secondary",
          },
        ]}
      />

      <AdminDataTable
        columns={columns}
        data={filteredUsers}
        loading={loading}
        emptyText="No users found matching your criteria"
      />

      {/* Balance Adjust Modal */}
      {balanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="admin-white-box w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setBalanceModal(null)}
              className="absolute top-4 right-4 text-[var(--admin-neutral-400)] hover:text-red-500 transition text-xl"
            >
              <i className="ph ph-x"></i>
            </button>
            <h3 className="text-lg font-bold text-[var(--admin-neutral-900)] dark:text-white mb-1">
              {balanceModal.type === "add" ? "Add Balance" : "Subtract Balance"}
            </h3>
            <p className="text-xs text-[var(--admin-neutral-200)] mb-4">
              {balanceModal.type === "add" ? "Credit" : "Debit"} balance for{" "}
              <strong className="text-[var(--admin-neutral-900)] dark:text-white">
                {balanceModal.user.name}
              </strong>{" "}
              (Current: ${balanceModal.user.balance.toFixed(2)})
            </p>

            <form onSubmit={handleBalanceSubmit} className="space-y-4">
              <div>
                <label className="admin-form-label">Amount ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--admin-neutral-400)] font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    value={modalAmount}
                    onChange={(e) => setModalAmount(e.target.value)}
                    className="admin-form-control pl-8"
                  />
                </div>
              </div>

              <div>
                <label className="admin-form-label">Remark / Note</label>
                <textarea
                  rows={2}
                  placeholder="Reason for adjustment (e.g., promotional reward, correction)..."
                  value={modalRemark}
                  onChange={(e) => setModalRemark(e.target.value)}
                  className="admin-form-control resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setBalanceModal(null)}
                  className="admin-btn-secondary text-xs py-2 px-4 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${
                    balanceModal.type === "add"
                      ? "admin-btn-primary"
                      : "admin-btn-danger"
                  } text-xs py-2 px-4 rounded-lg font-medium`}
                >
                  Confirm {balanceModal.type === "add" ? "Deposit" : "Deduction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
