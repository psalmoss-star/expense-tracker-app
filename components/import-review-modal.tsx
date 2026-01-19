"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useMockData } from "@/hooks/use-mock-data"
import { useToast } from "@/hooks/use-toast"
import type { ImportTransaction } from "@/types"
import { formatKRW } from "@/lib/format"

interface ImportReviewModalProps {
  isOpen: boolean
  onClose: () => void
}

// Mock imported transactions
const mockImportedTransactions: ImportTransaction[] = [
  {
    id: "imp1",
    date: "2026-01-10",
    merchant: "이마트",
    amount: 125990,
    card: "**** 4242",
    category: "쇼핑",
    selected: false,
  },
  {
    id: "imp2",
    date: "2026-01-09",
    merchant: "GS칼텍스",
    amount: 45000,
    card: "**** 5555",
    category: "교통",
    selected: false,
  },
  {
    id: "imp3",
    date: "2026-01-08",
    merchant: "코스트코",
    amount: 234500,
    card: "**** 4242",
    category: "쇼핑",
    selected: false,
  },
]

export function ImportReviewModal({ isOpen, onClose }: ImportReviewModalProps) {
  const { toast } = useToast()
  const { people, addTransaction } = useMockData()
  const [importTransactions, setImportTransactions] = useState(mockImportedTransactions)
  const [bulkPerson, setBulkPerson] = useState("")
  const [bulkType, setBulkType] = useState<"common" | "personal">("common")

  const selectedCount = importTransactions.filter((t) => t.selected).length

  const toggleTransaction = (id: string) => {
    setImportTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t)))
  }

  const toggleAll = () => {
    const allSelected = importTransactions.every((t) => t.selected)
    setImportTransactions((prev) => prev.map((t) => ({ ...t, selected: !allSelected })))
  }

  const handleBulkAssign = () => {
    if (!bulkPerson) {
      toast({
        title: "오류",
        description: "사용자를 선택해주세요",
        variant: "destructive",
      })
      return
    }

    setImportTransactions((prev) => prev.map((t) => (t.selected ? { ...t, person: bulkPerson, type: bulkType } : t)))

    toast({
      title: "완료",
      description: `${selectedCount}건의 사용내역을 ${bulkPerson}에게 할당했습니다`,
    })
  }

  const handleImport = () => {
    const toImport = importTransactions.filter((t) => t.selected && t.person && t.type)

    if (toImport.length === 0) {
      toast({
        title: "오류",
        description: "사용내역을 선택하고 할당해주세요",
        variant: "destructive",
      })
      return
    }

    // TODO: Integrate with Google Sheets API to batch import transactions
    toImport.forEach((t) => {
      addTransaction({
        date: t.date,
        merchant: t.merchant,
        person: t.person!,
        type: t.type!,
        card: t.card,
        amount: t.amount,
        note: t.category ? `${t.category}에서 가져옴` : "가져온 내역",
      })
    })

    toast({
      title: "완료",
      description: `${toImport.length}건의 사용내역을 등록했습니다`,
    })

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>사용내역 검토 및 등록</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bulk actions */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <h4 className="text-sm font-medium text-foreground mb-3">일괄 할당 ({selectedCount}개 선택됨)</h4>
            <div className="flex gap-3">
              <Select value={bulkPerson} onValueChange={setBulkPerson}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="사용자 선택" />
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
              <Select value={bulkType} onValueChange={(v: "common" | "personal") => setBulkType(v)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="common">공통</SelectItem>
                  <SelectItem value="personal">개인</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleBulkAssign} disabled={selectedCount === 0}>
                할당
              </Button>
            </div>
          </div>

          {/* Transaction table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2">
                      <Checkbox checked={importTransactions.every((t) => t.selected)} onCheckedChange={toggleAll} />
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-foreground">날짜</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-foreground">상호</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-foreground">금액</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-foreground">카드</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-foreground">사용자</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-foreground">구분</th>
                  </tr>
                </thead>
                <tbody>
                  {importTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-3 py-2">
                        <Checkbox
                          checked={transaction.selected}
                          onCheckedChange={() => toggleTransaction(transaction.id)}
                        />
                      </td>
                      <td className="px-3 py-2 text-sm text-foreground">{transaction.date}</td>
                      <td className="px-3 py-2 text-sm text-foreground">{transaction.merchant}</td>
                      <td className="px-3 py-2 text-sm text-right font-medium text-foreground">
                        {formatKRW(transaction.amount)}
                      </td>
                      <td className="px-3 py-2 text-sm text-muted-foreground">{transaction.card}</td>
                      <td className="px-3 py-2">
                        {transaction.person ? (
                          <Badge variant="outline" className="text-xs">
                            {transaction.person}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {transaction.type ? (
                          <Badge variant={transaction.type === "common" ? "default" : "secondary"} className="text-xs">
                            {transaction.type === "common" ? "공통" : "개인"}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              취소
            </Button>
            <Button onClick={handleImport} className="flex-1" disabled={selectedCount === 0}>
              선택한 {selectedCount}건 등록
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
