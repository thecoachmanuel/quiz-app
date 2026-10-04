/** @format */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ContestType, ContestApiResponse, ContestDetailsType } from "@/types/contest";

export interface ContestItem {
  id: number;
  title: string;
  category: string;
  start_time: string;
  end_time: string;
  entry_fee: number;
  prize_pool: number;
  participants_count: number;
  status: "active" | "upcoming" | "ended";
  image?: string;
  description?: string;
  slug?: string;
  total_questions?: number;
}

export interface ContestCat {
  id: number;
  title: string;
  slug: string;
  contests_count: number;
  status: "active" | "inactive";
}

export interface WinnerItem {
  id: number;
  contest_id: number;
  contest_title: string;
  user_name: string;
  user_email: string;
  rank: number;
  score: number;
  prize_amount: number;
  won_at: string;
}

const DEFAULT_CONTESTS: ContestItem[] = [
  {
    id: 1,
    title: "Weekend Mega Championship 2024",
    category: "General Trivia",
    start_time: new Date(Date.now() - 3600000).toISOString(),
    end_time: new Date(Date.now() + 86400000 * 2).toISOString(),
    entry_fee: 50,
    prize_pool: 1500,
    participants_count: 248,
    status: "active",
    image: "/contest-image.png",
    description: "Compete against the smartest trivia buffs worldwide for a massive $1,500 prize pool!",
    slug: "weekend-mega-championship-2024",
    total_questions: 20,
  },
  {
    id: 2,
    title: "Global Tech & Coding Masters",
    category: "Technology",
    start_time: new Date(Date.now() + 86400000 * 3).toISOString(),
    end_time: new Date(Date.now() + 86400000 * 5).toISOString(),
    entry_fee: 100,
    prize_pool: 3000,
    participants_count: 95,
    status: "upcoming",
    image: "/contest-image.png",
    description: "Test your programming logic, computer history, and system design trivia knowledge.",
    slug: "global-tech-coding-masters",
    total_questions: 25,
  },
  {
    id: 3,
    title: "World Cup Football Super Clash",
    category: "Sports",
    start_time: new Date(Date.now() - 7200000).toISOString(),
    end_time: new Date(Date.now() + 86400000 * 1).toISOString(),
    entry_fee: 40,
    prize_pool: 1200,
    participants_count: 310,
    status: "active",
    image: "/contest-image.png",
    description: "Calling all football fanatics! High-stakes trivia on FIFA World Cup history and records.",
    slug: "world-cup-football-super-clash",
    total_questions: 15,
  },
  {
    id: 4,
    title: "Valentine Love & Cinema Trivia",
    category: "Entertainment",
    start_time: new Date(Date.now() - 86400000 * 10).toISOString(),
    end_time: new Date(Date.now() - 86400000 * 8).toISOString(),
    entry_fee: 25,
    prize_pool: 800,
    participants_count: 512,
    status: "ended",
    image: "/contest-image.png",
    description: "A celebration of romantic comedies and legendary movie soundtracks.",
    slug: "valentine-love-cinema-trivia",
    total_questions: 15,
  },
];

const DEFAULT_CATEGORIES: ContestCat[] = [
  { id: 1, title: "General Trivia", slug: "general-trivia", contests_count: 12, status: "active" },
  { id: 2, title: "Technology", slug: "technology", contests_count: 8, status: "active" },
  { id: 3, title: "Science", slug: "science", contests_count: 6, status: "active" },
  { id: 4, title: "Sports", slug: "sports", contests_count: 14, status: "active" },
  { id: 5, title: "Entertainment", slug: "entertainment", contests_count: 9, status: "active" },
];

