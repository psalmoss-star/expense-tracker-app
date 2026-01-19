"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useMockData } from "@/hooks/use-mock-data"
import { useToast } from "@/hooks/use-toast"
import type { Card } from "@/types"

interface EditCardModalProps {
  isOpen: boolean
  onClose: () => void
  card: Card | null
}

export function EditCardModal({ isOpen, onClose, card }: EditCardModalProps) {
  const { updateCard } = useMockData()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    lastFourDigits: "",
    active: true,
  })

  useEffect(() => {
    if (card) {
      setFormData({
        name: card.name,
        lastFourDigits: card.lastFourDigits,
        active: card.active,
      })
    }
  }, [card])

  const handleSubmit = () => {
    if (!card) return

    if (!formData.name || !formData.lastFourDigits) {
      toast({
        title: "오류",
        description: "카드명과 카드번호(마지막 4자리)를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    if (formData.lastFourDigits.length !== 4 || !/^\d+$/.test(formData.lastFourDigits)) {
      toast({
        title: "오류",
        description: "카드번호는 4자리 숫자여야 합니다.",
        variant: "destructive",
      })
      return
    }

    updateCard(card.id, {
      name: formData.name,
      lastFourDigits: formData.lastFourDigits,
      active: formData.active,
    })

    toast({
      title: "수정 완료",
      description: "카드 정보가 수정되었습니다.",
    })

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>카드 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-card-name">카드명</Label>
            <Input
              id="edit-card-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="법인카드 1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-card-digits">카드번호 (마지막 4자리)</Label>
            <Input
              id="edit-card-digits"
              value={formData.lastFourDigits}
              onChange={(e) => setFormData({ ...formData, lastFourDigits: e.target.value })}
              placeholder="4242"
              maxLength={4}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="edit-card-active">활성 상태</Label>
            <Switch
              id="edit-card-active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
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
