/** @format */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BadgeItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  criteria: string;
  reward_coins: number;
  unlocked_count: number;
  status: "active" | "inactive";
}

const DEFAULT_BADGES: BadgeItem[] = [
  {
    id: 1,
    title: "Trivia Rookie",
    description: "Complete your first 5 trivia quizzes.",
    icon: "ph-sparkle",
    criteria: "5 Quizzes Completed",
    reward_coins: 50,
    unlocked_count: 820,
    status: "active",
  },
  {
    id: 2,
    title: "Quiz Grandmaster",
    description: "Complete 100 quizzes with score above 80%.",
    icon: "ph-crown",
    criteria: "100 Quizzes > 80%",
    reward_coins: 500,
    unlocked_count: 64,
    status: "active",
  },
  {
    id: 3,
    title: "Contest Champion",
    description: "Secure 1st place in any official trivia contest.",
    icon: "ph-trophy",
    criteria: "1st Place Contest Win",
    reward_coins: 1000,
    unlocked_count: 18,
    status: "active",
  },
  {
    id: 4,
    title: "Vocabulary Maestro",
    description: "Solve 10 Wordling puzzles with zero missed attempts.",
    icon: "ph-spell-check",
    criteria: "10 Perfect Wordling Solves",
    reward_coins: 200,
    unlocked_count: 145,
    status: "active",
  },
];

interface BadgeStoreState {
  badges: BadgeItem[];

  addBadge: (b: Omit<BadgeItem, "id"> & { id?: number }) => BadgeItem;
  updateBadge: (id: number, data: Partial<BadgeItem>) => void;
  deleteBadge: (id: number) => void;
  toggleBadgeStatus: (id: number) => void;
  setBadges: (badges: BadgeItem[]) => void;
  getFrontendBadges: () => any[];
}

export const useBadgeStore = create<BadgeStoreState>()(
  persist(
    (set, get) => ({
      badges: DEFAULT_BADGES,

      addBadge: (bData) => {
        const id = bData.id || Date.now();
        const newBadge: BadgeItem = {
          ...bData,
          id,
          unlocked_count: bData.unlocked_count ?? 0,
          status: bData.status ?? "active",
        };
        set((state) => ({
          badges: [...state.badges, newBadge],
        }));
        return newBadge;
      },

      updateBadge: (id, data) => {
        set((state) => ({
          badges: state.badges.map((b) => (b.id === id ? { ...b, ...data } : b)),
        }));
      },

      deleteBadge: (id) => {
        set((state) => ({
          badges: state.badges.filter((b) => b.id !== id),
        }));
      },

      toggleBadgeStatus: (id) => {
        set((state) => ({
          badges: state.badges.map((b) =>
            b.id === id
              ? { ...b, status: b.status === "active" ? "inactive" : "active" }
              : b
          ),
        }));
      },

      setBadges: (badges) => set({ badges }),

      getFrontendBadges: () => {
        const { badges } = get();
        return badges
          .filter((b) => b.status === "active")
          .map((b) => ({
            id: b.id,
            title: b.title,
            description: b.description,
            icon: "/assets/images/badge-icon.png",
            user_badge: b.unlocked_count > 0 ? { id: b.id, user_id: 1 } : null,
          }));
      },
    }),
    {
      name: "quizix-admin-badges",
    }
  )
);
