"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Transaction, Person, Card } from "@/types"

interface Filters {
  type: string
  person: string
  card: string
}

interface ExpenseState {
  transactions: Transaction[]
  people: Person[]
  cards: Card[]
  budget: number
  filters: Filters
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  updateBudget: (budget: number) => void
  updateFilters: (filters: Partial<Filters>) => void
  addPerson: (person: Omit<Person, "id">) => void
  updatePerson: (id: string, person: Partial<Person>) => void
  deletePerson: (id: string) => void
  addCard: (card: Omit<Card, "id">) => void
  updateCard: (id: string, card: Partial<Card>) => void
  deleteCard: (id: string) => void
  setDefaultCard: (id: string) => void
  getDefaultCard: () => Card | undefined
  initializeData: () => void
}

const getSeedTransactions = (): Transaction[] => [
  {
    id: "1",
    date: "2026-01-12",
    merchant: "스타벅스",
    person: "김철수",
    type: "common",
    card: "**** 4242",
    amount: 45500,
    note: "팀 커피 미팅",
  },
  {
    id: "2",
    date: "2026-01-11",
    merchant: "쿠팡",
    person: "이영희",
    type: "common",
    card: "**** 5555",
    amount: 324900,
    note: "사무용품 구매",
  },
  {
    id: "3",
    date: "2026-01-10",
    merchant: "카카오택시",
    person: "박민수",
    type: "personal",
    card: "**** 6789",
    amount: 28750,
    note: "공항 이동",
  },
  {
    id: "4",
    date: "2026-01-09",
    merchant: "대한항공",
    person: "김철수",
    type: "common",
    card: "**** 4242",
    amount: 567000,
    note: "서울-제주 출장",
  },
  {
    id: "5",
    date: "2026-01-08",
    merchant: "신라호텔",
    person: "이영희",
    type: "common",
    card: "**** 5555",
    amount: 892500,
    note: "컨퍼런스 숙박",
  },
  {
    id: "6",
    date: "2026-01-07",
    merchant: "Adobe",
    person: "박민수",
    type: "common",
    card: "**** 4242",
    amount: 54990,
    note: "Creative Cloud 구독",
  },
  {
    id: "7",
    date: "2026-01-06",
    merchant: "이마트",
    person: "김철수",
    type: "personal",
    card: "**** 6789",
    amount: 156320,
    note: "식료품",
  },
  {
    id: "8",
    date: "2026-01-05",
    merchant: "LinkedIn",
    person: "이영희",
    type: "common",
    card: "**** 5555",
    amount: 79990,
    note: "프리미엄 구독",
  },
  {
    id: "9",
    date: "2026-01-04",
    merchant: "GS25",
    person: "박민수",
    type: "personal",
    card: "**** 6789",
    amount: 12300,
    note: "간식",
  },
  {
    id: "10",
    date: "2026-01-03",
    merchant: "Zoom",
    person: "김철수",
    type: "common",
    card: "**** 4242",
    amount: 165000,
    note: "화상회의 구독",
  },
]

const getSeedPeople = (): Person[] => [
  {
    id: "1",
    name: "김철수",
    team: "개발팀",
    active: true,
    defaultCard: "**** 4242",
    monthlyBudget: 3000000,
    notes: "팀 리더",
  },
  {
    id: "2",
    name: "이영희",
    team: "마케팅팀",
    active: true,
    defaultCard: "**** 5555",
    monthlyBudget: 2500000,
    notes: "마케팅 매니저",
  },
  {
    id: "3",
    name: "박민수",
    team: "영업팀",
    active: true,
    defaultCard: "**** 6789",
    monthlyBudget: 2000000,
    notes: "영업 담당",
  },
  {
    id: "4",
    name: "최지은",
    team: "디자인팀",
    active: true,
    defaultCard: "**** 4242",
    monthlyBudget: 1500000,
    notes: "UI/UX 디자이너",
  },
  {
    id: "5",
    name: "정우성",
    team: "개발팀",
    active: true,
    defaultCard: "**** 5555",
    monthlyBudget: 2000000,
    notes: "백엔드 개발자",
  },
]

