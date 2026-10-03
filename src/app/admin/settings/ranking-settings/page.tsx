"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RankingSettingsPage() {
  const [ranks, setRanks] = useState([
    { rank: 1, daily_coins: 500, weekly_coins: 2500, monthly_coins: 10000 },
    { rank: 2, daily_coins: 300, weekly_coins: 1500, monthly_coins: 6000 },
    { rank: 3, daily_coins: 150, weekly_coins: 800, monthly_coins: 3500 },
    { rank: "4 - 10", daily_coins: 50, weekly_coins: 250, monthly_coins: 1000 },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Leaderboard ranking reward distribution saved!");
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Leaderboard Ranking Rewards" />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="admin-white-box p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl">
              <i className="ph ph-crown"></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
                Reward Coins Schedule by Rank
              </h3>
              <p className="text-xs text-[var(--admin-neutral-200)]">
                Players who reach the top of leaderboards at the end of each period are automatically awarded these bonus coins.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)] text-left">
                  <th className="py-3 px-4 font-bold text-[var(--admin-neutral-400)]">
                    Position
                  </th>
                  <th className="py-3 px-4 font-bold text-[var(--admin-neutral-400)]">
                    Daily Reward (Coins)
                  </th>
                  <th className="py-3 px-4 font-bold text-[var(--admin-neutral-400)]">
                    Weekly Reward (Coins)
                  </th>
                  <th className="py-3 px-4 font-bold text-[var(--admin-neutral-400)]">
                    Monthly Reward (Coins)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--admin-neutral-30)] dark:divide-[var(--admin-neutral-700)]">
                {ranks.map((r, i) => (
                  <tr key={i}>
                    <td className="py-3 px-4 font-bold text-[var(--admin-neutral-900)] dark:text-white">
                      Rank #{r.rank}
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        defaultValue={r.daily_coins}
                        className="admin-form-control max-w-[120px] text-xs"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        defaultValue={r.weekly_coins}
                        className="admin-form-control max-w-[120px] text-xs"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        defaultValue={r.monthly_coins}
                        className="admin-form-control max-w-[120px] text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="admin-btn-primary py-2.5 px-6 rounded-lg text-xs font-semibold"
            >
              Save Reward Distribution
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
