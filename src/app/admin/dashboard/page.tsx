"use client";

import { adminFetch } from "@/configs/adminApi";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

interface StatItem {
  title: string;
  data: string | number;
  icon: string;
  url: string;
}

interface DashboardData {
  state?: StatItem[];
  withdraw?: {
    total_amount: number;
    total_pending: number;
    total_rejected: number;
  };
  deposit?: {
    total_amount: number;
    total_pending: number;
    total_failed: number;
  };
  daily_logins?: { date: string; count: number }[];
  contest_participants?: { name: string; count: number }[];
  quiz_participants?: { name: string; count: number }[];
  os_stats?: { name: string; value: number }[];
  browser_stats?: { name: string; value: number }[];
}

const CHART_COLORS = [
  "#6366f1",
  "#8e33ff",
  "#00b8d9",
  "#22c55e",
  "#f59e0b",
  "#ff5630",
];

const DEFAULT_STAT_ICONS: Record<string, string> = {
  Users: "ph ph-users-three",
  Quizzes: "ph ph-question-mark",
  Contests: "ph ph-seal-question",
  Revenue: "ph ph-currency-dollar",
  Deposits: "ph ph-bank",
  Withdrawals: "ph ph-wallet",
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: res, ok } =
          await adminFetch<{ data: DashboardData }>("/dashboard");
        if (ok && res?.data) {
          setData(res.data);
        }
      } catch {
        // Use mock data if API not available
        setData({
          state: [
            { title: "Total Users", data: "2,845", icon: "ph ph-users-three", url: "/admin/users" },
            { title: "Total Quizzes", data: "148", icon: "ph ph-question-mark", url: "/admin/quizzes" },
            { title: "Total Contests", data: "36", icon: "ph ph-seal-question", url: "/admin/contests" },
            { title: "Total Revenue", data: "$12,450", icon: "ph ph-currency-dollar", url: "/admin/payments" },
          ],
          withdraw: { total_amount: 4500, total_pending: 12, total_rejected: 3 },
          deposit: { total_amount: 18200, total_pending: 8, total_failed: 2 },
          daily_logins: Array.from({ length: 15 }, (_, i) => ({
            date: new Date(Date.now() - (14 - i) * 86400000)
              .toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            count: Math.floor(Math.random() * 150) + 50,
          })),
          contest_participants: [
            { name: "Math Quiz", count: 245 },
            { name: "Science", count: 182 },
            { name: "History", count: 134 },
            { name: "Sports", count: 98 },
            { name: "Music", count: 76 },
          ],
          quiz_participants: [
            { name: "General", count: 420 },
            { name: "Tech", count: 310 },
            { name: "Arts", count: 190 },
            { name: "Nature", count: 145 },
          ],
          os_stats: [
            { name: "Windows", value: 45 },
            { name: "MacOS", value: 25 },
            { name: "Android", value: 20 },
            { name: "iOS", value: 10 },
          ],
          browser_stats: [
            { name: "Chrome", value: 55 },
            { name: "Firefox", value: 20 },
            { name: "Safari", value: 15 },
            { name: "Edge", value: 10 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 xl:gap-6">
        {/* Skeleton loaders */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="admin-white-box animate-pulse h-28 col-span-2 md:col-span-1 xl:col-span-1"
          >
            <div className="h-4 bg-[var(--admin-neutral-30)] rounded w-1/2 mb-3"></div>
            <div className="h-6 bg-[var(--admin-neutral-30)] rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 xl:gap-6">
      {/* ---- Stat Cards ---- */}
      <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 gap-4 xl:gap-6">
        {(data.state || []).map((item, i) => (
          <div key={i} className="admin-white-box">
            <div className="flex justify-between items-center gap-3 mb-3">
              <div>
                <p className="text-sm text-[var(--admin-neutral-500)] dark:text-[var(--admin-neutral-100)] mb-1">
                  {item.title}
                </p>
                <p className="text-lg font-semibold text-[var(--admin-neutral-700)] dark:text-[var(--admin-neutral-20)]">
                  {item.data}
                </p>
              </div>
              <div
                className="size-11 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: "var(--admin-primary)" }}
              >
                <i className={`${item.icon || "ph ph-chart-bar"} text-xl`}></i>
              </div>
            </div>
            <Link
              href={item.url}
              className="text-xs font-medium underline"
              style={{ color: "var(--admin-primary)" }}
            >
              View all
            </Link>
          </div>
        ))}
      </div>

      {/* ---- Daily Login Chart ---- */}
      <div className="col-span-2 admin-white-box">
        <div className="flex justify-between items-center gap-4 flex-wrap mb-6">
          <p className="admin-section-title">
            Daily Login Overview (Last 15 days)
          </p>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data.daily_logins || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-neutral-30)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "var(--admin-neutral-500)" }}
            />
            <YAxis tick={{ fontSize: 11, fill: "var(--admin-neutral-500)" }} />
            <Tooltip
              contentStyle={{
                background: "var(--admin-neutral-0)",
                border: "1px solid var(--admin-neutral-30)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="var(--admin-primary)"
              strokeWidth={2}
              dot={{ fill: "var(--admin-primary)", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ---- Contest Participants ---- */}
      <div className="col-span-2 lg:col-span-1 admin-white-box">
        <div className="flex justify-between items-center gap-4 flex-wrap mb-6">
          <p className="admin-section-title">Contest Participants</p>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data.contest_participants || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-neutral-30)" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "var(--admin-neutral-500)" }}
            />
            <YAxis tick={{ fontSize: 10, fill: "var(--admin-neutral-500)" }} />
            <Tooltip
              contentStyle={{
                background: "var(--admin-neutral-0)",
                border: "1px solid var(--admin-neutral-30)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="count" fill="var(--admin-primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ---- Quiz Participants ---- */}
      <div className="col-span-2 lg:col-span-1 admin-white-box">
        <div className="flex justify-between items-center gap-4 flex-wrap mb-6">
          <p className="admin-section-title">Quiz Participants</p>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data.quiz_participants || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-neutral-30)" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "var(--admin-neutral-500)" }}
            />
            <YAxis tick={{ fontSize: 10, fill: "var(--admin-neutral-500)" }} />
            <Tooltip
              contentStyle={{
                background: "var(--admin-neutral-0)",
                border: "1px solid var(--admin-neutral-30)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar
              dataKey="count"
              fill="var(--admin-secondary)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ---- Withdrawals ---- */}
      <div className="col-span-2 lg:col-span-1 admin-white-box">
        <div className="flex justify-between items-center gap-4 flex-wrap mb-6">
          <p className="admin-section-title">Withdrawals</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              label: "Total",
              value: `$${(data.withdraw?.total_amount || 0).toLocaleString()}`,
              icon: "ph ph-hand-coins",
              color: "var(--admin-primary)",
              href: "/admin/withdrawals",
            },
            {
              label: "Pending",
              value: data.withdraw?.total_pending ?? 0,
              icon: "ph ph-spinner-gap",
              color: "var(--admin-success)",
              href: "/admin/withdrawals?status=pending",
            },
            {
              label: "Rejected",
              value: data.withdraw?.total_rejected ?? 0,
              icon: "ph ph-prohibit",
              color: "var(--admin-error)",
              href: "/admin/withdrawals?status=rejected",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="admin-n10-box flex justify-between items-center !p-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="size-9 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: item.color }}
                >
                  <i className={`${item.icon} text-lg`}></i>
                </div>
                <div>
                  <p className="font-medium text-sm text-[var(--admin-neutral-700)] dark:text-[var(--admin-neutral-20)] mb-0.5">
                    {item.value}
                  </p>
                  <p className="text-xs text-[var(--admin-neutral-500)]">
                    {item.label}
                  </p>
                </div>
              </div>
              <Link href={item.href}>
                <span
                  className="size-6 rounded-md border flex items-center justify-center text-sm duration-300 hover:text-white"
                  style={{
                    borderColor: "var(--admin-primary)",
                    color: "var(--admin-primary)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "var(--admin-primary)";
                    (e.currentTarget as HTMLElement).style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "";
                    (e.currentTarget as HTMLElement).style.color =
                      "var(--admin-primary)";
                  }}
                >
                  <i className="ph ph-arrow-right"></i>
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Deposits ---- */}
      <div className="col-span-2 lg:col-span-1 admin-white-box">
        <div className="flex justify-between items-center gap-4 flex-wrap mb-6">
          <p className="admin-section-title">Deposits</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              label: "Total",
              value: `$${(data.deposit?.total_amount || 0).toLocaleString()}`,
              icon: "ph ph-bank",
              color: "#16a34a",
              href: "/admin/deposits",
            },
            {
              label: "Pending",
              value: data.deposit?.total_pending ?? 0,
              icon: "ph ph-clock-clockwise",
              color: "var(--admin-warning)",
              href: "/admin/deposits?status=pending",
            },
            {
              label: "Failed",
              value: data.deposit?.total_failed ?? 0,
              icon: "ph ph-prohibit",
              color: "var(--admin-error)",
              href: "/admin/deposits?status=failed",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="admin-n10-box flex justify-between items-center !p-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="size-9 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: item.color }}
                >
                  <i className={`${item.icon} text-lg`}></i>
                </div>
                <div>
                  <p className="font-medium text-sm text-[var(--admin-neutral-700)] dark:text-[var(--admin-neutral-20)] mb-0.5">
                    {item.value}
                  </p>
                  <p className="text-xs text-[var(--admin-neutral-500)]">
                    {item.label}
                  </p>
                </div>
              </div>
              <Link href={item.href}>
                <span
                  className="size-6 rounded-md border flex items-center justify-center text-sm duration-300"
                  style={{
                    borderColor: "var(--admin-primary)",
                    color: "var(--admin-primary)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "var(--admin-primary)";
                    (e.currentTarget as HTMLElement).style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "";
                    (e.currentTarget as HTMLElement).style.color =
                      "var(--admin-primary)";
                  }}
                >
                  <i className="ph ph-arrow-right"></i>
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Login by OS ---- */}
      <div className="col-span-2 lg:col-span-1 admin-white-box">
        <div className="admin-white-box !p-0 border-0">
          <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
            <p className="admin-section-title">Login By OS</p>
            <Link
              href="/admin/reports/login-log"
              className="text-xs underline font-medium"
              style={{ color: "var(--admin-primary)" }}
            >
              View all
            </Link>
          </div>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.os_stats || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {(data.os_stats || []).map((_, idx) => (
                    <Cell
                      key={idx}
                      fill={CHART_COLORS[idx % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--admin-neutral-0)",
                    border: "1px solid var(--admin-neutral-30)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(val) => (
                    <span style={{ fontSize: "11px" }}>{val}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ---- Login by Browser ---- */}
      <div className="col-span-2 lg:col-span-1 admin-white-box">
        <div className="admin-white-box !p-0 border-0">
          <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
            <p className="admin-section-title">Login By Browser</p>
            <Link
              href="/admin/reports/login-log"
              className="text-xs underline font-medium"
              style={{ color: "var(--admin-primary)" }}
            >
              View all
            </Link>
          </div>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.browser_stats || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {(data.browser_stats || []).map((_, idx) => (
                    <Cell
                      key={idx}
                      fill={CHART_COLORS[idx % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--admin-neutral-0)",
                    border: "1px solid var(--admin-neutral-30)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(val) => (
                    <span style={{ fontSize: "11px" }}>{val}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
