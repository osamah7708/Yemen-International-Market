"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, ArrowLeft, Copy, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [paymentData, setPaymentData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const processCallback = async () => {
      try {
        // استخراج بيانات المعاملة من URL parameters
        const paymentId =
          searchParams.get("payment_id") ||
          searchParams.get("transfer_id") ||
          searchParams.get("transaction_id") ||
          searchParams.get("id")

        const status = searchParams.get("status") || "completed"
        const txid = searchParams.get("txid") || searchParams.get("transaction_hash") || searchParams.get("hash") || ""
        const amount = Number.parseFloat(searchParams.get("amount") || "0")
        const toWallet = searchParams.get("to_address") || searchParams.get("recipient") || ""
        const fromWallet = searchParams.get("from_address") || searchParams.get("sender") || ""

        // استرجاع المعاملة المعلقة من localStorage
        let pendingData = null
        try {
          const pendingPayment = localStorage.getItem("pendingPayment")
          const pendingTransfer = localStorage.getItem("pendingTransfer")

          if (pendingPayment) {
            pendingData = JSON.parse(pendingPayment)
            localStorage.removeItem("pendingPayment")
          } else if (pendingTransfer) {
            pendingData = JSON.parse(pendingTransfer)
            localStorage.removeItem("pendingTransfer")
          }
        } catch (e) {
          console.error("Error parsing pending data:", e)
        }

        if (paymentId || pendingData) {
          const data = {
            paymentId: paymentId || pendingData?.paymentId || pendingData?.transferId || `callback_${Date.now()}`,
            status,
            txid,
            amount: amount || pendingData?.amount || 0,
            toWallet: toWallet || pendingData?.recipientAddress || "",
            fromWallet: fromWallet || "",
            productName: pendingData?.productName || "منتج غير محدد",
            timestamp: new Date().toISOString(),
            source: "wallet.pinet.com",
          }

          setPaymentData(data)

          // حفظ المعاملة في localStorage
          const existingTransactions = JSON.parse(localStorage.getItem("userTransactions") || "[]")
          const existingIndex = existingTransactions.findIndex((t: any) => t.paymentId === data.paymentId)

          if (existingIndex >= 0) {
            existingTransactions[existingIndex] = { ...existingTransactions[existingIndex], ...data }
          } else {
            existingTransactions.push(data)
          }

          localStorage.setItem("userTransactions", JSON.stringify(existingTransactions))

          // إرسال رسالة للنافذة الأصلية إذا كانت موجودة
          if (window.opener) {
            window.opener.postMessage(
              {
                type: status.includes("transfer") ? "PI_TRANSFER_CALLBACK" : "PI_PAYMENT_CALLBACK",
                data,
              },
              window.location.origin,
            )
          }

          console.log("Payment/Transfer callback processed:", data)
        } else {
          console.error("No payment/transfer data found in callback")
          setPaymentData({
            paymentId: "unknown",
            status: "failed",
            txid: "",
            amount: 0,
            error: "لم يتم العثور على بيانات المعاملة",
          })
        }
      } catch (error) {
        console.error("Error processing payment callback:", error)
        setPaymentData({
          paymentId: "error",
          status: "failed",
          txid: "",
          amount: 0,
          error: "حدث خطأ في معالجة المعاملة",
        })
      } finally {
        setIsLoading(false)
      }
    }

    processCallback()
  }, [searchParams])

  const copyTransactionId = () => {
    if (paymentData?.txid) {
      navigator.clipboard.writeText(paymentData.txid)
    }
  }

  const openPiExplorer = () => {
    if (paymentData?.txid) {
      window.open(`https://pi.network/blockexplorer/tx/${paymentData.txid}`, "_blank")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-500" />
      case "failed":
      case "error":
        return <XCircle className="h-8 w-8 text-red-500" />
      case "pending":
        return <Clock className="h-8 w-8 text-yellow-500" />
      default:
        return <XCircle className="h-8 w-8 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
      case "success":
        return "تمت المعاملة بنجاح"
      case "failed":
      case "error":
        return "فشلت المعاملة"
      case "pending":
        return "المعاملة قيد المعالجة"
      case "cancelled":
        return "تم إلغاء المعاملة"
      default:
        return "حالة غير معروفة"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "success":
        return "bg-green-100 text-green-800 border-green-200"
      case "failed":
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center safe-area-padding" dir="rtl">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري معالجة نتيجة المعاملة من محفظة Pi...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 safe-area-padding" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {paymentData ? getStatusIcon(paymentData.status) : <XCircle className="h-8 w-8 text-gray-500" />}
          </div>
          <CardTitle className="text-2xl">
            {paymentData ? getStatusText(paymentData.status) : "خطأ في المعاملة"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {paymentData ? (
            <>
              <div className="text-center">
                <Badge className={`text-lg px-4 py-2 ${getStatusColor(paymentData.status)}`}>
                  {getStatusText(paymentData.status)}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">رقم المعاملة:</span>
                    <span className="text-sm font-mono">{paymentData.paymentId}</span>
                  </div>

                  {paymentData.txid && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">رقم التحويل:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">
                          {paymentData.txid.length > 16
                            ? `${paymentData.txid.substring(0, 8)}...${paymentData.txid.substring(paymentData.txid.length - 8)}`
                            : paymentData.txid}
                        </span>
                        <Button size="sm" variant="ghost" onClick={copyTransactionId}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {paymentData.amount > 0 && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">المبلغ:</span>
                      <span className="text-sm font-bold text-blue-600">{paymentData.amount.toFixed(3)} Pi</span>
                    </div>
                  )}

                  {paymentData.productName && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">المنتج:</span>
                      <span className="text-sm">{paymentData.productName}</span>
                    </div>
                  )}

                  {paymentData.toWallet && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">إلى المحفظة:</span>
                      <span className="text-sm font-mono">
                        {paymentData.toWallet.substring(0, 8)}...
                        {paymentData.toWallet.substring(paymentData.toWallet.length - 8)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">المصدر:</span>
                    <span className="text-sm text-purple-600 font-medium">محفظة Pi الآمنة</span>
                  </div>
                </div>

                {(paymentData.status === "completed" || paymentData.status === "success") && (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <p className="text-green-800 text-sm text-center">
                      ✅ تمت المعاملة بنجاح عبر محفظة Pi الآمنة! سيتم تحديث رصيدك خلال دقائق قليلة.
                    </p>
                  </div>
                )}

                {(paymentData.status === "failed" || paymentData.status === "error") && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-red-800 text-sm text-center">
                      ❌ فشلت المعاملة. {paymentData.error || "يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني."}
                    </p>
                  </div>
                )}

                {paymentData.status === "pending" && (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <p className="text-yellow-800 text-sm text-center">
                      ⏳ المعاملة قيد المعالجة في شبكة Pi. سيتم إشعارك عند اكتمالها.
                    </p>
                  </div>
                )}

                {paymentData.txid && (
                  <div className="text-center">
                    <Button size="sm" variant="outline" onClick={openPiExplorer} className="gap-2">
                      <ExternalLink className="h-3 w-3" />
                      عرض في Pi Explorer
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-4">لم يتم العثور على بيانات المعاملة</p>
            </div>
          )}

          <div className="flex gap-3">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                العودة للرئيسية
              </Button>
            </Link>
            <Link href="/transactions" className="flex-1">
              <Button className="w-full">عرض المعاملات</Button>
            </Link>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              تم التعامل مع هذه المعاملة عبر محفظة Pi الآمنة
              <br />
              إذا واجهت أي مشكلة، يرجى التواصل مع فريق الدعم الفني
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
