/** @format */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WordlingGame {
  id: number;
  game_type: "wordling_min" | "wordling_main" | "wordling_max";
  secret_word: string;
  game_date: string;
  max_attempts: number;
  reward_coins: number;
  play_count: number;
  status: "active" | "inactive";
}

export interface HexlingGame {
  id: number;
  root_word: string;
  center_letter: string;
  game_date: string;
  words_count: number;
  reward_coins: number;
  play_count: number;
  status: "active" | "inactive";
}

const DEFAULT_WORDLING: WordlingGame[] = [
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

const DEFAULT_HEXLING: HexlingGame[] = [
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

interface GameStoreState {
  wordling: WordlingGame[];
  hexling: HexlingGame[];

  addWordling: (g: Omit<WordlingGame, "id"> & { id?: number }) => WordlingGame;
  updateWordling: (id: number, data: Partial<WordlingGame>) => void;
  deleteWordling: (id: number) => void;
  toggleWordlingStatus: (id: number) => void;

  addHexling: (g: Omit<HexlingGame, "id"> & { id?: number }) => HexlingGame;
  updateHexling: (id: number, data: Partial<HexlingGame>) => void;
  deleteHexling: (id: number) => void;
  toggleHexlingStatus: (id: number) => void;
}

export const useGameStore = create<GameStoreState>()(
  persist(
    (set) => ({
      wordling: DEFAULT_WORDLING,
      hexling: DEFAULT_HEXLING,

      addWordling: (gData) => {
        const id = gData.id || Date.now();
        const newGame: WordlingGame = {
          ...gData,
          id,
          play_count: gData.play_count ?? 0,
          status: gData.status ?? "active",
        };
        set((state) => ({ wordling: [newGame, ...state.wordling] }));
        return newGame;
      },

      updateWordling: (id, data) => {
        set((state) => ({
          wordling: state.wordling.map((g) => (g.id === id ? { ...g, ...data } : g)),
        }));
      },

      deleteWordling: (id) => {
        set((state) => ({
          wordling: state.wordling.filter((g) => g.id !== id),
        }));
      },

      toggleWordlingStatus: (id) => {
        set((state) => ({
          wordling: state.wordling.map((g) =>
            g.id === id
              ? { ...g, status: g.status === "active" ? "inactive" : "active" }
              : g
          ),
        }));
      },

      addHexling: (gData) => {
        const id = gData.id || Date.now();
        const newGame: HexlingGame = {
          ...gData,
          id,
          play_count: gData.play_count ?? 0,
          status: gData.status ?? "active",
        };
        set((state) => ({ hexling: [newGame, ...state.hexling] }));
        return newGame;
      },

      updateHexling: (id, data) => {
        set((state) => ({
          hexling: state.hexling.map((g) => (g.id === id ? { ...g, ...data } : g)),
        }));
      },

      deleteHexling: (id) => {
        set((state) => ({
          hexling: state.hexling.filter((g) => g.id !== id),
        }));
      },

      toggleHexlingStatus: (id) => {
        set((state) => ({
          hexling: state.hexling.map((g) =>
            g.id === id
              ? { ...g, status: g.status === "active" ? "inactive" : "active" }
              : g
          ),
        }));
      },
    }),
    {
      name: "quizix-admin-games",
    }
  )
);
