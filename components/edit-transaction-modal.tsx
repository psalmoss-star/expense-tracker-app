"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useMockData } from "@/hooks/use-mock-data"
import { useToast } from "@/hooks/use-toast"
import type { Transaction } from "@/types"

interface EditTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction | null
  onUpdate: (id: string, transaction: Partial<Transaction>) => void
}

export function EditTransactionModal({ isOpen, onClose, transaction, onUpdate }: EditTransactionModalProps) {
  const { people, cards } = useMockData()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    date: "",
    merchant: "",
    amount: "",
    card: "",
    person: "",
    type: "common" as "common" | "personal",
    note: "",
  })

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date,
        merchant: transaction.merchant,
        amount: transaction.amount.toString(),
        card: transaction.card,
        person: transaction.person,
        type: transaction.type,
        note: transaction.note || "",
      })
    }
  }, [transaction])

  const handleSubmit = () => {
    if (!transaction) return

    if (!formData.date || !formData.merchant || !formData.amount) {
      toast({
        title: "오류",
        description: "사용일, 상호, 금액은 필수 입력 항목입니다.",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(formData.amount)
    if (isNaN(amount) || amount < 0) {
      toast({
        title: "오류",
        description: "올바른 금액을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    onUpdate(transaction.id, {
      date: formData.date,
      merchant: formData.merchant,
      amount,
      card: formData.card,
      person: formData.person,
      type: formData.type,
      note: formData.note,
    })

    toast({
      title: "수정 완료",
      description: "사용내역이 수정되었습니다.",
    })

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>사용내역 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-date">사용일</Label>
            <Input
              id="edit-date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-merchant">상호 (사용처)</Label>
            <Input
              id="edit-merchant"
              value={formData.merchant}
              onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
              placeholder="스타벅스"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-amount">금액 (원)</Label>
            <Input
              id="edit-amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="50000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-card">카드</Label>
            <Select value={formData.card} onValueChange={(v) => setFormData({ ...formData, card: v })}>
              <SelectTrigger id="edit-card">
                <SelectValue placeholder="카드 선택" />
              </SelectTrigger>
              <SelectContent>
                {cards.map((card) => (
                  <SelectItem key={card.id} value={`**** ${card.lastFourDigits}`}>
                    {card.name} (**** {card.lastFourDigits})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-person">누구 (사용자)</Label>
            <Select value={formData.person} onValueChange={(v) => setFormData({ ...formData, person: v })}>
              <SelectTrigger id="edit-person">
                <SelectValue placeholder="사용자 선택" />
              </SelectTrigger>
              <SelectContent>
                {people.map((person) => (
                  <SelectItem key={person.id} value={person.name}>
                    {person.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-type">구분</Label>
            <Select
              value={formData.type}
              onValueChange={(v: "common" | "personal") => setFormData({ ...formData, type: v })}
            >
              <SelectTrigger id="edit-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="common">공통</SelectItem>
                <SelectItem value="personal">개인</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-note">비고</Label>
            <Textarea
              id="edit-note"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="메모를 입력하세요"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSubmit} className="flex-1">
              수정
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              취소
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
