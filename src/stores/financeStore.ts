/** @format */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUserStore } from "./userStore";

export interface DepositItem {
  id: number;
  trx_id: string;
  user_name: string;
  user_email: string;
  gateway: string;
  amount: number;
  fee: number;
  total: number;
  status: "pending" | "completed" | "rejected";
  created_at: string;
}

export interface WithdrawalItem {
  id: number;
  trx_id: string;
  user_name: string;
  user_email: string;
  method: string;
  account_info?: string;
  amount: number;
  fee: number;
  final_amount: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

const DEFAULT_DEPOSITS: DepositItem[] = [
  {
    id: 1,
    trx_id: "DP-92841029",
    user_name: "Alex Morgan",
    user_email: "alex.morgan@example.com",
    gateway: "Stripe",
    amount: 100.0,
    fee: 2.5,
    total: 102.5,
    status: "completed",
    created_at: "2024-03-02 14:22",
  },
  {
    id: 2,
    trx_id: "DP-81729384",
    user_name: "Sophia Chen",
    user_email: "sophia.c@example.com",
    gateway: "PayPal",
    amount: 50.0,
    fee: 1.5,
    total: 51.5,
    status: "completed",
    created_at: "2024-03-01 09:15",
  },
  {
    id: 3,
    trx_id: "DP-71625344",
    user_name: "David Miller",
    user_email: "d.miller@example.com",
    gateway: "Bank Transfer",
    amount: 250.0,
    fee: 0.0,
    total: 250.0,
    status: "pending",
    created_at: "2024-03-03 11:45",
  },
];

const DEFAULT_WITHDRAWALS: WithdrawalItem[] = [
  {
    id: 1,
    trx_id: "WD-19827364",
    user_name: "Sophia Chen",
    user_email: "sophia.c@example.com",
    method: "PayPal",
    account_info: "sophia.payouts@gmail.com",
    amount: 150.0,
    fee: 3.0,
    final_amount: 147.0,
    status: "approved",
    created_at: "2024-03-02 16:40",
  },
  {
    id: 2,
    trx_id: "WD-29384756",
    user_name: "Alex Morgan",
    user_email: "alex.morgan@example.com",
    method: "Bank Transfer",
    account_info: "Chase Bank - Acct ****4892",
    amount: 80.0,
    fee: 1.5,
    final_amount: 78.5,
    status: "pending",
    created_at: "2024-03-03 10:12",
  },
];

interface FinanceStoreState {
  deposits: DepositItem[];
  withdrawals: WithdrawalItem[];

  approveDeposit: (id: number) => void;
  rejectDeposit: (id: number) => void;
  deleteDeposit: (id: number) => void;

  approveWithdrawal: (id: number) => void;
  rejectWithdrawal: (id: number) => void;
  deleteWithdrawal: (id: number) => void;
}

export const useFinanceStore = create<FinanceStoreState>()(
  persist(
    (set, get) => ({
      deposits: DEFAULT_DEPOSITS,
      withdrawals: DEFAULT_WITHDRAWALS,

      approveDeposit: (id) => {
        const item = get().deposits.find((d) => d.id === id);
        if (item && item.status !== "completed") {
          // Find user by email and credit balance
          const users = useUserStore.getState().users;
          const user = users.find((u) => u.email.toLowerCase() === item.user_email.toLowerCase());
          if (user) {
            useUserStore.getState().adjustBalance(user.id, item.amount, "add");
          }
        }
        set((state) => ({
          deposits: state.deposits.map((d) =>
            d.id === id ? { ...d, status: "completed" } : d
          ),
        }));
      },

      rejectDeposit: (id) => {
        set((state) => ({
          deposits: state.deposits.map((d) =>
            d.id === id ? { ...d, status: "rejected" } : d
          ),
        }));
      },

      deleteDeposit: (id) => {
        set((state) => ({
          deposits: state.deposits.filter((d) => d.id !== id),
        }));
      },

      approveWithdrawal: (id) => {
        set((state) => ({
          withdrawals: state.withdrawals.map((w) =>
            w.id === id ? { ...w, status: "approved" } : w
          ),
        }));
      },

      rejectWithdrawal: (id) => {
        const item = get().withdrawals.find((w) => w.id === id);
        if (item && item.status !== "rejected") {
          // Refund user balance
          const users = useUserStore.getState().users;
          const user = users.find((u) => u.email.toLowerCase() === item.user_email.toLowerCase());
          if (user) {
            useUserStore.getState().adjustBalance(user.id, item.amount, "add");
          }
        }
        set((state) => ({
          withdrawals: state.withdrawals.map((w) =>
            w.id === id ? { ...w, status: "rejected" } : w
          ),
        }));
      },

      deleteWithdrawal: (id) => {
        set((state) => ({
          withdrawals: state.withdrawals.filter((w) => w.id !== id),
        }));
      },
    }),
    {
      name: "quizix-admin-finance",
    }
  )
);
