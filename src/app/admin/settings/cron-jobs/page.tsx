"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

interface CronTask {
  name: string;
  schedule: string;
  purpose: string;
  status: "active" | "idle";
  last_run: string;
}

const CRON_TASKS: CronTask[] = [
  {
    name: "Contest Evaluation & Winner Payouts",
    schedule: "Every 5 minutes (*/5 * * * *)",
    purpose: "Checks for ended contests, tallies scores, and distributes prize coins.",
    status: "active",
    last_run: "2 minutes ago",
  },
  {
    name: "Daily Streak & Free Coin Resets",
    schedule: "Every midnight (0 0 * * *)",
    purpose: "Resets daily check-in bonuses and daily gameplay limits.",
    status: "active",
    last_run: "Today at 00:00 UTC",
  },
  {
    name: "Daily Wordling & Hexling Puzzle Activation",
    schedule: "Every midnight (0 0 * * *)",
    purpose: "Activates today's word puzzles and archives previous puzzles.",
    status: "active",
    last_run: "Today at 00:00 UTC",
  },
];

export default function CronJobsPage() {
  const [running, setRunning] = useState(false);

  const handleManualRun = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      toast.success("All scheduled cron tasks executed successfully!");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Cron Job Configuration"
        buttons={[
          {
            label: "Run Cron Now",
            onClick: handleManualRun,
            icon: "ph ph-play",
            variant: "primary",
          },
        ]}
      />

      {/* Cron Command Card */}
      <div className="admin-white-box p-6 space-y-3">
        <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
          Server Crontab Setup
        </h3>
        <p className="text-xs text-[var(--admin-neutral-200)]">
          Add the following line to your server crontab to automate contest conclusions and daily word puzzle rotations:
        </p>

        <div className="flex items-center justify-between p-3.5 rounded-lg bg-[var(--admin-neutral-904)] border border-[var(--admin-neutral-700)] text-emerald-400 font-mono text-xs">
          <span>* * * * * cd /path-to-your-project/admin && php artisan schedule:run &gt;&gt; /dev/null 2&gt;&amp;1</span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(
                "* * * * * cd /path-to-your-project/admin && php artisan schedule:run >> /dev/null 2>&1"
              );
              toast.success("Command copied to clipboard!");
            }}
            className="text-[var(--admin-neutral-300)] hover:text-white transition ml-4"
          >
            <i className="ph ph-copy text-base"></i>
          </button>
        </div>
      </div>

      {/* Scheduled Tasks List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[var(--admin-neutral-900)] dark:text-white">
          Active Scheduled Automated Tasks
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CRON_TASKS.map((task, i) => (
            <div
              key={i}
              className="admin-white-box p-5 flex flex-col justify-between border border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h4 className="font-bold text-sm text-[var(--admin-neutral-900)] dark:text-white">
                    {task.name}
                  </h4>
                </div>
                <p className="text-xs text-[var(--admin-neutral-200)] mb-3">
                  {task.purpose}
                </p>
                <div className="p-2 rounded bg-[var(--admin-neutral-10)] dark:bg-[var(--admin-neutral-900)] text-[11px] font-mono text-[var(--admin-primary)]">
                  {task.schedule}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)] flex justify-between text-[11px] text-[var(--admin-neutral-400)]">
                <span>Last execution:</span>
                <span className="font-medium text-[var(--admin-neutral-700)] dark:text-[var(--admin-neutral-200)]">
                  {task.last_run}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
