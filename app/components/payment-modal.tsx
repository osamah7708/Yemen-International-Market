"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ErrorLogger } from "../utils/error-logger"
import { PiPaymentService } from "../services/pi-payment-service"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  cart: any[]
  totalPrice: number
  user: any
  onPaymentSuccess: () => void
}

export function PaymentModal({ isOpen, onClose, cart, totalPrice, user, onPaymentSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("pi")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [errorDetails, setErrorDetails] = useState<string>("")
  const [piPaymentData, setPiPaymentData] = useState({
    amount: totalPrice,
    memo: `طلب من سوق اليمن الدولي - ${cart.length} منتج`,
    metadata: {
      orderId: `ORDER_${Date.now()}`,
      userId: user?.id,
      items: cart.map((item) => ({ id: item.id, name: item.name, quantity: item.quantity })),
    },
  })
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      // تحديث بيانات الدفع عند فتح المودال
      setPiPaymentData({
        amount: totalPrice,
        memo: `طلب من سوق اليمن الدولي - ${cart.length} منتج`,
        metadata: {
          orderId: `ORDER_${Date.now()}`,
          userId: user?.id,
          items: cart.map((item) => ({ id: item.id, name: item.name, quantity: item.quantity })),
        },
      })
      setPaymentStatus("idle")
      setErrorDetails("")
    }
  }, [isOpen, totalPrice, cart, user])

  const handlePiPayment = async () => {
    setIsProcessing(true)
    setPaymentStatus("processing")

    try {
      ErrorLogger.logInfo("Starting Pi payment process", {
        orderId: piPaymentData.metadata.orderId,
        amount: piPaymentData.amount,
        userId: user?.id,
      })

      // التحقق من توفر Pi SDK
      if (!window.Pi) {
        throw new Error("Pi SDK غير متوفر. يرجى التأكد من تثبيت تطبيق Pi Network")
      }

      // بدء عملية الدفع
      const paymentResult = await PiPaymentService.createPayment(piPaymentData)

      if (paymentResult.success) {
        setPaymentStatus("success")

        ErrorLogger.logInfo("Pi payment completed successfully", {
          orderId: piPaymentData.metadata.orderId,
          transactionId: paymentResult.transactionId,
          amount: piPaymentData.amount,
        })

        toast({
          title: "تم الدفع بنجاح",
          description: "تم تأكيد دفعتك عبر Pi Network",
        })

        setTimeout(() => {
          onPaymentSuccess()
        }, 2000)
      } else {
        throw new Error(paymentResult.error || "فشل في معالجة الدفع")
      }
    } catch (error) {
      setPaymentStatus("error")
      const errorMessage = error.message || "حدث خطأ غير متوقع أثناء الدفع"
      setErrorDetails(errorMessage)

      ErrorLogger.logError("Pi payment failed", error, {
        orderId: piPaymentData.metadata.orderId,
        amount: piPaymentData.amount,
        userId: user?.id,
        errorType: error.name || "PaymentError",
      })

      toast({
        title: "فشل في الدفع",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePayNetworkPayment = async () => {
    setIsProcessing(true)
    setPaymentStatus("processing")

    try {
      ErrorLogger.logInfo("Starting PayNetwork payment process", {
        orderId: piPaymentData.metadata.orderId,
        amount: totalPrice,
        userId: user?.id,
      })

      // محاكاة عملية الدفع عبر PayNetwork
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // محاكاة نجاح الدفع (في التطبيق الحقيقي، ستتم معالجة الدفع الفعلي)
      const success = Math.random() > 0.2 // 80% نسبة نجاح

      if (success) {
        setPaymentStatus("success")

        ErrorLogger.logInfo("PayNetwork payment completed successfully", {
          orderId: piPaymentData.metadata.orderId,
          amount: totalPrice,
        })

        toast({
          title: "تم الدفع بنجاح",
          description: "تم تأكيد دفعتك عبر PayNetwork",
        })

        setTimeout(() => {
          onPaymentSuccess()
        }, 2000)
      } else {
        throw new Error("فشل في معالجة الدفع عبر PayNetwork")
      }
    } catch (error) {
      setPaymentStatus("error")
      const errorMessage = error.message || "حدث خطأ أثناء الدفع عبر PayNetwork"
      setErrorDetails(errorMessage)

      ErrorLogger.logError("PayNetwork payment failed", error, {
        orderId: piPaymentData.metadata.orderId,
        amount: totalPrice,
        userId: user?.id,
      })

      toast({
        title: "فشل في الدفع",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const renderPaymentStatus = () => {
    switch (paymentStatus) {
      case "processing":
        return (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-500" />
            <h3 className="text-lg font-medium mb-2">جاري معالجة الدفع...</h3>
            <p className="text-gray-600">يرجى عدم إغلاق هذه النافذة</p>
          </div>
        )
      case "success":
        return (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-medium mb-2 text-green-600">تم الدفع بنجاح!</h3>
            <p className="text-gray-600">سيتم تأكيد طلبك قريباً</p>
          </div>
        )
      case "error":
        return (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-medium mb-2 text-red-600">فشل في الدفع</h3>
            <p className="text-gray-600 mb-4">{errorDetails}</p>
            <Button onClick={() => setPaymentStatus("idle")} variant="outline">
              المحاولة مرة أخرى
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle>إتمام الدفع</DialogTitle>
        </DialogHeader>

        {paymentStatus !== "idle" ? (
          renderPaymentStatus()
        ) : (
          <div className="space-y-6">
            {/* ملخص الطلب */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-sm">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">{(item.price * item.quantity).toLocaleString()} ر.ي</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between items-center font-bold">
                  <span>المجموع:</span>
                  <span className="text-green-600">{totalPrice.toLocaleString()} ر.ي</span>
                </div>
              </CardContent>
            </Card>

            {/* طرق الدفع */}
            <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pi" className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  Pi Network
                </TabsTrigger>
                <TabsTrigger value="paynetwork" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  PayNetwork
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pi" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
                      الدفع بعملة Pi
                    </CardTitle>
                    <CardDescription>ادفع باستخدام عملة Pi الرقمية من محفظتك</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                        <span className="font-medium">المبلغ المطلوب:</span>
                      </div>
                      <p className="text-2xl font-bold text-yellow-600">{(totalPrice / 1000).toFixed(2)} π</p>
                      <p className="text-sm text-gray-600 mt-1">(سعر الصرف: 1 π = 1000 ر.ي)</p>
                    </div>
                    <Button
                      onClick={handlePiPayment}
                      className="w-full bg-yellow-500 hover:bg-yellow-600"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          جاري المعالجة...
                        </>
                      ) : (
                        "ادفع بعملة Pi"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="paynetwork" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      PayNetwork
                    </CardTitle>
                    <CardDescription>الدفع عبر شبكة PayNetwork المحلية</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input id="phone" placeholder="777123456" defaultValue={user?.phone?.replace("+967", "") || ""} />
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">سيتم إرسال رسالة تأكيد إلى رقم هاتفك لإتمام عملية الدفع</p>
                    </div>
                    <Button onClick={handlePayNetworkPayment} className="w-full" disabled={isProcessing}>
                      {isProcessing ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          جاري المعالجة...
                        </>
                      ) : (
                        `ادفع ${totalPrice.toLocaleString()} ر.ي`
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