const getSeedCards = (): Card[] => [
  {
    id: "1",
    name: "법인카드 1",
    lastFourDigits: "4242",
    active: true,
    isDefault: true,
  },
  {
    id: "2",
    name: "법인카드 2",
    lastFourDigits: "5555",
    active: true,
    isDefault: false,
  },
  {
    id: "3",
    name: "법인카드 3",
    lastFourDigits: "6789",
    active: true,
    isDefault: false,
  },
]

export const useMockDataStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      transactions: [],
      people: [],
      cards: [],
      budget: 10000000,
      filters: {
        type: "all",
        person: "all",
        card: "all",
      },
      initializeData: () => {
        const state = get()
        if (state.transactions.length === 0 && state.people.length === 0 && state.cards.length === 0) {
          set({
            transactions: getSeedTransactions(),
            people: getSeedPeople(),
            cards: getSeedCards(),
          })
        }
      },
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            {
              ...transaction,
              id: Date.now().toString(),
            },
            ...state.transactions,
          ],
        })),
      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
      updateBudget: (budget) => set({ budget }),
      updateFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      addPerson: (person) =>
        set((state) => ({
          people: [
            {
              ...person,
              id: Date.now().toString(),
            },
            ...state.people,
          ],
        })),
      updatePerson: (id, updates) =>
        set((state) => ({
          people: state.people.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      deletePerson: (id) =>
        set((state) => ({
          people: state.people.filter((p) => p.id !== id),
        })),
      addCard: (card) =>
        set((state) => ({
          cards: [
            {
              ...card,
              id: Date.now().toString(),
            },
            ...state.cards,
          ],
        })),
      updateCard: (id, updates) =>
        set((state) => ({
          cards: state.cards.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      deleteCard: (id) =>
        set((state) => ({
          cards: state.cards.filter((c) => c.id !== id),
        })),
      setDefaultCard: (id) =>
        set((state) => ({
          cards: state.cards.map((c) => ({
            ...c,
            isDefault: c.id === id,
          })),
        })),
      getDefaultCard: () => {
        return get().cards.find((c) => c.isDefault)
      },
    }),
    {
      name: "expense-tracker-storage",
    },
  ),
)

export function useExpenseKPI() {
  const transactions = useMockDataStore((state) => state.transactions)
  const budget = useMockDataStore((state) => state.budget)
  const people = useMockDataStore((state) => state.people)

  // 전체 사용액
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0)

  // 공통 사용액
  const commonSpent = transactions.filter((t) => t.type === "common").reduce((sum, t) => sum + t.amount, 0)

  // 개인 사용액
  const personalSpent = transactions.filter((t) => t.type === "personal").reduce((sum, t) => sum + t.amount, 0)

  // 개인 예산 합계
  const personalBudgetTotal = people.reduce((sum, p) => sum + (p.monthlyBudget || 0), 0)

  // 전체 예산 = 공통 예산 + 개인 예산 합계
  const totalBudget = budget + personalBudgetTotal

  // 전체 잔고 = 전체 예산 - 전체 사용액
  const totalRemaining = totalBudget - totalSpent

  // 공통 잔고 = 공통 예산 - 공통 사용액
  const commonRemaining = budget - commonSpent

  // 개인 잔고 = 개인 예산 합계 - 개인 사용액
  const personalRemaining = personalBudgetTotal - personalSpent

  // 사용률 = (전체 사용액 / 전체 예산) * 100
  const spendRate = totalBudget === 0 ? 0 : Math.round((totalSpent / totalBudget) * 100)

  return {
    totalSpent,
    commonSpent,
    personalSpent,
    personalBudgetTotal,
    totalBudget,
    totalRemaining,
    commonRemaining,
    personalRemaining,
    spendRate,
    budget,
  }
}

export const useMockData = useMockDataStore
