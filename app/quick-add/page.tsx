"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { AppLayout } from "@/components/app-layout"
import { useMockData } from "@/hooks/use-mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { formatKRW } from "@/lib/format"

export default function QuickAddPage() {
  const { addTransaction, transactions, people } = useMockData()
  const { toast } = useToast()

  const [merchant, setMerchant] = useState("")
  const [person, setPerson] = useState(people[0]?.name || "")
  const [type, setType] = useState<"common" | "personal">("common")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [card, setCard] = useState(people[0]?.defaultCard || "**** 4242")
  const [note, setNote] = useState("")

  const recentMerchants = Array.from(new Set(transactions.slice(0, 10).map((t) => t.merchant))).slice(0, 5)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!merchant || !amount) {
      toast({
        title: "오류",
        description: "상호와 금액을 입력해주세요",
        variant: "destructive",
      })
      return
    }

    addTransaction({
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

    setMerchant("")
    setAmount("")
    setNote("")
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">빠른 입력</h1>
          <p className="mt-2 text-muted-foreground">이동 중에도 빠르게 사용내역을 입력하세요</p>
        </div>

        <Card className="p-6 bg-card border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-lg">
                금액 *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="text-3xl h-16 text-center font-bold"
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="merchant">상호 *</Label>
              {recentMerchants.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {recentMerchants.map((m) => (
                    <Button
                      key={m}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setMerchant(m)}
                      className="text-xs"
                    >
                      {m}
                    </Button>
                  ))}
                </div>
              )}
              <Input
                id="merchant"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="예: 스타벅스"
                required
              />
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
                <Label htmlFor="date">사용일</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">메모 (선택사항)</Label>
              <Input id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="메모 입력..." />
            </div>

            <Button type="submit" size="lg" className="w-full h-14 text-lg">
              저장 후 다음 입력
            </Button>
          </form>
        </Card>

        {transactions.length > 0 && (
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">최근 내역</h3>
            <div className="space-y-2">
              {transactions.slice(0, 3).map((t) => (
                <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground text-sm">{t.merchant}</p>
                    <p className="text-xs text-muted-foreground">{t.person}</p>
                  </div>
                  <p className="font-semibold text-foreground">{formatKRW(t.amount)}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
