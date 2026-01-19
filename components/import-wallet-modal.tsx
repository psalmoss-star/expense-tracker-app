"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Loader2, Calendar } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface ImportWalletModalProps {
  isOpen: boolean
  onClose: () => void
  walletType: string
  onProceedToReview: () => void
}

export function ImportWalletModal({ isOpen, onClose, walletType, onProceedToReview }: ImportWalletModalProps) {
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0])

  const getWalletInfo = () => {
    switch (walletType) {
      case "samsung":
        return {
          name: "Samsung Pay",
          description: "Samsung Pay에서 카드 사용내역을 가져옵니다",
          requirements: [
            "Samsung Knox API 액세스 필요",
            "OAuth 2.0 인증",
            "Samsung과의 파트너십 계약",
            "사용자의 거래 데이터 액세스 동의",
          ],
        }
      case "csv":
        return {
          name: "CSV 업로드",
          description: "CSV 형식의 카드 명세서를 업로드합니다",
          requirements: ["CSV 파일 컬럼: 날짜, 상호, 금액, 카드", "날짜 형식: YYYY-MM-DD", "금액은 숫자로 입력"],
        }
      case "bank":
        return {
          name: "은행 연동",
          description: "Plaid 또는 유사한 은행 연동 서비스를 통해 연결합니다",
          requirements: [
            "Plaid Link 통합 필요",
            "은행 계좌 인증 정보",
            "다중 인증 (MFA)",
            "토큰 처리를 위한 API 백엔드",
          ],
        }
      default:
        return { name: "알 수 없음", description: "", requirements: [] }
    }
  }

  const walletInfo = getWalletInfo()

  const handleConnect = () => {
    // TODO: Implement actual OAuth flow for Samsung Pay
    // TODO: Implement file upload handler for CSV
    // TODO: Implement Plaid Link integration for bank aggregator
    // This is a mock/stub implementation
    setConnectionStatus("connecting")
    setTimeout(() => {
      setConnectionStatus("connected")
    }, 1500)
  }

  const handleFetch = () => {
    // TODO: Implement actual API call to fetch transactions
    // TODO: Transform external transaction format to app schema
    // TODO: Handle pagination and rate limiting
    onProceedToReview()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{walletInfo.name} 연결</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{walletInfo.description}</p>

          {/* Connection Status */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">연결 상태</span>
              {connectionStatus === "disconnected" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  연결 안 됨
                </Badge>
              )}
              {connectionStatus === "connecting" && (
                <Badge className="flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  연결 중
                </Badge>
              )}
              {connectionStatus === "connected" && (
                <Badge className="flex items-center gap-1 bg-green-500">
                  <CheckCircle2 className="h-3 w-3" />
                  연결됨
                </Badge>
              )}
            </div>
            {connectionStatus === "disconnected" && (
              <Button onClick={handleConnect} className="w-full">
                연결
              </Button>
            )}
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">필요 사항 및 권한</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {walletInfo.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Date Range (only shown when connected) */}
          {connectionStatus === "connected" && (
            <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                기간 선택
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-xs">
                    시작일
                  </Label>
                  <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-xs">
                    종료일
                  </Label>
                  <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
              <Button onClick={handleFetch} className="w-full">
                사용내역 가져오기
              </Button>
            </div>
          )}

          {/* Technical Note */}
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              <strong>참고:</strong> 이것은 UI/UX 프로토타입입니다. 실제 구현에는 백엔드 통합, OAuth 플로우, API
              파트너십 및 안전한 인증 정보 처리가 필요합니다.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
