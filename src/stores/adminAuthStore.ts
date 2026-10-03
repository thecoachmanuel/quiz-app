/** @format */
"use client";

import {
  getAdminToken,
  removeAdminToken,
  setAdminToken,
} from "@/configs/adminApi";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AdminUser {
  id: number;
  full_name: string;
  name?: string;
  email: string;
  avatar?: string;
  roles?: string[];
  role?: string;
}

interface AdminAuthState {
  token: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (token: string, user: AdminUser) => void;
  setToken: (token: string) => void;
  setUser: (user: AdminUser) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      token: getAdminToken(),
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: (token: string, user: AdminUser) => {
        setAdminToken(token);
        set({ token, user, isAuthenticated: true });
      },

      setToken: (token: string) => {
        setAdminToken(token);
        set({ token, isAuthenticated: true });
      },

      setUser: (user: AdminUser) => {
        set({ user });
      },

      logout: () => {
        removeAdminToken();
        set({ token: null, user: null, isAuthenticated: false });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },
    }),
    {
      name: "admin-auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