const DEFAULT_WINNERS: WinnerItem[] = [
  {
    id: 1,
    contest_id: 4,
    contest_title: "Valentine Love & Cinema Trivia",
    user_name: "Sophia Chen",
    user_email: "sophia.c@example.com",
    rank: 1,
    score: 950,
    prize_amount: 400,
    won_at: "2024-02-16",
  },
  {
    id: 2,
    contest_id: 4,
    contest_title: "Valentine Love & Cinema Trivia",
    user_name: "Alex Morgan",
    user_email: "alex.morgan@example.com",
    rank: 2,
    score: 920,
    prize_amount: 250,
    won_at: "2024-02-16",
  },
  {
    id: 3,
    contest_id: 4,
    contest_title: "Valentine Love & Cinema Trivia",
    user_name: "Liam O'Connor",
    user_email: "liam.oc@example.com",
    rank: 3,
    score: 890,
    prize_amount: 150,
    won_at: "2024-02-16",
  },
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface ContestStoreState {
  contests: ContestItem[];
  categories: ContestCat[];
  winners: WinnerItem[];

  // Contest actions
  addContest: (contest: Omit<ContestItem, "id"> & { id?: number }) => ContestItem;
  updateContest: (id: number, data: Partial<ContestItem>) => void;
  deleteContest: (id: number) => void;
  toggleContestStatus: (id: number) => void;
  setContests: (contests: ContestItem[]) => void;

  // Category actions
  addCategory: (cat: Omit<ContestCat, "id"> & { id?: number }) => ContestCat;
  updateCategory: (id: number, data: Partial<ContestCat>) => void;
  deleteCategory: (id: number) => void;

  // Winner actions
  addWinner: (winner: Omit<WinnerItem, "id"> & { id?: number }) => WinnerItem;

  // Frontend helpers
  getFrontendContests: (params?: { page?: number; per_page?: number; search?: string; category?: string }) => ContestApiResponse;
  getFrontendContestDetails: (slugOrId: string | number) => ContestDetailsType | undefined;
}

export const useContestStore = create<ContestStoreState>()(
  persist(
    (set, get) => ({
      contests: DEFAULT_CONTESTS,
      categories: DEFAULT_CATEGORIES,
      winners: DEFAULT_WINNERS,

      addContest: (contestData) => {
        const id = contestData.id || Date.now();
        const slug = contestData.slug || generateSlug(contestData.title);
        const newContest: ContestItem = {
          ...contestData,
          id,
          slug,
          participants_count: contestData.participants_count ?? 0,
          status: contestData.status ?? "upcoming",
        };
        set((state) => ({
          contests: [newContest, ...state.contests],
        }));
        return newContest;
      },

      updateContest: (id, data) => {
        set((state) => ({
          contests: state.contests.map((c) => {
            if (c.id === id) {
              const updated = { ...c, ...data };
              if (data.title && !data.slug) {
                updated.slug = generateSlug(data.title);
              }
              return updated;
            }
            return c;
          }),
        }));
      },

      deleteContest: (id) => {
        set((state) => ({
          contests: state.contests.filter((c) => c.id !== id),
        }));
      },

      toggleContestStatus: (id) => {
        set((state) => ({
          contests: state.contests.map((c) => {
            if (c.id === id) {
              const nextStatus =
                c.status === "active" ? "ended" : c.status === "upcoming" ? "active" : "upcoming";
              return { ...c, status: nextStatus };
            }
            return c;
          }),
        }));
      },

      setContests: (contests) => set({ contests }),

      addCategory: (catData) => {
        const id = catData.id || Date.now();
        const slug = catData.slug || generateSlug(catData.title);
        const newCat: ContestCat = {
          ...catData,
          id,
          slug,
          contests_count: catData.contests_count ?? 0,
          status: catData.status ?? "active",
        };
        set((state) => ({
          categories: [...state.categories, newCat],
        }));
        return newCat;
      },

      updateCategory: (id, data) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...data } : c)),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },

      addWinner: (winnerData) => {
        const id = winnerData.id || Date.now();
        const newWinner: WinnerItem = { ...winnerData, id };
        set((state) => ({
          winners: [newWinner, ...state.winners],
        }));
        return newWinner;
      },

      getFrontendContests: (params) => {
        const { contests } = get();
        const page = params?.page || 1;
        const per_page = params?.per_page || 9;
        const search = (params?.search || "").toLowerCase().trim();
        const category = (params?.category || "").toLowerCase().trim();

        // Main site shows active and upcoming contests
        let filtered = contests.filter((c) => c.status !== "ended");

        if (category && category !== "all") {
          filtered = filtered.filter(
            (c) => c.category.toLowerCase() === category || generateSlug(c.category) === category
          );
        }

        if (search) {
          filtered = filtered.filter(
            (c) =>
              c.title.toLowerCase().includes(search) ||
              c.category.toLowerCase().includes(search)
          );
        }

        const total = filtered.length;
        const start = (page - 1) * per_page;
        const paginated = filtered.slice(start, start + per_page);
        const data = paginated.map(toFrontendContest);

        return {
          current_page: page,
          data,
          first_page_url: "",
          from: start + 1,
          last_page: Math.max(1, Math.ceil(total / per_page)),
          last_page_url: "",
          links: [],
          next_page_url: null,
          path: "",
          per_page,
          prev_page_url: null,
          to: Math.min(start + per_page, total),
          total,
        };
      },

      getFrontendContestDetails: (slugOrId) => {
        const { contests } = get();
        const contest = contests.find(
          (c) =>
            c.id.toString() === slugOrId.toString() ||
            c.slug === slugOrId ||
            generateSlug(c.title) === slugOrId
        );
        if (!contest) return undefined;

        const base = toFrontendContest(contest);
        return {
          ...base,
          levels: [],
          rules: [
            { id: 1, rule: "Each question has a 30-second countdown." },
            { id: 2, rule: "Cheating or tab switching will disqualify your score." },
            { id: 3, rule: "Prize winners are calculated based on top scores and fastest completion time." },
          ],
          prizes: [
            { id: 1, rank: 1, prize: contest.prize_pool * 0.5 },
            { id: 2, rank: 2, prize: contest.prize_pool * 0.3 },
            { id: 3, rank: 3, prize: contest.prize_pool * 0.2 },
          ],
        } as any;
      },
    }),
    {
      name: "quizix-admin-contests",
    }
  )
);

export function toFrontendContest(c: ContestItem): ContestType {
  const slug = c.slug || generateSlug(c.title);

  return {
    id: c.id,
    image: c.image || "/contest-image.png",
    banner_image: c.image || "/contest-image.png",
    has_level: false,
    contest_level: "intermediate",
    contest_level_name: "Intermediate",
    status_name: c.status,
    status: c.status === "active" ? "active" : c.status === "upcoming" ? "upcoming" : "completed",
    start_time: c.start_time,
    end_time: c.end_time,
    entry_fee: c.entry_fee,
    total_reward_coins: c.prize_pool,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    questions_count: c.total_questions || 15,
    user_contests_count: c.participants_count,
    is_favorite: false,
    category: {
      id: 1,
      title: c.category,
      slug: generateSlug(c.category),
      icon: "ph-medal",
      created_at: "",
      updated_at: "",
    },
    translation: {
      id: c.id,
      contest_id: c.id,
      locale: "en",
      title: c.title,
      slug: slug,
      description:
        c.description ||
        `Enter ${c.title} to compete for ${c.prize_pool} coins and prestigious championship rank!`,
    },
    taken_status: null,
  } as any;
}
