"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Wallet, CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react"
import { PiPaymentService, type PiPaymentResult, isPiBrowser } from "@/lib/pi-payment"

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
  const [isServiceReady, setIsServiceReady] = useState(false)
  const [userWallet, setUserWallet] = useState<string>("")
  const [isPiBrowserDetected, setIsPiBrowserDetected] = useState(false)

  useEffect(() => {
    // تحقق من Pi Browser
    setIsPiBrowserDetected(isPiBrowser())

    // تهيئة الخدمة عند تحميل المكون
    const initializeService = async () => {
      try {
        const piService = PiPaymentService.getInstance()
        await piService.initialize()
        setIsServiceReady(true)
        console.log("Pi Payment Service ready")
      } catch (error) {
        console.error("Failed to initialize Pi Payment Service:", error)
        setErrorMessage("فشل في تهيئة نظام الدفع")
      }
    }

    // الحصول على عنوان محفظة المستخدم من localStorage
    const getUserWallet = () => {
      try {
        const userData = localStorage.getItem("user")
        if (userData) {
          const user = JSON.parse(userData)
          if (user.piWallet) {
            setUserWallet(user.piWallet)
            console.log("User wallet found:", user.piWallet)
          } else {
            setErrorMessage("لم يتم العثور على عنوان محفظة Pi في ملفك الشخصي")
          }
        } else {
          setErrorMessage("يرجى تسجيل الدخول أولاً")
        }
      } catch (error) {
        console.error("Error getting user wallet:", error)
        setErrorMessage("خطأ في قراءة بيانات المستخدم")
      }
    }

    initializeService()
    getUserWallet()

    // معالج للعودة من Pi Browser
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
      setErrorMessage("تم إلغاء عملية التحويل")
    } else {
      setPaymentStatus("failed")
      setErrorMessage("فشل في عملية التحويل")
    }

    setIsLoading(false)
  }

  const handleDirectTransfer = async () => {
    if (!isServiceReady) {
      setErrorMessage("نظام الدفع غير جاهز، يرجى المحاولة مرة أخرى")
      return
    }

    if (!userWallet) {
      setErrorMessage("يرجى إضافة عنوان محفظة Pi في ملفك الشخصي أولاً")
      return
    }

    setIsLoading(true)
    setPaymentStatus("processing")
    setErrorMessage("")

    try {
      const piService = PiPaymentService.getInstance()

      console.log("Starting direct transfer process...")
      console.log("Transfer amount:", amount, "Pi")
      console.log("To wallet:", userWallet)
      console.log("Pi Browser detected:", isPiBrowserDetected)

      // المصادقة
      console.log("Authenticating user...")
      const auth = await piService.authenticateUser()

      if (!auth) {
        throw new Error("فشل في تسجيل الدخول إلى Pi Network")
      }

      console.log("Authentication successful, creating direct transfer...")

      // إنشاء عملية التحويل المباشر
      const result = await piService.createDirectTransfer(amount, userWallet, `دفع مقابل: ${productName}`, {
        productId,
        orderId,
        userId: auth.user?.uid,
        transferType: "direct_payment",
      })

      console.log("Transfer result:", result)

      if (result.status === "completed") {
        setPaymentStatus("success")
        onPaymentSuccess?.(result)
      } else if (result.status === "cancelled") {
        setPaymentStatus("idle")
        setErrorMessage("تم إلغاء عملية التحويل")
      } else if (result.status === "pending") {
        setPaymentStatus("processing")
        setErrorMessage("المعاملة قيد المعالجة في Pi Browser")
      } else {
        setPaymentStatus("failed")
        setErrorMessage("فشل في عملية التحويل")
      }
    } catch (error) {
      console.error("Transfer process error:", error)
      setPaymentStatus("failed")

      const errorMsg = error instanceof Error ? error.message : "حدث خطأ في عملية التحويل"
      setErrorMessage(errorMsg)
      onPaymentError?.(error instanceof Error ? error : new Error(errorMsg))
    } finally {
      if (!isPiBrowserDetected) {
        setIsLoading(false)
      }
      // في Pi Browser، سيتم إيقاف التحميل عند العودة من التطبيق
    }
  }

  const resetPayment = () => {
    setPaymentStatus("idle")
    setErrorMessage("")
    setIsLoading(false)
  }

  const getButtonContent = () => {
    if (!isServiceReady) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          جاري التحضير...
        </>
      )
    }

    if (!userWallet) {
      return (
        <>
          <AlertCircle className="h-4 w-4" />
          محفظة غير مربوطة
        </>
      )
    }

    if (isLoading) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {isPiBrowserDetected ? "جاري فتح Pi Browser..." : "جاري التحويل..."}
        </>
      )
    }

    if (paymentStatus === "success") {
      return (
        <>
          <CheckCircle className="h-4 w-4" />
          تم التحويل بنجاح
        </>
      )
    }

    if (paymentStatus === "failed") {
      return (
        <>
          <XCircle className="h-4 w-4" />
          حاول مرة أخرى
        </>
      )
    }

    return (
      <>
        <Wallet className="h-4 w-4" />
        {isPiBrowserDetected ? (
          <>
            تحويل {amount.toFixed(3)} Pi
            <ExternalLink className="h-3 w-3 ml-1" />
          </>
        ) : (
          `تحويل ${amount.toFixed(3)} Pi`
        )}
      </>
    )
  }

  const getButtonVariant = () => {
    if (!userWallet) return "secondary"
    if (paymentStatus === "success") return "default"
    if (paymentStatus === "failed") return "destructive"
    return "default"
  }

  const isButtonDisabled = disabled || !isServiceReady || !userWallet || paymentStatus === "success"

  return (
    <div className="space-y-2">
      <Button
        onClick={paymentStatus === "failed" ? resetPayment : handleDirectTransfer}
        disabled={isButtonDisabled}
        variant={getButtonVariant()}
        className={`w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold ${className}`}
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

      {paymentStatus === "processing" && userWallet && (
        <div className="text-center space-y-1">
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
            {isPiBrowserDetected ? "جاري المعالجة في Pi Browser" : "جاري التحويل إلى محفظتك"}
          </Badge>
          <div className="text-xs text-gray-500 break-all">
            إلى: {userWallet.substring(0, 8)}...{userWallet.substring(userWallet.length - 8)}
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="text-center">
          <Badge variant="outline" className="text-red-600 border-red-600">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errorMessage}
          </Badge>
        </div>
      )}

      {userWallet && paymentStatus === "idle" && (
        <div className="text-xs text-gray-500 text-center break-all">
          سيتم التحويل إلى: {userWallet.substring(0, 8)}...{userWallet.substring(userWallet.length - 8)}
        </div>
      )}

      {!userWallet && <div className="text-xs text-red-500 text-center">يرجى إضافة عنوان محفظة Pi في ملفك الشخصي</div>}

      <div className="text-xs text-gray-500 text-center">
        {isPiBrowserDetected
          ? "سيتم فتح Pi Browser لإكمال المعاملة"
          : typeof window !== "undefined" &&
              (window.location.hostname === "localhost" || window.location.hostname.includes("vercel"))
            ? "وضع التطوير - محاكاة Pi Network"
            : "التحويل آمن ومشفر عبر شبكة Pi Network"}
      </div>
    </div>
  )
}
