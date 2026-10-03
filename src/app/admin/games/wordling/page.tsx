"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

interface WordlingGame {
  id: number;
  game_type: "wordling_min" | "wordling_main" | "wordling_max";
  secret_word: string;
  game_date: string;
  max_attempts: number;
  reward_coins: number;
  play_count: number;
  status: "active" | "inactive";
}

const INITIAL_WORDLING: WordlingGame[] = [
  {
    id: 1,
    game_type: "wordling_main",
    secret_word: "PLANET",
    game_date: "2024-03-03",
    max_attempts: 6,
    reward_coins: 30,
    play_count: 620,
    status: "active",
  },
  {
    id: 2,
    game_type: "wordling_min",
    secret_word: "STAR",
    game_date: "2024-03-03",
    max_attempts: 5,
    reward_coins: 20,
    play_count: 410,
    status: "active",
  },
  {
    id: 3,
    game_type: "wordling_max",
    secret_word: "GALAXY",
    game_date: "2024-03-03",
    max_attempts: 7,
    reward_coins: 50,
    play_count: 850,
    status: "active",
  },
  {
    id: 4,
    game_type: "wordling_main",
    secret_word: "ROCKET",
    game_date: "2024-03-02",
    max_attempts: 6,
    reward_coins: 30,
    play_count: 1200,
    status: "inactive",
  },
];

export default function AdminWordlingPage() {
  const [games, setGames] = useState<WordlingGame[]>(INITIAL_WORDLING);
  const [modalOpen, setModalOpen] = useState(false);
  const [secretWord, setSecretWord] = useState("");
  const [gameType, setGameType] = useState<
    "wordling_min" | "wordling_main" | "wordling_max"
  >("wordling_main");
  const [gameDate, setGameDate] = useState(new Date().toISOString().split("T")[0]);
  const [maxAttempts, setMaxAttempts] = useState(6);
  const [rewardCoins, setRewardCoins] = useState(30);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretWord.trim()) {
      toast.error("Please provide a secret word");
      return;
    }

    const newGame: WordlingGame = {
      id: Date.now(),
      game_type: gameType,
      secret_word: secretWord.trim().toUpperCase(),
      game_date: gameDate,
      max_attempts: maxAttempts,
      reward_coins: rewardCoins,
      play_count: 0,
      status: "active",
    };

    setGames((prev) => [newGame, ...prev]);
    toast.success("Wordling game added successfully");
    setModalOpen(false);
    setSecretWord("");
  };

  const toggleStatus = (id: number) => {
    setGames((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, status: g.status === "active" ? "inactive" : "active" }
          : g
      )
    );
  };

  const columns = [
    {
      key: "word",
      label: "Secret Word",
      render: (row: WordlingGame) => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold tracking-widest text-sm px-2.5 py-1 rounded bg-[var(--admin-primary)]/10 text-[var(--admin-primary)]">
            {row.secret_word}
          </span>
          <span className="text-xs text-[var(--admin-neutral-200)] uppercase">
            ({row.secret_word.length} letters)
          </span>
        </div>
      ),
    },
    {
      key: "type",
      label: "Game Mode",
      render: (row: WordlingGame) => {
        const labels: Record<string, string> = {
          wordling_min: "Wordling Min (4 letters)",
          wordling_main: "Wordling Main (5-6 letters)",
          wordling_max: "Wordling Max (7 letters)",
        };
        return (
          <span className="text-xs font-medium text-[var(--admin-neutral-400)]">
            {labels[row.game_type]}
          </span>
        );
      },
    },
    {
      key: "date",
      label: "Scheduled Date",
      render: (row: WordlingGame) => (
        <span className="text-xs text-[var(--admin-neutral-400)]">
          {row.game_date}
        </span>
      ),
    },
    {
      key: "reward",
      label: "Reward Coins",
      render: (row: WordlingGame) => (
        <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
          <i className="ph-fill ph-coins"></i>
          <span>{row.reward_coins}</span>
        </div>
      ),
    },
    {
      key: "plays",
      label: "Total Solves",
      render: (row: WordlingGame) => (
        <span className="text-xs text-[var(--admin-neutral-400)]">
          {row.play_count} plays
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: WordlingGame) => (
        <button
          type="button"
          onClick={() => toggleStatus(row.id)}
          className={`admin-badge cursor-pointer ${
            row.status === "active"
              ? "admin-badge-success"
              : "admin-badge-warning"
          }`}
        >
          {row.status === "active" ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: WordlingGame) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            type="button"
            onClick={() => {
              if (confirm("Delete this game?")) {
                setGames((prev) => prev.filter((g) => g.id !== row.id));
                toast.success("Game deleted");
              }
            }}
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
        title="Wordling Games Management"
        buttons={[
          {
            label: "Add Wordling Game",
            onClick: () => setModalOpen(true),
            icon: "ph ph-plus-circle",
            variant: "primary",
          },
        ]}
      />

      <AdminDataTable columns={columns} data={games} emptyText="No games found" />

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
              Add Daily Wordling
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="admin-form-label">Game Mode</label>
                <select
                  value={gameType}
                  onChange={(e) =>
                    setGameType(
                      e.target.value as "wordling_min" | "wordling_main" | "wordling_max"
                    )
                  }
                  className="admin-form-control"
                >
                  <option value="wordling_min">Wordling Min (4 Letters)</option>
                  <option value="wordling_main">Wordling Main (5-6 Letters)</option>
                  <option value="wordling_max">Wordling Max (7 Letters)</option>
                </select>
              </div>

              <div>
                <label className="admin-form-label">Secret Word *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BRAIN"
                  value={secretWord}
                  onChange={(e) => setSecretWord(e.target.value.toUpperCase())}
                  className="admin-form-control uppercase tracking-widest font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-form-label">Game Date</label>
                  <input
                    type="date"
                    required
                    value={gameDate}
                    onChange={(e) => setGameDate(e.target.value)}
                    className="admin-form-control"
                  />
                </div>

                <div>
                  <label className="admin-form-label">Reward Coins</label>
                  <input
                    type="number"
                    min={1}
                    value={rewardCoins}
                    onChange={(e) => setRewardCoins(parseInt(e.target.value) || 0)}
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
                  Save Game
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
