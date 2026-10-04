"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader, { TabButton } from "@/components/admin/AdminPageHeader";
import { adminFetch } from "@/configs/adminApi";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useContestStore, ContestItem } from "@/stores/contestStore";

export default function AdminContestsPage() {
  const storeContests = useContestStore((state) => state.contests);
  const deleteContest = useContestStore((state) => state.deleteContest);
  const toggleContestStatus = useContestStore((state) => state.toggleContestStatus);
  const setContests = useContestStore((state) => state.setContests);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const contests = storeContests;

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const res = await adminFetch("/contests");
      if (res && res.data && Array.isArray(res.data)) {
        setContests(res.data);
      }
    } catch {
      // Keep store contests as fallback
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this contest?")) return;
    deleteContest(id);
    toast.success("Contest removed");
  };

  const tabs: TabButton[] = [
    { label: "All Contests", key: "all", count: contests.length },
    {
      label: "Active",
      key: "active",
      count: contests.filter((c) => c.status === "active").length,
    },
    {
      label: "Upcoming",
      key: "upcoming",
      count: contests.filter((c) => c.status === "upcoming").length,
    },
    {
      label: "Ended",
      key: "ended",
      count: contests.filter((c) => c.status === "ended").length,
    },
  ];

  const filtered = contests.filter((c) => {
    if (activeTab === "active" && c.status !== "active") return false;
    if (activeTab === "upcoming" && c.status !== "upcoming") return false;
    if (activeTab === "ended" && c.status !== "ended") return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const columns = [
    {
      key: "title",
      label: "Contest",
      render: (row: ContestItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl shrink-0">
            <i className="ph ph-trophy"></i>
          </div>
          <div>
            <span className="font-semibold text-sm text-[var(--admin-neutral-900)] dark:text-white line-clamp-1">
              {row.title}
            </span>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--admin-neutral-200)]">
              <span>{row.category}</span>
              <span>•</span>
              <span>{row.participants_count} Players</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "timeline",
      label: "Start & End",
      render: (row: ContestItem) => (
        <div className="text-xs">
          <p className="text-[var(--admin-neutral-400)]">{row.start_time}</p>
          <p className="text-[var(--admin-neutral-200)]">to {row.end_time}</p>
        </div>
      ),
    },
    {
      key: "fee",
      label: "Entry Fee",
      render: (row: ContestItem) => (
        <div className="flex items-center gap-1 text-xs font-medium text-amber-500">
          <i className="ph-fill ph-coins"></i>
          <span>{row.entry_fee} coins</span>
        </div>
      ),
    },
    {
      key: "prize",
      label: "Prize Pool",
      render: (row: ContestItem) => (
        <span className="font-bold text-xs text-emerald-500">
          ${row.prize_pool.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: ContestItem) => {
        let badgeClass = "admin-badge-info";
        if (row.status === "active") badgeClass = "admin-badge-success";
        if (row.status === "ended") badgeClass = "admin-badge-neutral";
        return (
          <span className={`admin-badge ${badgeClass} uppercase text-[10px]`}>
            {row.status}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: ContestItem) => (
        <div className="flex items-center gap-1.5 justify-end">
          <Link
            href={`/admin/contests/winners?contest_id=${row.id}`}
            title="View Winners & Leaderboard"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--admin-neutral-400)] hover:text-amber-500 hover:bg-amber-500/10 transition text-base"
          >
            <i className="ph ph-crown"></i>
          </Link>
          <button
            type="button"
            title="Delete Contest"
            onClick={() => handleDelete(row.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--admin-neutral-400)] hover:text-red-500 hover:bg-red-500/10 transition text-base"
          >
            <i className="ph ph-trash"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Manage Contests"
        tabButtons={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search contests..."
        buttons={[
          {
            label: "Categories",
            href: "/admin/contests/categories",
            icon: "ph ph-folders",
            variant: "secondary",
          },
          {
            label: "Winners",
            href: "/admin/contests/winners",
            icon: "ph ph-crown",
            variant: "secondary",
          },
          {
            label: "Create Contest",
            href: "/admin/contests/create",
            icon: "ph ph-plus-circle",
            variant: "primary",
          },
        ]}
      />

      <AdminDataTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyText="No contests found"
      />
    </div>
  );
}
