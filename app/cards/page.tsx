"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AppLayout } from "@/components/app-layout"
import { useMockData } from "@/hooks/use-mock-data"
import { useAuth } from "@/hooks/use-auth"
import { Plus, Edit, Trash2, CreditCard } from "lucide-react"
import { AddCardModal } from "@/components/add-card-modal"
import { EditCardModal } from "@/components/edit-card-modal"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function CardsPage() {
  const { cards, deleteCard, setDefaultCard, initializeData } = useMockData()
  const { isAdmin } = useAuth()
  const { toast } = useToast()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    initializeData()
  }, [initializeData])

  const handleSetDefault = (id: string) => {
    if (!isAdmin()) {
      toast({
        title: "권한 없음",
        description: "관리자만 기본 카드를 변경할 수 있습니다.",
        variant: "destructive",
      })
      return
    }

    setDefaultCard(id)
    toast({
      title: "완료",
      description: "기본 카드가 변경되었습니다.",
    })
  }

  const handleEdit = (card: any) => {
    if (!isAdmin()) {
      toast({
        title: "권한 없음",
        description: "관리자만 카드를 수정할 수 있습니다.",
        variant: "destructive",
      })
      return
    }

    setEditingCard(card)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    if (!isAdmin()) {
      toast({
        title: "권한 없음",
        description: "관리자만 카드를 삭제할 수 있습니다.",
        variant: "destructive",
      })
      return
    }

    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteCard(deletingId)
      toast({
        title: "삭제 완료",
        description: "카드가 삭제되었습니다.",
      })
      setDeletingId(null)
    }
    setDeleteDialogOpen(false)
  }

  return (
    <AppLayout>
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">카드 관리</h1>
            <p className="mt-2 text-muted-foreground">법인카드를 관리하고 기본 카드를 설정하세요</p>
          </div>
          {isAdmin() && (
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              카드 추가
            </Button>
          )}
        </div>

        {!isAdmin() && (
          <Card className="p-4 bg-muted border-border">
            <p className="text-sm text-muted-foreground">
              일반 사용자는 카드 목록을 조회할 수 있습니다. 카드를 추가하거나 수정하려면 관리자에게 문의하세요.
            </p>
          </Card>
        )}

        <div className="grid gap-4">
          {cards.map((card) => (
            <Card key={card.id} className="p-6 bg-card border-border">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-foreground">{card.name}</h3>
                      {card.isDefault && <Badge variant="default">기본 카드</Badge>}
                      {!card.active && <Badge variant="secondary">비활성</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">**** **** **** {card.lastFourDigits}</p>
                    <div className="mt-3 flex gap-2">
                      {!card.isDefault && isAdmin() && (
                        <Button variant="outline" size="sm" onClick={() => handleSetDefault(card.id)}>
                          기본 카드로 설정
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                {isAdmin() && (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(card)} className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(card.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      disabled={card.isDefault}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}

          {cards.length === 0 && (
            <Card className="p-12 bg-card border-border">
              <div className="text-center">
                <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">카드가 없습니다</h3>
                <p className="mt-2 text-sm text-muted-foreground">첫 번째 법인카드를 추가하세요</p>
                {isAdmin() && (
                  <Button onClick={() => setIsAddModalOpen(true)} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    카드 추가
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      <AddCardModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      <EditCardModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingCard(null)
        }}
        card={editingCard}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 선택한 카드가 영구적으로 삭제됩니다. 기본 카드는 삭제할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  )
}
