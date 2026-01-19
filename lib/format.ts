export function formatKRW(amount: number): string {
  return `₩${Math.round(amount).toLocaleString("ko-KR")}`
}

export function formatKRWWithSuffix(amount: number): string {
  return `${Math.round(amount).toLocaleString("ko-KR")}원`
}
