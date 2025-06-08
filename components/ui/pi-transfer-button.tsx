"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Send, CheckCircle, XCircle, AlertCircle, Copy, ExternalLink } from "lucide-react"
import type { PiTransferResult } from "@/lib/pi-transfer"
import { PI_WALLET_ADDRESS, isPiBrowser } from "@/lib/pi-payment"

interface PiTransferButtonProps {
  amount: number
  productName: string
  productId?: string
  orderId?: string
  onTransferSuccess?: (result: PiTransferResult) => void
  onTransferError?: (error: Error) => void
  className?: string
  disabled?: boolean
}

export function PiTransferButton({
  amount,
  productName,
  productId,
  orderId,
  onTransferSuccess,
  onTransferError,
  className,
  disabled = false,
}: PiTransferButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [transferStatus, setTransferStatus] = useState<"idle" | "processing" | "success" | "failed">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [showTransferForm, setShowTransferForm] = useState(false)
  const [customAddress, setCustomAddress] = useState("")
  const [useCustomAddress, setUseCustomAddress] = useState(false)
  const [isPiBrowserDetected, setIsPiBrowserDetected] = useState(false)

  useEffect(() => {
    // تحقق من Pi Browser
    setIsPiBrowserDetected(isPiBrowser())

    // معالج للعودة من محفظة Pi
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      const { type, data } = event.data
      if (type === "PI_TRANSFER_CALLBACK") {
        handleTransferCallback(data)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  const handleTransferCallback = (data: any) => {
    console.log("Transfer callback received:", data)

    if (data.status === "completed") {
      setTransferStatus("success")
      onTransferSuccess?.(data)
    } else if (data.status === "cancelled") {
      setTransferStatus("idle")
      setErrorMessage("تم إلغاء عملية التحويل")
    } else {
      setTransferStatus("failed")
      setErrorMessage("فشل في عملية التحويل")
    }

    setIsLoading(false)
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(PI_WALLET_ADDRESS)
    console.log("Address copied to clipboard")
  }

  const handleTransfer = async () => {
    setIsLoading(true)
    setTransferStatus("processing")
    setErrorMessage("")

    try {
      const recipientAddress = useCustomAddress ? customAddress : PI_WALLET_ADDRESS

      // التحقق من صحة العنوان
      if (useCustomAddress && (!customAddress || customAddress.length < 10)) {
        throw new Error("عنوان محفظة Pi غير صحيح")
      }

      console.log("Starting Pi transfer to wallet.pinet.com...")

      // إنشاء معرف فريد للتحويل
      const transferId = `transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // حفظ معلومات التحويل في localStorage للمرجع
      const transferData = {
        transferId,
        amount,
        recipientAddress,
        productName,
        productId,
        orderId,
        timestamp: new Date().toISOString(),
        status: "pending",
      }

      localStorage.setItem("pendingTransfer", JSON.stringify(transferData))

      // بناء URL للتوجه إلى محفظة Pi
      const walletUrl = new URL("https://wallet.pinet.com")

      // إضافة معلمات التحويل
      walletUrl.searchParams.set("action", "transfer")
      walletUrl.searchParams.set("amount", amount.toString())
      walletUrl.searchParams.set("currency", "PI")
      walletUrl.searchParams.set("to_address", recipientAddress)
      walletUrl.searchParams.set("memo", `تحويل مقابل: ${productName}`)
      walletUrl.searchParams.set("transfer_id", transferId)
      walletUrl.searchParams.set("merchant", "سوق اليمن الدولي")
      walletUrl.searchParams.set("return_url", `${window.location.origin}/payment-callback`)

      // إضافة معلومات إضافية
      if (productId) walletUrl.searchParams.set("product_id", productId)
      if (orderId) walletUrl.searchParams.set("order_id", orderId)

      console.log("Redirecting to Pi Wallet for transfer:", walletUrl.toString())

      // التوجه إلى محفظة Pi
      window.open(walletUrl.toString(), "_blank")

      // محاكاة انتظار النتيجة
      setTimeout(() => {
        if (transferStatus === "processing") {
          setIsLoading(false)
          setTransferStatus("idle")
          setErrorMessage("انتهت مهلة انتظار تأكيد التحويل. يرجى المحاولة مرة أخرى.")
        }
      }, 30000)
    } catch (error) {
      console.error("Transfer process error:", error)
      setTransferStatus("failed")
      setIsLoading(false)
      const errorMsg = error instanceof Error ? error.message : "حدث خطأ في عملية التحويل"
      setErrorMessage(errorMsg)
      onTransferError?.(error instanceof Error ? error : new Error(errorMsg))
    }
  }

  const resetTransfer = () => {
    setTransferStatus("idle")
    setErrorMessage("")
    setShowTransferForm(false)
    setCustomAddress("")
    setUseCustomAddress(false)
    setIsLoading(false)
  }

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center gap-2 min-h-[20px]">
          <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
          <span className="truncate">جاري فتح محفظة Pi...</span>
        </div>
      )
    }

    if (transferStatus === "success") {
      return (
        <div className="flex items-center justify-center gap-2 min-h-[20px]">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">تم التحويل بنجاح</span>
        </div>
      )
    }

    if (transferStatus === "failed") {
      return (
        <div className="flex items-center justify-center gap-2 min-h-[20px]">
          <XCircle className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">حاول مرة أخرى</span>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-center gap-2 min-h-[20px]">
        <Send className="h-4 w-4 flex-shrink-0" />
        <span className="truncate">تحويل مباشر {amount.toFixed(3)} Pi</span>
        <ExternalLink className="h-3 w-3 flex-shrink-0" />
      </div>
    )
  }

  if (showTransferForm) {
    return (
      <div className="w-full">
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Send className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">تحويل Pi مباشر</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <input
                  type="radio"
                  id="store-wallet"
                  name="wallet-option"
                  checked={!useCustomAddress}
                  onChange={() => setUseCustomAddress(false)}
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                />
                <label htmlFor="store-wallet" className="text-sm font-medium leading-tight">
                  تحويل إلى محفظة المتجر
                </label>
              </div>

              {!useCustomAddress && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">عنوان محفظة المتجر:</span>
                    <Button size="sm" variant="outline" onClick={copyAddress} className="h-8 w-8 p-0">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <code className="text-xs break-all text-gray-600 block">{PI_WALLET_ADDRESS}</code>
                </div>
              )}

              <div className="flex items-start gap-2">
                <input
                  type="radio"
                  id="custom-wallet"
                  name="wallet-option"
                  checked={useCustomAddress}
                  onChange={() => setUseCustomAddress(true)}
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                />
                <label htmlFor="custom-wallet" className="text-sm font-medium leading-tight">
                  تحويل إلى محفظة أخرى
                </label>
              </div>

              {useCustomAddress && (
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="أدخل عنوان محفظة Pi"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    className="font-mono text-sm w-full"
                  />
                  <p className="text-xs text-gray-500">تأكد من صحة العنوان قبل التحويل</p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-sm">المبلغ:</span>
                <span className="text-lg font-bold text-blue-600">{amount.toFixed(3)} Pi</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">المنتج:</span>
                <span className="text-sm truncate max-w-[60%]" title={productName}>
                  {productName}
                </span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <p className="text-yellow-800 text-sm text-center">🔒 سيتم فتح محفظة Pi الآمنة لإكمال التحويل</p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleTransfer}
                disabled={disabled || isLoading || (useCustomAddress && !customAddress)}
                className="flex-1 min-h-[44px]"
                size="default"
              >
                {getButtonContent()}
              </Button>
              <Button variant="outline" onClick={resetTransfer} className="min-h-[44px] px-4">
                إلغاء
              </Button>
            </div>

            {transferStatus === "processing" && (
              <div className="w-full text-center">
                <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs px-2 py-1">
                  <Loader2 className="h-3 w-3 animate-spin mr-1 flex-shrink-0" />
                  <span className="truncate">جاري المعالجة في محفظة Pi</span>
                </Badge>
              </div>
            )}

            {errorMessage && (
              <div className="w-full text-center">
                <Badge variant="outline" className="text-red-600 border-red-600 text-xs px-2 py-1 max-w-full">
                  <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{errorMessage}</span>
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full space-y-2">
      <Button
        onClick={transferStatus === "failed" ? resetTransfer : () => setShowTransferForm(true)}
        disabled={disabled || transferStatus === "success"}
        variant={transferStatus === "failed" ? "destructive" : "outline"}
        className={`w-full min-h-[44px] transition-all duration-200 ${className}`}
        size="default"
      >
        {getButtonContent()}
      </Button>

      <div className="text-xs text-gray-500 text-center px-2">سيتم فتح محفظة Pi الآمنة لإكمال المعاملة</div>
    </div>
  )
}
