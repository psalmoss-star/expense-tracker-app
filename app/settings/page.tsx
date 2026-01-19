"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AppLayout } from "@/components/app-layout"
import { useMockData, useExpenseKPI } from "@/hooks/use-mock-data"
import { useAuth } from "@/hooks/use-auth"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { formatKRW } from "@/lib/format"

export default function SettingsPage() {
  const { budget, updateBudget, initializeData } = useMockData()
  const { totalSpent, commonSpent, personalSpent, personalBudgetTotal, totalBudget, totalRemaining, commonRemaining } =
    useExpenseKPI()

  const { role, toggleRole } = useAuth()
  const { toast } = useToast()
  const [budgetInput, setBudgetInput] = useState(budget.toString())

  useEffect(() => {
    initializeData()
  }, [initializeData])

  useEffect(() => {
    setBudgetInput(budget.toString())
  }, [budget])

  const handleSave = () => {
    const newBudget = Number.parseFloat(budgetInput)
    if (isNaN(newBudget) || newBudget < 0) {
      toast({
        title: "오류",
        description: "올바른 예산 금액을 입력해주세요",
        variant: "destructive",
      })
      return
    }

    updateBudget(newBudget)
    toast({
      title: "완료",
      description: "예산이 업데이트되었습니다",
    })
  }

  return (
    <AppLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">설정</h1>
          <p className="mt-2 text-muted-foreground">예산 및 환경설정을 관리하세요</p>
        </div>

        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">권한 설정</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="admin-mode">관리자 모드</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  관리자 모드를 활성화하면 사용내역 수정/삭제 및 카드 관리가 가능합니다
                </p>
              </div>
              <Switch id="admin-mode" checked={role === "admin"} onCheckedChange={toggleRole} />
            </div>
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">
                현재 권한: <span className="font-semibold">{role === "admin" ? "관리자" : "일반 사용자"}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                실제 운영 환경에서는 사내 SSO 및 권한 API와 연동하여 권한을 관리해야 합니다.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">예산 설정</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budget">공통 예산</Label>
              <Input
                id="budget"
                type="number"
                step="1"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                placeholder="공통 예산 금액 입력"
              />
              <p className="text-sm text-muted-foreground">팀 공통으로 사용할 예산을 설정하세요</p>
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="text-sm font-medium text-foreground mb-3">예산 현황</h3>
              <div className="grid gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">공통 예산</span>
                  <span className="text-sm font-medium text-foreground">
                    {formatKRW(Number.parseFloat(budgetInput || "0"))}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">개인 예산 합계</span>
                  <span className="text-sm font-medium text-foreground">{formatKRW(personalBudgetTotal)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
                  <span className="text-sm font-semibold text-foreground">전체 예산</span>
                  <span className="text-sm font-bold text-foreground">
                    {formatKRW(Number.parseFloat(budgetInput || "0") + personalBudgetTotal)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="text-sm font-medium text-foreground mb-3">사용 현황</h3>
              <div className="grid gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">공통 사용액</span>
                  <span className="text-sm font-medium text-chart-1">{formatKRW(commonSpent)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">개인 사용액</span>
                  <span className="text-sm font-medium text-chart-1">{formatKRW(personalSpent)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
                  <span className="text-sm font-semibold text-foreground">전체 사용액</span>
                  <span className="text-sm font-bold text-chart-1">{formatKRW(totalSpent)}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="text-sm font-medium text-foreground mb-3">잔고 현황</h3>
              <div className="grid gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">공통 잔고</span>
                  <span className={`text-sm font-medium ${commonRemaining >= 0 ? "text-chart-2" : "text-destructive"}`}>
                    {formatKRW(commonRemaining)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
                  <span className="text-sm font-semibold text-foreground">전체 잔고</span>
                  <span className={`text-sm font-bold ${totalRemaining >= 0 ? "text-chart-2" : "text-destructive"}`}>
                    {formatKRW(totalRemaining)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                * 잔고는 예산에서 사용액을 뺀 금액으로 자동 계산됩니다
              </p>
            </div>

            <Button onClick={handleSave} className="w-full">
              저장
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-semibold text-foreground mb-2">사내 시스템 연동</h2>
          <p className="text-sm text-muted-foreground mb-4">사내 시스템과 연결하여 사용내역을 동기화하세요</p>
          <div className="space-y-3">
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-mono text-foreground">상태: 연결 안 됨</p>
              <p className="text-xs text-muted-foreground mt-1">
                실제 환경에서는 사내 시스템 API와 연동하여 데이터를 동기화합니다. 가져오기 페이지에서 스텁 기능을
                테스트할 수 있습니다.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
