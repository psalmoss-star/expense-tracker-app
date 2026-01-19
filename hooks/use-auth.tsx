"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthState {
  role: "admin" | "user"
  toggleRole: () => void
  isAdmin: () => boolean
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      role: "admin", // 기본값은 관리자로 설정 (데모용)
      toggleRole: () =>
        set((state) => ({
          role: state.role === "admin" ? "user" : "admin",
        })),
      isAdmin: () => get().role === "admin",
    }),
    {
      name: "expense-auth-storage",
    },
  ),
)
