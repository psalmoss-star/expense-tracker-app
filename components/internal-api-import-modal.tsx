"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useMockData } from "@/hooks/use-mock-data"
import { Loader2 } from "lucide-react"
import { formatKRW } from "@/lib/format"

interface ImportTransaction {
  id: string
  date: string
  merchant: string
  amount: number
  card: string
  person?: string
  type?: "common" | "personal"
  selected: boolean
}

interface InternalApiImportModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InternalApiImportModal({ isOpen, onClose }: InternalApiImportModalProps) {
  const { toast } = useToast()
  const { addTransaction, people } = useMockData()

  const [fromDate, setFromDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0])
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState<ImportTransaction[]>([])
  const [bulkPerson, setBulkPerson] = useState("")
  const [bulkType, setBulkType] = useState<"common" | "personal" | "">("")

  const handleFetch = async () => {
    setIsLoading(true)

    // TODO: Replace with actual API call to internal system
    // Example endpoint: GET /api/transactions?from=YYYY-MM-DD&to=YYYY-MM-DD
    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock data response
      const mockData: ImportTransaction[] = [
        {
          id: "imp-1",
          date: "2026-01-13",
          merchant: "스타벅스",
          amount: 25000,
          card: "**** 4242",
          selected: true,
        },
        {
          id: "imp-2",
          date: "2026-01-12",
          merchant: "GS25",
          amount: 8500,
          card: "**** 5555",
          selected: true,
        },
        {
          id: "imp-3",
          date: "2026-01-11",
          merchant: "쿠팡",
          amount: 145000,
          card: "**** 4242",
          selected: true,
        },
      ]

      setTransactions(mockData)
      toast({
        title: "완료",
        description: `${mockData.length}건의 사용내역을 불러왔습니다`,
      })
    } catch (error) {
      toast({
        title: "오류",
        description: "사용내역을 불러오는 중 오류가 발생했습니다",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleSelect = (id: string) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t)))
  }

  const handleToggleAll = () => {
    const allSelected = transactions.every((t) => t.selected)
    setTransactions((prev) => prev.map((t) => ({ ...t, selected: !allSelected })))
  }

  const handleBulkAssign = () => {
    if (!bulkPerson && !bulkType) {
      toast({
        title: "알림",
        description: "사용자 또는 구분을 선택해주세요",
        variant: "destructive",
      })
      return
    }

    setTransactions((prev) =>
      prev.map((t) =>
        t.selected
          ? {
              ...t,
              person: bulkPerson || t.person,
              type: bulkType || t.type,
            }
          : t,
      ),
    )

    toast({
      title: "완료",
      description: "선택한 항목에 적용되었습니다",
    })
  }

  const handleImport = () => {
    const selectedTransactions = transactions.filter((t) => t.selected)

    if (selectedTransactions.length === 0) {
      toast({
        title: "알림",
        description: "등록할 항목을 선택해주세요",
        variant: "destructive",
      })
      return
    }

    const missingFields = selectedTransactions.filter((t) => !t.person || !t.type)
    if (missingFields.length > 0) {
      toast({
        title: "알림",
        description: "모든 항목에 사용자와 구분을 지정해주세요",
        variant: "destructive",
      })
      return
    }

    // TODO: Add transactions via API
    selectedTransactions.forEach((t) => {
      addTransaction({
        date: t.date,
        merchant: t.merchant,
        amount: t.amount,
        card: t.card,
        person: t.person!,
        type: t.type!,
        note: "사내 시스템에서 가져옴",
      })
    })

    toast({
      title: "완료",
      description: `${selectedTransactions.length}건의 사용내역이 등록되었습니다`,
    })

    onClose()
  }

  const selectedCount = transactions.filter((t) => t.selected).length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>사용내역 불러오기</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date range selector */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fromDate">시작일</Label>
              <Input id="fromDate" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="toDate">종료일</Label>
              <Input id="toDate" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
          </div>

          <Button onClick={handleFetch} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                불러오는 중...
              </>
            ) : (
              "사용내역 불러오기"
            )}
          </Button>

          {transactions.length > 0 && (
            <>
              {/* Bulk assignment */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <h4 className="font-medium text-foreground">일괄 지정</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Select value={bulkPerson} onValueChange={setBulkPerson}>
                    <SelectTrigger>
                      <SelectValue placeholder="사용자 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">지정 안 함</SelectItem>
                      {people
                        .filter((p) => p.active)
                        .map((p) => (
                          <SelectItem key={p.id} value={p.name}>
                            {p.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <Select value={bulkType} onValueChange={(v: "common" | "personal" | "") => setBulkType(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="구분 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">지정 안 함</SelectItem>
                      <SelectItem value="common">공통</SelectItem>
                      <SelectItem value="personal">개인</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleBulkAssign} variant="outline" size="sm" className="w-full bg-transparent">
                  선택한 항목에 적용
                </Button>
              </div>

              {/* Transactions table */}
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="px-3 py-2 text-left">
                          <Checkbox checked={transactions.every((t) => t.selected)} onCheckedChange={handleToggleAll} />
                        </th>
                        <th className="px-3 py-2 text-left text-sm font-medium">사용일</th>
                        <th className="px-3 py-2 text-left text-sm font-medium">상호</th>
                        <th className="px-3 py-2 text-right text-sm font-medium">금액</th>
                        <th className="px-3 py-2 text-left text-sm font-medium">카드</th>
                        <th className="px-3 py-2 text-left text-sm font-medium">사용자</th>
                        <th className="px-3 py-2 text-left text-sm font-medium">구분</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t) => (
                        <tr key={t.id} className="border-b hover:bg-muted/30">
                          <td className="px-3 py-2">
                            <Checkbox checked={t.selected} onCheckedChange={() => handleToggleSelect(t.id)} />
                          </td>
                          <td className="px-3 py-2 text-sm">{t.date}</td>
                          <td className="px-3 py-2 text-sm">{t.merchant}</td>
                          <td className="px-3 py-2 text-sm text-right font-medium">{formatKRW(t.amount)}</td>
                          <td className="px-3 py-2 text-sm text-muted-foreground">{t.card}</td>
                          <td className="px-3 py-2">
                            {t.person ? (
                              <Badge variant="secondary" className="text-xs">
                                {t.person}
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">미지정</span>
                            )}
                          </td>
                          <td className="px-3 py-2">
                            {t.type ? (
                              <Badge variant={t.type === "common" ? "default" : "secondary"} className="text-xs">
                                {t.type === "common" ? "공통" : "개인"}
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">미지정</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-muted-foreground">{selectedCount}개 항목 선택됨</p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={onClose} className="bg-transparent">
                    취소
                  </Button>
                  <Button onClick={handleImport}>선택 항목 등록</Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
