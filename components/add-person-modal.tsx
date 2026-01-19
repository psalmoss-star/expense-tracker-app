"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useMockData } from "@/hooks/use-mock-data"

interface AddPersonModalProps {
  isOpen: boolean
  onClose: () => void
  editingPersonId?: string | null
}

export function AddPersonModal({ isOpen, onClose, editingPersonId }: AddPersonModalProps) {
  const { toast } = useToast()
  const { people, addPerson, updatePerson } = useMockData()

  const editingPerson = editingPersonId ? people.find((p) => p.id === editingPersonId) : null

  const [name, setName] = useState("")
  const [team, setTeam] = useState("")
  const [active, setActive] = useState(true)
  const [defaultCard, setDefaultCard] = useState("")
  const [monthlyBudget, setMonthlyBudget] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (editingPerson) {
      setName(editingPerson.name)
      setTeam(editingPerson.team || "")
      setActive(editingPerson.active)
      setDefaultCard(editingPerson.defaultCard || "")
      setMonthlyBudget(editingPerson.monthlyBudget?.toString() || "")
      setNotes(editingPerson.notes || "")
    } else {
      setName("")
      setTeam("")
      setActive(true)
      setDefaultCard("")
      setMonthlyBudget("")
      setNotes("")
    }
  }, [editingPerson, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) {
      toast({
        title: "오류",
        description: "이름을 입력해주세요",
        variant: "destructive",
      })
      return
    }

    const budget = monthlyBudget ? Number.parseFloat(monthlyBudget) : undefined
    if (monthlyBudget && (isNaN(budget!) || budget! < 0)) {
      toast({
        title: "오류",
        description: "예산은 양수여야 합니다",
        variant: "destructive",
      })
      return
    }

    const personData = {
      name,
      team: team || undefined,
      active,
      defaultCard: defaultCard || undefined,
      monthlyBudget: budget,
      notes: notes || undefined,
    }

    if (editingPersonId) {
      // TODO: Integrate with Google Sheets API to update person
      updatePerson(editingPersonId, personData)
      toast({
        title: "완료",
        description: "사람 정보가 업데이트되었습니다",
      })
    } else {
      // TODO: Integrate with Google Sheets API to add person
      addPerson(personData)
      toast({
        title: "완료",
        description: "사람이 추가되었습니다",
      })
    }

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingPersonId ? "사람 수정" : "사람 추가"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">이름 *</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 김철수" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="team">팀 (선택사항)</Label>
            <Input id="team" value={team} onChange={(e) => setTeam(e.target.value)} placeholder="예: 개발팀" />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="active">활성</Label>
            <Switch id="active" checked={active} onCheckedChange={setActive} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultCard">기본 카드 (선택사항)</Label>
            <Select value={defaultCard} onValueChange={setDefaultCard}>
              <SelectTrigger id="defaultCard">
                <SelectValue placeholder="카드 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">없음</SelectItem>
                <SelectItem value="**** 4242">**** 4242</SelectItem>
                <SelectItem value="**** 5555">**** 5555</SelectItem>
                <SelectItem value="**** 6789">**** 6789</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyBudget">예산 (선택사항)</Label>
            <Input
              id="monthlyBudget"
              type="number"
              step="0.01"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">메모 (선택사항)</Label>
            <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="메모 입력..." />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              취소
            </Button>
            <Button type="submit" className="flex-1">
              {editingPersonId ? "수정" : "추가"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
