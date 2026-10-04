/** @format */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TicketMessage {
  sender: "user" | "admin";
  sender_name: string;
  message: string;
  time: string;
}

export interface SupportTicket {
  id: number;
  ticket_no: string;
  user_name: string;
  user_email: string;
  subject: string;
  priority: "low" | "medium" | "high";
  status: "open" | "answered" | "closed";
  created_at: string;
  messages: TicketMessage[];
}

const DEFAULT_TICKETS: SupportTicket[] = [
  {
    id: 1,
    ticket_no: "TK-10829",
    user_name: "Alex Morgan",
    user_email: "alex.morgan@example.com",
    subject: "Coins not credited after Stripe payment",
    priority: "high",
    status: "open",
    created_at: "2024-03-03 14:10",
    messages: [
      {
        sender: "user",
        sender_name: "Alex Morgan",
        message:
          "I purchased the 500 Coins bundle 20 minutes ago, but my balance has not updated. Transaction ID is PAY-84729103.",
        time: "2024-03-03 14:10",
      },
    ],
  },
  {
    id: 2,
    ticket_no: "TK-10820",
    user_name: "Sophia Chen",
    user_email: "sophia.c@example.com",
    subject: "How does the referral bonus calculation work?",
    priority: "low",
    status: "answered",
    created_at: "2024-03-02 09:30",
    messages: [
      {
        sender: "user",
        sender_name: "Sophia Chen",
        message: "Can you explain when my referral bonus coins will be unlocked?",
        time: "2024-03-02 09:30",
      },
      {
        sender: "admin",
        sender_name: "Quizix Support Admin",
        message: "Referral bonuses are automatically credited once the invited user plays their first 3 quizzes.",
        time: "2024-03-02 10:15",
      },
    ],
  },
];

interface SupportTicketStoreState {
  tickets: SupportTicket[];

  replyTicket: (id: number, message: string, adminName?: string) => void;
  updateStatus: (id: number, status: "open" | "answered" | "closed") => void;
  deleteTicket: (id: number) => void;
}

export const useSupportTicketStore = create<SupportTicketStoreState>()(
  persist(
    (set) => ({
      tickets: DEFAULT_TICKETS,

      replyTicket: (id, message, adminName = "Quizix Admin") => {
        const time = new Date().toISOString().replace("T", " ").substring(0, 16);
        set((state) => ({
          tickets: state.tickets.map((t) => {
            if (t.id === id) {
              return {
                ...t,
                status: "answered",
                messages: [
                  ...t.messages,
                  {
                    sender: "admin",
                    sender_name: adminName,
                    message,
                    time,
                  },
                ],
              };
            }
            return t;
          }),
        }));
      },

      updateStatus: (id, status) => {
        set((state) => ({
          tickets: state.tickets.map((t) => (t.id === id ? { ...t, status } : t)),
        }));
      },

      deleteTicket: (id) => {
        set((state) => ({
          tickets: state.tickets.filter((t) => t.id !== id),
        }));
      },
    }),
    {
      name: "quizix-admin-support-tickets",
    }
  )
);
