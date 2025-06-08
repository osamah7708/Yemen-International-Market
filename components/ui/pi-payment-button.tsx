"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Wallet, CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react"
import { type PiPaymentResult, isPiBrowser } from "@/lib/pi-payment"

interface PiPaymentButtonProps {
  amount: number
  productName: string
  productId?: string
  orderId?: string
  onPaymentSuccess?: (result: PiPaymentResult) => void
  onPaymentError?: (error: Error) => void
  className?: string
  disabled?: boolean
}

export function PiPaymentButton({
  amount,
  productName,
  productId,
  orderId,
  onPaymentSuccess,
  onPaymentError,
  className,
  disabled = false,
}: PiPaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [user, setUser] = useState<any>(null)
  const [isPiBrowserDetected, setIsPiBrowserDetected] = useState(false)

  useEffect(() => {
    // تحقق من Pi Browser
    setIsPiBrowserDetected(isPiBrowser())

    // الحصول على بيانات المستخدم من localStorage
    const getUserData = () => {
      try {
        const userData = localStorage.getItem("user")
        if (userData) {
          const user = JSON.parse(userData)
          setUser(user)
        } else {
          setErrorMessage("يرجى تسجيل الدخول أولاً")
        }
      } catch (error) {
        console.error("Error getting user data:", error)
        setErrorMessage("خطأ في قراءة بيانات المستخدم")
      }
    }

    getUserData()

    // معالج للعودة من محفظة Pi
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      const { type, data } = event.data
      if (type === "PI_PAYMENT_CALLBACK") {
        handlePaymentCallback(data)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  const handlePaymentCallback = (data: any) => {
    console.log("Payment callback received in button:", data)

    if (data.status === "completed") {
      setPaymentStatus("success")
      onPaymentSuccess?.(data)
    } else if (data.status === "cancelled") {
      setPaymentStatus("idle")
      setErrorMessage("تم إلغاء عملية الدفع")
    } else {
      setPaymentStatus("failed")
      setErrorMessage("فشل في عملية الدفع")
    }

    setIsLoading(false)
  }

  const handleDirectPayment = async () => {
    if (!user) {
      setErrorMessage("يرجى تسجيل الدخول أولاً")
      return
    }

    setIsLoading(true)
    setPaymentStatus("processing")
    setErrorMessage("")

    try {
      console.log("Starting direct payment process...")
      console.log("Payment amount:", amount, "Pi")
      console.log("Product:", productName)

      // إنشاء معرف فريد للمعاملة
      const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // حفظ معلومات المعاملة في localStorage للمرجع
      const paymentData = {
        paymentId,
        amount,
        productName,
        productId,
        orderId,
        userId: user.id,
        userWallet: user.piWallet,
        timestamp: new Date().toISOString(),
        status: "pending",
      }

      localStorage.setItem("pendingPayment", JSON.stringify(paymentData))

      // بناء URL للتوجه إلى محفظة Pi
      const walletUrl = new URL("https://wallet.pinet.com")

      // إضافة معلمات الدفع
      walletUrl.searchParams.set("action", "payment")
      walletUrl.searchParams.set("amount", amount.toString())
      walletUrl.searchParams.set("currency", "PI")
      walletUrl.searchParams.set("memo", `دفع مقابل: ${productName}`)
      walletUrl.searchParams.set("payment_id", paymentId)
      walletUrl.searchParams.set("merchant", "سوق اليمن الدولي")
      walletUrl.searchParams.set("return_url", `${window.location.origin}/payment-callback`)

      // إضافة معلومات إضافية
      if (productId) walletUrl.searchParams.set("product_id", productId)
      if (orderId) walletUrl.searchParams.set("order_id", orderId)
      if (user.piWallet) walletUrl.searchParams.set("recipient", user.piWallet)

      console.log("Redirecting to Pi Wallet:", walletUrl.toString())

      // التوجه إلى محفظة Pi
      window.open(walletUrl.toString(), "_blank")

      // محاكاة انتظار النتيجة (في التطبيق الحقيقي سيتم استقبال callback)
      setTimeout(() => {
        // في حالة عدم استقبال callback خلال 30 ثانية، إعادة تعيين الحالة
        if (paymentStatus === "processing") {
          setIsLoading(false)
          setPaymentStatus("idle")
          setErrorMessage("انتهت مهلة انتظار تأكيد الدفع. يرجى المحاولة مرة أخرى.")
        }
      }, 30000)
    } catch (error) {
      console.error("Payment process error:", error)
      setPaymentStatus("failed")
      setIsLoading(false)

      const errorMsg = error instanceof Error ? error.message : "حدث خطأ في عملية الدفع"
      setErrorMessage(errorMsg)
      onPaymentError?.(error instanceof Error ? error : new Error(errorMsg))
    }
  }

  const resetPayment = () => {
    setPaymentStatus("idle")
    setErrorMessage("")
    setIsLoading(false)
  }

  const getButtonContent = () => {
    if (!user) {
      return (
        <div className="flex items-center justify-center gap-2 min-h-[20px]">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">يرجى تسجيل الدخول</span>
        </div>
      )
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center gap-2 min-h-[20px]">
          <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
          <span className="truncate">جاري فتح محفظة Pi...</span>
        </div>
      )
    }

    if (paymentStatus === "success") {
      return (
        <div className="flex items-center justify-center gap-2 min-h-[20px]">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">تم الدفع بنجاح</span>
        </div>
      )
    }

    if (paymentStatus === "failed") {
      return (
        <div className="flex items-center justify-center gap-2 min-h-[20px]">
          <XCircle className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">حاول مرة أخرى</span>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-center gap-2 min-h-[20px]">
        <Wallet className="h-4 w-4 flex-shrink-0" />
        <span className="truncate">دفع {amount.toFixed(3)} Pi</span>
        <ExternalLink className="h-3 w-3 flex-shrink-0" />
      </div>
    )
  }

  const getButtonVariant = () => {
    if (!user) return "secondary"
    if (paymentStatus === "success") return "default"
    if (paymentStatus === "failed") return "destructive"
    return "default"
  }

  const isButtonDisabled = disabled || !user || paymentStatus === "success"

  return (
    <div className="w-full space-y-2">
      <Button
        onClick={paymentStatus === "failed" ? resetPayment : handleDirectPayment}
        disabled={isButtonDisabled}
        variant={getButtonVariant()}
        className={`w-full min-h-[44px] bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold transition-all duration-200 ${className}`}
        size="default"
      >
        {getButtonContent()}
      </Button>

      {paymentStatus === "processing" && (
        <div className="w-full text-center">
          <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs px-2 py-1">
            <Loader2 className="h-3 w-3 animate-spin mr-1 flex-shrink-0" />
            <span className="truncate">جاري المعالجة في محفظة Pi</span>
          </Badge>
          <div className="text-xs text-gray-500 mt-1 px-2">سيتم فتح محفظة Pi في نافذة جديدة لإكمال الدفع</div>
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

      {user && paymentStatus === "idle" && (
        <div className="text-xs text-gray-500 text-center px-2">سيتم فتح محفظة Pi لإكمال عملية الدفع بشكل آمن</div>
      )}

      {!user && <div className="text-xs text-red-500 text-center px-2">يرجى تسجيل الدخول لإكمال عملية الدفع</div>}
    </div>
  )
}
