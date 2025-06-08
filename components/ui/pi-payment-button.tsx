"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Wallet, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { PiPaymentService, type PiPaymentResult } from "@/lib/pi-payment"

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
  className = "",
  disabled = false,
}: PiPaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isServiceReady, setIsServiceReady] = useState(false)

  useEffect(() => {
    let mounted = true

    const initializeService = async () => {
      try {
        const piService = PiPaymentService.getInstance()
        await piService.initialize()
        if (mounted) {
          setIsServiceReady(true)
          console.log("Pi Payment Service ready")
        }
      } catch (error) {
        console.error("Failed to initialize Pi Payment Service:", error)
        if (mounted) {
          setErrorMessage("فشل في تهيئة نظام الدفع")
        }
      }
    }

    initializeService()

    return () => {
      mounted = false
    }
  }, [])

  const handlePayment = async () => {
    if (!isServiceReady) {
      setErrorMessage("نظام الدفع غير جاهز، يرجى المحاولة مرة أخرى")
      return
    }

    setIsLoading(true)
    setPaymentStatus("processing")
    setErrorMessage("")

    try {
      const piService = PiPaymentService.getInstance()

      console.log("Starting payment process...")

      const auth = await piService.authenticateUser()

      if (!auth) {
        throw new Error("فشل في تسجيل الدخول إلى Pi Network")
      }

      console.log("Authentication successful, creating payment...")

      const result = await piService.createPayment(amount, `دفع مقابل: ${productName}`, {
        productId,
        orderId,
        userId: auth.user?.uid,
      })

      console.log("Payment result:", result)

      if (result.status === "completed") {
        setPaymentStatus("success")
        onPaymentSuccess?.(result)
      } else if (result.status === "cancelled") {
        setPaymentStatus("idle")
        setErrorMessage("تم إلغاء عملية الدفع")
      } else {
        setPaymentStatus("failed")
        setErrorMessage("فشل في عملية الدفع")
      }
    } catch (error) {
      console.error("Payment process error:", error)
      setPaymentStatus("failed")

      const errorMsg = error instanceof Error ? error.message : "حدث خطأ في عملية الدفع"
      setErrorMessage(errorMsg)
      onPaymentError?.(error instanceof Error ? error : new Error(errorMsg))
    } finally {
      setIsLoading(false)
    }
  }

  const resetPayment = () => {
    setPaymentStatus("idle")
    setErrorMessage("")
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

    if (isLoading) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          جاري المعالجة...
        </>
      )
    }

    if (paymentStatus === "success") {
      return (
        <>
          <CheckCircle className="h-4 w-4" />
          تم الدفع بنجاح
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
        ادفع {amount.toFixed(3)} Pi
      </>
    )
  }

  const getButtonVariant = () => {
    if (paymentStatus === "success") return "default"
    if (paymentStatus === "failed") return "destructive"
    return "default"
  }

  const isButtonDisabled = disabled || !isServiceReady || isLoading || paymentStatus === "success"

  return (
    <div className="space-y-2">
      <Button
        onClick={paymentStatus === "failed" ? resetPayment : handlePayment}
        disabled={isButtonDisabled}
        variant={getButtonVariant()}
        className={`w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold ${className}`}
      >
        {getButtonContent()}
      </Button>

      {paymentStatus === "processing" && (
        <div className="text-center">
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
            يرجى إكمال الدفع في تطبيق Pi Network
          </Badge>
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

      <div className="text-xs text-gray-500 text-center">
        {typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
          window.location.hostname.includes("vercel") ||
          window.location.hostname.includes("netlify"))
          ? "وضع التطوير - محاكاة Pi Network"
          : "الدفع آمن ومشفر عبر شبكة Pi Network"}
      </div>
    </div>
  )
}
