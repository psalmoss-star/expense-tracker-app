"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useMockData } from "@/hooks/use-mock-data"
import { useToast } from "@/hooks/use-toast"

interface AddCardModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddCardModal({ isOpen, onClose }: AddCardModalProps) {
  const { addCard, cards } = useMockData()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    lastFourDigits: "",
    active: true,
    isDefault: false,
  })

  const handleSubmit = () => {
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

    // 첫 카드면 자동으로 기본 카드로 설정
    const isFirstCard = cards.length === 0

    addCard({
      name: formData.name,
      lastFourDigits: formData.lastFourDigits,
      active: formData.active,
      isDefault: isFirstCard || formData.isDefault,
    })

    toast({
      title: "추가 완료",
      description: "카드가 추가되었습니다.",
    })

    setFormData({
      name: "",
      lastFourDigits: "",
      active: true,
      isDefault: false,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>카드 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-name">카드명</Label>
            <Input
              id="card-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="법인카드 1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-digits">카드번호 (마지막 4자리)</Label>
            <Input
              id="card-digits"
              value={formData.lastFourDigits}
              onChange={(e) => setFormData({ ...formData, lastFourDigits: e.target.value })}
              placeholder="4242"
              maxLength={4}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="card-active">활성 상태</Label>
            <Switch
              id="card-active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="card-default">기본 카드로 설정</Label>
            <Switch
              id="card-default"
              checked={formData.isDefault}
              onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSubmit} className="flex-1">
              추가
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
