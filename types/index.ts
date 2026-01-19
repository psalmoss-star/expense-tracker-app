export interface Person {
  id: string
  name: string
  team?: string
  active: boolean
  defaultCard?: string
  monthlyBudget?: number
  notes?: string
}

export interface Transaction {
  id: string
  date: string
  merchant: string
  person: string
  type: "common" | "personal"
  card: string
  amount: number
  note?: string
}

export interface ImportTransaction {
  id: string
  date: string
  merchant: string
  amount: number
  card: string
  category?: string
  selected: boolean
  person?: string
  type?: "common" | "personal"
}

export interface Card {
  id: string
  name: string
  lastFourDigits: string
  active: boolean
  isDefault: boolean
}

export type UserRole = "admin" | "user"
