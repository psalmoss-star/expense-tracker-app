"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Search, ChevronLeft, ChevronRight, ArrowUpDown, Edit, Trash2 } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { AddTransactionModal } from "@/components/add-transaction-modal"
import { EditTransactionModal } from "@/components/edit-transaction-modal"
import { useMockData, useExpenseKPI } from "@/hooks/use-mock-data"
import { useAuth } from "@/hooks/use-auth"
import { formatKRW } from "@/lib/format"
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

export function DashboardContent() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const { toast } = useToast()

  const {
    transactions,
    people,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    filters,
    updateFilters,
    initializeData,
  } = useMockData()

  const { totalSpent, totalBudget, totalRemaining, spendRate } = useExpenseKPI()

  const { isAdmin } = useAuth()

  useEffect(() => {
    initializeData()
  }, [initializeData])

  const personSpending = transactions.reduce(
    (acc, t) => {
      if (!acc[t.person]) {
        acc[t.person] = 0
      }
      acc[t.person] += t.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const personBudgetSummary = people
    .map((person) => {
      const spent = personSpending[person.name] || 0
      const budget = person.monthlyBudget || 0
      return {
        name: person.name,
        spent,
        budget,
        hasBudget: person.monthlyBudget !== undefined && person.monthlyBudget > 0,
      }
    })
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5)

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.person.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filters.type === "all" || t.type === filters.type
    const matchesPerson = filters.person === "all" || t.person === filters.person
    const matchesCard = filters.card === "all" || t.card === filters.card

    return matchesSearch && matchesType && matchesPerson && matchesCard
  })

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteTransaction(deletingId)
      toast({
        title: "삭제 완료",
        description: "사용내역이 삭제되었습니다.",
      })
      setDeletingId(null)
    }
    setDeleteDialogOpen(false)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6 bg-card border-border">
            <div className="text-sm font-medium text-muted-foreground">예산</div>
            <div className="mt-2 text-3xl font-bold text-foreground">{formatKRW(totalBudget)}</div>
          </Card>
          <Card className="p-6 bg-card border-border">
            <div className="text-sm font-medium text-muted-foreground">사용액</div>
            <div className="mt-2 text-3xl font-bold text-chart-1">{formatKRW(totalSpent)}</div>
          </Card>
          <Card className="p-6 bg-card border-border">
            <div className="text-sm font-medium text-muted-foreground">잔고</div>
            <div className={`mt-2 text-3xl font-bold ${totalRemaining >= 0 ? "text-chart-2" : "text-destructive"}`}>
              {formatKRW(totalRemaining)}
            </div>
          </Card>
        </div>

        {/* Progress Gauge */}
        <Card className="p-6 bg-card border-border">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-foreground">사용률</div>
              <div className="text-2xl font-bold text-foreground">{spendRate}%</div>
            </div>
            <Progress value={spendRate} className="h-3" />
            <div className="text-sm text-muted-foreground">{spendRate < 100 ? "정상 범위" : "예산 초과"}</div>
          </div>
        </Card>

        {/* Per-Person Budget Summary */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">사람별 예산 요약</h3>
          <div className="space-y-3">
            {personBudgetSummary.map((person) => (
              <div key={person.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{person.name}</p>
                  <p className="text-sm text-muted-foreground">사용: {formatKRW(person.spent)}</p>
                </div>
                <div className="text-right">
                  {person.hasBudget ? (
                    <>
                      <p className="font-semibold text-foreground">{formatKRW(person.budget)}</p>
                      <p className="text-xs text-muted-foreground">예산</p>
                    </>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      미설정
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Filters */}
        <Card className="p-4 bg-card border-border">
          <div className="flex flex-wrap gap-3">
            <Select value={filters.type} onValueChange={(v) => updateFilters({ type: v })}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="구분" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 구분</SelectItem>
                <SelectItem value="common">공통</SelectItem>
                <SelectItem value="personal">개인</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.person} onValueChange={(v) => updateFilters({ person: v })}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="사용자" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 사용자</SelectItem>
                {people.map((person) => (
                  <SelectItem key={person.id} value={person.name}>
                    {person.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.card} onValueChange={(v) => updateFilters({ card: v })}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="카드" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 카드</SelectItem>
                <SelectItem value="**** 4242">**** 4242</SelectItem>
                <SelectItem value="**** 5555">**** 5555</SelectItem>
                <SelectItem value="**** 6789">**** 6789</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Transactions Table */}
        <Card className="bg-card border-border">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="사용내역 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                    <button className="flex items-center gap-1 hover:text-foreground">
                      사용일 <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">상호</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">사용자</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">구분</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">카드</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-foreground">금액</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">메모</th>
                  {isAdmin() && <th className="px-4 py-3 text-left text-sm font-medium text-foreground">작업</th>}
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-border hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm text-foreground">{transaction.date}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{transaction.merchant}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{transaction.person}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant={transaction.type === "common" ? "default" : "secondary"}>
                        {transaction.type === "common" ? "공통" : "개인"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{transaction.card}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-foreground">
                      {formatKRW(transaction.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{transaction.note || "-"}</td>
                    {isAdmin() && (
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(transaction)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(transaction.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {(currentPage - 1) * itemsPerPage + 1}부터{" "}
              {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}까지 (전체{" "}
              {filteredTransactions.length}건)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm text-foreground">
                {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Floating Add Button */}
      <Button
        size="lg"
        className="fixed bottom-20 right-6 lg:bottom-6 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setIsAddModalOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      <AddTransactionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={addTransaction} />

      <EditTransactionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingTransaction(null)
        }}
        transaction={editingTransaction}
        onUpdate={updateTransaction}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 선택한 사용내역이 영구적으로 삭제됩니다.
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
