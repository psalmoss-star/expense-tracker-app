"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppLayout } from "@/components/app-layout"
import { useMockData } from "@/hooks/use-mock-data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { AddPersonModal } from "@/components/add-person-modal"
import { formatKRW } from "@/lib/format"

export default function PeoplePage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingPerson, setEditingPerson] = useState<string | null>(null)
  const { transactions, people, updatePerson, deletePerson } = useMockData()

  const personSpending = transactions.reduce(
    (acc, t) => {
      if (!acc[t.person]) {
        acc[t.person] = { total: 0, count: 0 }
      }
      acc[t.person].total += t.amount
      acc[t.person].count += 1
      return acc
    },
    {} as Record<string, { total: number; count: number }>,
  )

  const handleEdit = (personId: string) => {
    setEditingPerson(personId)
    setIsAddModalOpen(true)
  }

  const handleDelete = (personId: string) => {
    if (confirm("정말 이 사람을 삭제하시겠습니까?")) {
      deletePerson(personId)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">사람 관리</h1>
            <p className="mt-2 text-muted-foreground">팀원과 예산을 관리하세요</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            추가
          </Button>
        </div>

        <Card className="bg-card border-border hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">이름</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">팀</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">활성</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">기본 카드</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">예산</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">사용액</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">메모</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-foreground">작업</th>
                </tr>
              </thead>
              <tbody>
                {people.map((person) => {
                  const stats = personSpending[person.name] || { total: 0, count: 0 }
                  return (
                    <tr key={person.id} className="border-b border-border hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {person.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">{person.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{person.team || "-"}</td>
                      <td className="px-4 py-3">
                        <Switch
                          checked={person.active}
                          onCheckedChange={(checked) => updatePerson(person.id, { active: checked })}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{person.defaultCard || "-"}</td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        {person.monthlyBudget ? formatKRW(person.monthlyBudget) : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-chart-1">{formatKRW(stats.total)}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{person.notes || "-"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(person.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(person.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid gap-4 md:hidden">
          {people.map((person) => {
            const stats = personSpending[person.name] || { total: 0, count: 0 }
            return (
              <Card key={person.id} className="p-4 bg-card border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {person.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{person.name}</h3>
                      {person.team && <p className="text-sm text-muted-foreground">{person.team}</p>}
                    </div>
                  </div>
                  <Badge variant={person.active ? "default" : "secondary"}>{person.active ? "활성" : "비활성"}</Badge>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">예산:</span>
                    <span className="font-medium text-foreground">
                      {person.monthlyBudget ? formatKRW(person.monthlyBudget) : "미설정"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">사용액:</span>
                    <span className="font-medium text-chart-1">{formatKRW(stats.total)}</span>
                  </div>
                  {person.defaultCard && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">기본 카드:</span>
                      <span className="font-medium text-foreground">{person.defaultCard}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleEdit(person.id)}
                  >
                    <Edit className="h-3 w-3 mr-2" />
                    수정
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(person.id)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      <AddPersonModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingPerson(null)
        }}
        editingPersonId={editingPerson}
      />
    </AppLayout>
  )
}
