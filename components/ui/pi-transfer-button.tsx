"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Send, CheckCircle, XCircle, AlertCircle, Copy, ExternalLink } from "lucide-react"
import { PiTransferService, type PiTransferResult } from "@/lib/pi-transfer"
import { PI_WALLET_ADDRESS, isPiBrowser, openPiBrowser } from "@/lib/pi-payment"

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

    // معالج للعودة من Pi Browser
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      const { type, data } = event.data
      if (type === "PI_PAYMENT_CALLBACK") {
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

  const transferService = PiTransferService.getInstance()

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
      if (useCustomAddress && !transferService.validatePiAddress(customAddress)) {
        throw new Error("عنوان محفظة Pi غير صحيح")
      }

      console.log("Starting Pi transfer...")
      console.log("Pi Browser detected:", isPiBrowserDetected)

      // إذا كنا في Pi Browser، استخدم الـ Deep Link مباشرة
      if (isPiBrowserDetected) {
        console.log("Using direct Pi Browser integration for transfer")

        // حفظ معلومات المعاملة في localStorage للاسترجاع لاحقاً
        const transferId = `transfer_${Date.now()}`
        localStorage.setItem(
          "pendingPiTransfer",
          JSON.stringify({
            transferId,
            amount,
            toWallet: recipientAddress,
            memo: `تحويل مقابل: ${productName}`,
            metadata: {
              productId,
              orderId,
            },
            timestamp: Date.now(),
          }),
        )

        // فتح Pi Browser مباشرة
        openPiBrowser("transfer", {
          amount: amount.toString(),
          to_address: recipientAddress,
          memo: `تحويل مقابل: ${productName}`,
          payment_id: transferId,
          metadata: JSON.stringify({
            productId,
            orderId,
          }),
        })

        // لا نغير الحالة هنا لأن المستخدم سيعود من Pi Browser
        return
      }

      const result = await transferService.createDirectTransfer(
        amount,
        recipientAddress,
        `تحويل مقابل: ${productName}`,
        {
          productId,
          orderId,
        },
      )

      if (result.status === "completed") {
        setTransferStatus("success")
        onTransferSuccess?.(result)
      } else {
        setTransferStatus("failed")
        setErrorMessage("فشل في عملية التحويل")
      }
    } catch (error) {
      console.error("Transfer process error:", error)
      setTransferStatus("failed")
      const errorMsg = error instanceof Error ? error.message : "حدث خطأ في عملية التحويل"
      setErrorMessage(errorMsg)
      onTransferError?.(error instanceof Error ? error : new Error(errorMsg))
    } finally {
      if (!isPiBrowserDetected) {
        setIsLoading(false)
      }
      // في Pi Browser، سيتم إيقاف التحميل عند العودة من التطبيق
    }
  }

  const resetTransfer = () => {
    setTransferStatus("idle")
    setErrorMessage("")
    setShowTransferForm(false)
    setCustomAddress("")
    setUseCustomAddress(false)
  }

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {isPiBrowserDetected ? "جاري فتح Pi Browser..." : "جاري التحويل..."}
        </>
      )
    }

    if (transferStatus === "success") {
      return (
        <>
          <CheckCircle className="h-4 w-4" />
          تم التحويل بنجاح
        </>
      )
    }

    if (transferStatus === "failed") {
      return (
        <>
          <XCircle className="h-4 w-4" />
          حاول مرة أخرى
        </>
      )
    }

    return (
      <>
        <Send className="h-4 w-4" />
        {isPiBrowserDetected ? (
          <>
            تحويل مباشر {amount.toFixed(3)} Pi
            <ExternalLink className="h-3 w-3 ml-1" />
          </>
        ) : (
          `تحويل مباشر ${amount.toFixed(3)} Pi`
        )}
      </>
    )
  }

  if (showTransferForm) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Send className="h-5 w-5" />
            تحويل Pi مباشر
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="store-wallet"
                name="wallet-option"
                checked={!useCustomAddress}
                onChange={() => setUseCustomAddress(false)}
                className="w-4 h-4"
              />
              <label htmlFor="store-wallet" className="text-sm font-medium">
                تحويل إلى محفظة المتجر
              </label>
            </div>

            {!useCustomAddress && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">عنوان محفظة المتجر:</span>
                  <Button size="sm" variant="outline" onClick={copyAddress}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <code className="text-xs break-all text-gray-600">{PI_WALLET_ADDRESS}</code>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="custom-wallet"
                name="wallet-option"
                checked={useCustomAddress}
                onChange={() => setUseCustomAddress(true)}
                className="w-4 h-4"
              />
              <label htmlFor="custom-wallet" className="text-sm font-medium">
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
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500">تأكد من صحة العنوان قبل التحويل</p>
              </div>
            )}
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">المبلغ:</span>
              <span className="text-lg font-bold text-blue-600">{amount.toFixed(3)} Pi</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-gray-600">المنتج:</span>
              <span className="text-sm">{productName}</span>
            </div>
          </div>

          {isPiBrowserDetected && (
            <div className="text-center">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Pi Browser متصل
              </Badge>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleTransfer}
              disabled={disabled || isLoading || (useCustomAddress && !customAddress)}
              className="flex-1"
            >
              {getButtonContent()}
            </Button>
            <Button variant="outline" onClick={resetTransfer}>
              إلغاء
            </Button>
          </div>

          {transferStatus === "processing" && (
            <Badge variant="outline" className="w-full justify-center text-blue-600 border-blue-600">
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              {isPiBrowserDetected ? "جاري المعالجة في Pi Browser" : "جاري معالجة التحويل..."}
            </Badge>
          )}

          {errorMessage && (
            <Badge variant="outline" className="w-full justify-center text-red-600 border-red-600">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errorMessage}
            </Badge>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={transferStatus === "failed" ? resetTransfer : () => setShowTransferForm(true)}
        disabled={disabled || transferStatus === "success"}
        variant={transferStatus === "failed" ? "destructive" : "outline"}
        className={`w-full ${className}`}
      >
        {getButtonContent()}
      </Button>

      {isPiBrowserDetected && (
        <div className="text-center">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Pi Browser متصل
          </Badge>
        </div>
      )}

      <div className="text-xs text-gray-500 text-center">
        {isPiBrowserDetected ? "سيتم فتح Pi Browser لإكمال المعاملة" : "تحويل مباشر إلى محفظة Pi Network"}
      </div>
    </div>
  )
}
