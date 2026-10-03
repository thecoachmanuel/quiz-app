"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

interface HexlingGame {
  id: number;
  root_word: string;
  center_letter: string;
  game_date: string;
  words_count: number;
  reward_coins: number;
  play_count: number;
  status: "active" | "inactive";
}

const INITIAL_HEXLING: HexlingGame[] = [
  {
    id: 1,
    root_word: "TRIANGLE",
    center_letter: "A",
    game_date: "2024-03-03",
    words_count: 28,
    reward_coins: 75,
    play_count: 512,
    status: "active",
  },
  {
    id: 2,
    root_word: "FORTUNE",
    center_letter: "T",
    game_date: "2024-03-02",
    words_count: 22,
    reward_coins: 60,
    play_count: 820,
    status: "inactive",
  },
];

export default function AdminHexlingPage() {
  const [games, setGames] = useState<HexlingGame[]>(INITIAL_HEXLING);
  const [modalOpen, setModalOpen] = useState(false);
  const [rootWord, setRootWord] = useState("");
  const [centerLetter, setCenterLetter] = useState("A");
  const [gameDate, setGameDate] = useState(new Date().toISOString().split("T")[0]);
  const [words, setWords] = useState("");
  const [rewardCoins, setRewardCoins] = useState(50);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rootWord.trim() || !centerLetter.trim()) {
      toast.error("Please fill in root word and center letter");
      return;
    }

    const wordList = words
      .split(",")
      .map((w) => w.trim().toUpperCase())
      .filter(Boolean);

    const newGame: HexlingGame = {
      id: Date.now(),
      root_word: rootWord.trim().toUpperCase(),
      center_letter: centerLetter.trim().toUpperCase(),
      game_date: gameDate,
      words_count: wordList.length || 15,
      reward_coins: rewardCoins,
      play_count: 0,
      status: "active",
    };

    setGames((prev) => [newGame, ...prev]);
    toast.success("Hexling game added successfully");
    setModalOpen(false);
    setRootWord("");
    setWords("");
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
      key: "root",
      label: "Root Word & Center",
      render: (row: HexlingGame) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center text-lg border border-amber-500/20">
            {row.center_letter}
          </div>
          <div>
            <span className="font-mono font-bold tracking-widest text-sm text-[var(--admin-neutral-900)] dark:text-white">
              {row.root_word}
            </span>
            <p className="text-xs text-[var(--admin-neutral-200)]">
              Center letter: <strong className="text-amber-500">{row.center_letter}</strong>
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "words_count",
      label: "Findable Words",
      render: (row: HexlingGame) => (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--admin-primary)]/10 text-[var(--admin-primary)]">
          {row.words_count} words
        </span>
      ),
    },
    {
      key: "date",
      label: "Scheduled Date",
      render: (row: HexlingGame) => (
        <span className="text-xs text-[var(--admin-neutral-400)]">
          {row.game_date}
        </span>
      ),
    },
    {
      key: "reward",
      label: "Reward Coins",
      render: (row: HexlingGame) => (
        <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
          <i className="ph-fill ph-coins"></i>
          <span>{row.reward_coins}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: HexlingGame) => (
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
      render: (row: HexlingGame) => (
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
        title="Hexling Games Management"
        buttons={[
          {
            label: "Add Hexling Game",
            onClick: () => setModalOpen(true),
            icon: "ph ph-plus-circle",
            variant: "primary",
          },
        ]}
      />

      <AdminDataTable columns={columns} data={games} emptyText="No games found" />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="admin-white-box w-full max-w-lg p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[var(--admin-neutral-400)] hover:text-red-500 transition text-xl"
            >
              <i className="ph ph-x"></i>
            </button>
            <h3 className="text-lg font-bold text-[var(--admin-neutral-900)] dark:text-white mb-4">
              Add Hexling Game
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="admin-form-label">Root Word *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TRIANGLE"
                    value={rootWord}
                    onChange={(e) => setRootWord(e.target.value.toUpperCase())}
                    className="admin-form-control uppercase tracking-widest font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="admin-form-label">Center Letter *</label>
                  <input
                    type="text"
                    required
                    maxLength={1}
                    placeholder="A"
                    value={centerLetter}
                    onChange={(e) => setCenterLetter(e.target.value.toUpperCase())}
                    className="admin-form-control uppercase text-center font-bold text-lg"
                  />
                </div>
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

              <div>
                <label className="admin-form-label">
                  Allowed Words (Comma separated)
                </label>
                <textarea
                  rows={3}
                  placeholder="TRIANGLE, ALERT, ALTER, GIANT, GRAIN, TRAIN..."
                  value={words}
                  onChange={(e) => setWords(e.target.value)}
                  className="admin-form-control resize-none font-mono text-xs uppercase"
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
