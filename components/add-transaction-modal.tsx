"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Transaction } from "@/types"
import { useMockData } from "@/hooks/use-mock-data"

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (transaction: Omit<Transaction, "id">) => void
}

export function AddTransactionModal({ isOpen, onClose, onAdd }: AddTransactionModalProps) {
  const { toast } = useToast()
  const { people } = useMockData()

  const [merchant, setMerchant] = useState("")
  const [person, setPerson] = useState(people[0]?.name || "")
  const [type, setType] = useState<"common" | "personal">("common")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [card, setCard] = useState("**** 4242")
  const [note, setNote] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!merchant || !amount) {
      toast({
        title: "오류",
        description: "필수 항목을 입력해주세요",
        variant: "destructive",
      })
      return
    }

    onAdd({
      merchant,
      person,
      type,
      amount: Number.parseFloat(amount),
      date,
      card,
      note,
    })

    toast({
      title: "완료",
      description: "사용내역이 추가되었습니다",
    })

    // Reset form but keep modal open for rapid entry
    setMerchant("")
    setAmount("")
    setNote("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>사용내역 추가</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="merchant">상호 *</Label>
            <Input
              id="merchant"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="예: 스타벅스"
              list="merchant-suggestions"
              required
            />
            <datalist id="merchant-suggestions">
              <option value="스타벅스" />
              <option value="쿠팡" />
              <option value="카카오택시" />
              <option value="대한항공" />
            </datalist>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="person">사용자</Label>
              <Select value={person} onValueChange={setPerson}>
                <SelectTrigger id="person">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {people
                    .filter((p) => p.active)
                    .map((p) => (
                      <SelectItem key={p.id} value={p.name}>
                        {p.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">구분</Label>
              <Select value={type} onValueChange={(v: "common" | "personal") => setType(v)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="common">공통</SelectItem>
                  <SelectItem value="personal">개인</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">금액 *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">사용일</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="card">카드</Label>
            <Select value={card} onValueChange={setCard}>
              <SelectTrigger id="card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="**** 4242">**** 4242</SelectItem>
                <SelectItem value="**** 5555">**** 5555</SelectItem>
                <SelectItem value="**** 6789">**** 6789</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">메모 (선택사항)</Label>
            <Input id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="메모 입력..." />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              취소
            </Button>
            <Button type="submit" className="flex-1">
              추가
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
