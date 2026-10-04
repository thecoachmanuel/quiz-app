/** @format */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserItem {
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

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  target_audience: "all" | "active" | "banned" | "unverified";
  sent_at: string;
  recipients_count: number;
}

const DEFAULT_USERS: UserItem[] = [
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
    coins: 2900,
    balance: 55.0,
    status: "active",
    email_verified_at: "2024-02-12",
    is_kyc_verified: true,
    created_at: "2024-02-11",
  },
];

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: "New Weekend Trivia Tournament Announced!",
    message: "Join the Weekend Mega Championship now with $1,500 in prizes up for grabs!",
    target_audience: "all",
    sent_at: "2024-03-01 10:00",
    recipients_count: 6,
  },
];

interface UserStoreState {
  users: UserItem[];
  notifications: NotificationItem[];

  addUser: (user: Omit<UserItem, "id"> & { id?: number }) => UserItem;
  updateUser: (id: number, data: Partial<UserItem>) => void;
  deleteUser: (id: number) => void;
  toggleBan: (id: number) => void;
  adjustBalance: (id: number, amount: number, type: "add" | "subtract") => void;
  adjustCoins: (id: number, amount: number, type: "add" | "subtract") => void;
  sendNotification: (n: Omit<NotificationItem, "id" | "sent_at">) => NotificationItem;
  setUsers: (users: UserItem[]) => void;
}

export const useUserStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      users: DEFAULT_USERS,
      notifications: DEFAULT_NOTIFICATIONS,

      addUser: (userData) => {
        const id = userData.id || Date.now();
        const fullName = userData.name || `${userData.first_name} ${userData.last_name}`.trim();
        const newUser: UserItem = {
          ...userData,
          id,
          name: fullName,
          coins: userData.coins ?? 100,
          balance: userData.balance ?? 0,
          status: userData.status ?? "active",
          email_verified_at: userData.email_verified_at ?? new Date().toISOString().split("T")[0],
          is_kyc_verified: userData.is_kyc_verified ?? false,
          created_at: userData.created_at ?? new Date().toISOString().split("T")[0],
        };
        set((state) => ({
          users: [newUser, ...state.users],
        }));
        return newUser;
      },

      updateUser: (id, data) => {
        set((state) => ({
          users: state.users.map((u) => {
            if (u.id === id) {
              const updated = { ...u, ...data };
              if (data.first_name || data.last_name) {
                updated.name = `${updated.first_name} ${updated.last_name}`.trim();
              }
              return updated;
            }
            return u;
          }),
        }));
      },

      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        }));
      },

      toggleBan: (id) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id
              ? { ...u, status: u.status === "active" ? "banned" : "active" }
              : u
          ),
        }));
      },

      adjustBalance: (id, amount, type) => {
        set((state) => ({
          users: state.users.map((u) => {
            if (u.id === id) {
              const newBal =
                type === "add" ? u.balance + amount : Math.max(0, u.balance - amount);
              return { ...u, balance: parseFloat(newBal.toFixed(2)) };
            }
            return u;
          }),
        }));
      },

      adjustCoins: (id, amount, type) => {
        set((state) => ({
          users: state.users.map((u) => {
            if (u.id === id) {
              const newCoins =
                type === "add" ? u.coins + amount : Math.max(0, u.coins - amount);
              return { ...u, coins: Math.round(newCoins) };
            }
            return u;
          }),
        }));
      },

      sendNotification: (nData) => {
        const id = Date.now();
        const sent_at = new Date().toISOString().replace("T", " ").substring(0, 16);
        const newNotification: NotificationItem = {
          ...nData,
          id,
          sent_at,
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));
        return newNotification;
      },

      setUsers: (users) => set({ users }),
    }),
    {
      name: "quizix-admin-users",
    }
  )
);
