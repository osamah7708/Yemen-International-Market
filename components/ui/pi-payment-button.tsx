"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Wallet, CheckCircle, XCircle } from "lucide-react"
import { PiPaymentService, type PiPaymentResult } from "@/lib/pi-payment"
import { toast } from "sonner"

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

  const handlePayment = async () => {
    setIsLoading(true)
    setPaymentStatus("processing")

    try {
      const piService = PiPaymentService.getInstance()

      // Initialize Pi SDK
      const initialized = await piService.initialize()
      if (!initialized) {
        throw new Error("فشل في تهيئة نظام الدفع Pi Network")
      }

      // Authenticate user
      const auth = await piService.authenticateUser()
      if (!auth) {
        throw new Error("فشل في تسجيل الدخول إلى Pi Network")
      }

      toast.success("تم تسجيل الدخول بنجاح إلى Pi Network")

      // Create payment
      const result = await piService.createPayment(amount, `دفع مقابل: ${productName}`, {
        productId,
        orderId,
        userId: auth.user?.uid,
      })

      if (result.status === "completed") {
        setPaymentStatus("success")
        toast.success("تم الدفع بنجاح!")
        onPaymentSuccess?.(result)
      } else if (result.status === "cancelled") {
        setPaymentStatus("idle")
        toast.info("تم إلغاء عملية الدفع")
      } else {
        setPaymentStatus("failed")
        toast.error("فشل في عملية الدفع")
      }
    } catch (error) {
      setPaymentStatus("failed")
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ في عملية الدفع"
      toast.error(errorMessage)
      onPaymentError?.(error instanceof Error ? error : new Error(errorMessage))
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonContent = () => {
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
          فشل الدفع - حاول مرة أخرى
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

  return (
    <div className="space-y-2">
      <Button
        onClick={handlePayment}
        disabled={disabled || isLoading || paymentStatus === "success"}
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

      <div className="text-xs text-gray-500 text-center">الدفع آمن ومشفر عبر شبكة Pi Network</div>
    </div>
  )
}
