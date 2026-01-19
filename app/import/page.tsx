"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppLayout } from "@/components/app-layout"
import { Badge } from "@/components/ui/badge"
import { Smartphone, FileText, Wallet, Download, SettingsIcon, AlertCircle } from "lucide-react"
import { ImportWalletModal } from "@/components/import-wallet-modal"
import { ImportReviewModal } from "@/components/import-review-modal"
import { InternalApiConfigModal } from "@/components/internal-api-config-modal"
import { InternalApiImportModal } from "@/components/internal-api-import-modal"

export default function ImportPage() {
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<string>("")
  const [apiConfigOpen, setApiConfigOpen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const handleConnectWallet = (wallet: string) => {
    setSelectedWallet(wallet)
    setWalletModalOpen(true)
  }

  return (
    <AppLayout>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">가져오기</h1>
          <p className="mt-2 text-muted-foreground">사내 시스템에서 사용내역을 가져오세요</p>
        </div>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <SettingsIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">사내 시스템 연동</h3>
                <p className="text-sm text-muted-foreground mt-1">내부 API를 통해 사용내역을 자동으로 불러옵니다</p>
              </div>
            </div>
            <Badge variant={isConnected ? "default" : "secondary"}>{isConnected ? "연결됨" : "연결 안 됨"}</Badge>
          </div>

          <div className="space-y-3">
            <Button variant="outline" className="w-full bg-transparent" onClick={() => setApiConfigOpen(true)}>
              <SettingsIcon className="h-4 w-4 mr-2" />
              API 설정
            </Button>

            {isConnected && (
              <Button className="w-full" onClick={() => setImportModalOpen(true)}>
                <Download className="h-4 w-4 mr-2" />
                사용내역 불러오기
              </Button>
            )}
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">Samsung Pay</h3>
                <p className="text-sm text-muted-foreground mt-1">Import card transactions from Samsung Pay</p>
              </div>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => handleConnectWallet("samsung")}
              >
                Connect
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-lg bg-chart-1/10">
                  <FileText className="h-6 w-6 text-chart-1" />
                </div>
                <Badge>Available</Badge>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">CSV Upload</h3>
                <p className="text-sm text-muted-foreground mt-1">Upload card statements in CSV format</p>
              </div>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => handleConnectWallet("csv")}>
                Upload File
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-lg bg-chart-2/10">
                  <Wallet className="h-6 w-6 text-chart-2" />
                </div>
                <Badge variant="secondary">Placeholder</Badge>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">Bank Aggregator</h3>
                <p className="text-sm text-muted-foreground mt-1">Connect via Plaid or similar services</p>
              </div>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => handleConnectWallet("bank")}>
                Connect
              </Button>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">가져오기 방법</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                1
              </div>
              <div>
                <h4 className="font-medium text-foreground">API 연결 설정</h4>
                <p className="text-sm text-muted-foreground mt-1">사내 시스템의 Base URL과 인증 정보를 입력하세요</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                2
              </div>
              <div>
                <h4 className="font-medium text-foreground">기간 선택 및 불러오기</h4>
                <p className="text-sm text-muted-foreground mt-1">날짜 범위를 지정하여 사용내역을 불러옵니다</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                3
              </div>
              <div>
                <h4 className="font-medium text-foreground">검토 및 등록</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  불러온 내역을 검토하고 사용자와 구분을 지정한 후 등록하세요
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-muted/50 border-border">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            보안 안내
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">API 키 보안:</strong> 실제 서비스에서는 API 키와 토큰을 프론트엔드에
              저장하지 말고 서버에서 안전하게 관리하세요.
            </p>
            <p>
              <strong className="text-foreground">데이터 암호화:</strong> 모든 API 통신은 HTTPS를 사용하여 암호화되어야
              합니다.
            </p>
            <p>
              <strong className="text-foreground">권한 관리:</strong> 사용자별로 적절한 권한을 부여하여 민감한 데이터
              접근을 제한하세요.
            </p>
          </div>
        </Card>
      </div>

      <ImportWalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        walletType={selectedWallet}
        onProceedToReview={() => {
          setWalletModalOpen(false)
          setReviewModalOpen(true)
        }}
      />

      <ImportReviewModal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} />

      <InternalApiConfigModal
        isOpen={apiConfigOpen}
        onClose={() => setApiConfigOpen(false)}
        onSave={(config) => {
          setIsConnected(true)
          setApiConfigOpen(false)
        }}
      />

      <InternalApiImportModal isOpen={importModalOpen} onClose={() => setImportModalOpen(false)} />
    </AppLayout>
  )
}
