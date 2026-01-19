"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle } from "lucide-react"

interface ApiConfig {
  baseUrl: string
  apiKey: string
  headers?: Record<string, string>
  orgCode?: string
}

interface InternalApiConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (config: ApiConfig) => void
}

export function InternalApiConfigModal({ isOpen, onClose, onSave }: InternalApiConfigModalProps) {
  const { toast } = useToast()
  const [baseUrl, setBaseUrl] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [headerKey, setHeaderKey] = useState("")
  const [headerValue, setHeaderValue] = useState("")
  const [orgCode, setOrgCode] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!baseUrl || !apiKey) {
      toast({
        title: "오류",
        description: "Base URL과 API Key를 입력해주세요",
        variant: "destructive",
      })
      return
    }

    const config: ApiConfig = {
      baseUrl,
      apiKey,
      headers: headerKey && headerValue ? { [headerKey]: headerValue } : undefined,
      orgCode: orgCode || undefined,
    }

    // TODO: Save config securely on server-side, not in frontend
    console.log("[v0] API Config saved (should be handled server-side):", config)

    onSave(config)
    toast({
      title: "완료",
      description: "API 설정이 저장되었습니다",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>사내 시스템 API 설정</DialogTitle>
        </DialogHeader>

        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg mb-4">
          <div className="flex gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              실서비스에서는 API 키를 프론트엔드에 저장하지 말고 서버에서 안전하게 보관하세요
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="baseUrl">Base URL *</Label>
            <Input
              id="baseUrl"
              type="url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://intra.api.company.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key 또는 Token *</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="••••••••••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="headerKey">요청 헤더 키 (선택사항)</Label>
            <Input
              id="headerKey"
              value={headerKey}
              onChange={(e) => setHeaderKey(e.target.value)}
              placeholder="예: X-Custom-Header"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="headerValue">요청 헤더 값 (선택사항)</Label>
            <Input
              id="headerValue"
              value={headerValue}
              onChange={(e) => setHeaderValue(e.target.value)}
              placeholder="헤더 값"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="orgCode">조직/프로젝트 코드 (선택사항)</Label>
            <Input
              id="orgCode"
              value={orgCode}
              onChange={(e) => setOrgCode(e.target.value)}
              placeholder="예: DEPT-001"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              취소
            </Button>
            <Button type="submit" className="flex-1">
              저장
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
