interface PiPaymentData {
  amount: number
  memo: string
  metadata: {
    orderId: string
    userId?: number
    items: Array<{ id: number; name: string; quantity: number }>
  }
}

interface PiPaymentResult {
  success: boolean
  transactionId?: string
  error?: string
}

declare global {
  interface Window {
    Pi?: {
      authenticate: () => Promise<{ accessToken: string; user: any }>
      createPayment: (paymentData: any, callbacks: any) => void
      openShareDialog: (title: string, message: string) => void
    }
  }
}

class PiPaymentServiceClass {
  private isInitialized = false
  private authToken: string | null = null

  async initialize(): Promise<boolean> {
    try {
      // التحقق من توفر Pi SDK
      if (typeof window === "undefined" || !window.Pi) {
        throw new Error("Pi SDK غير متوفر")
      }

      // محاولة المصادقة
      const authResult = await window.Pi.authenticate()
      this.authToken = authResult.accessToken
      this.isInitialized = true

      return true
    } catch (error) {
      console.error("فشل في تهيئة Pi SDK:", error)
      return false
    }
  }

  async createPayment(paymentData: PiPaymentData): Promise<PiPaymentResult> {
    return new Promise(async (resolve) => {
      try {
        // التأكد من التهيئة
        if (!this.isInitialized) {
          const initialized = await this.initialize()
          if (!initialized) {
            resolve({
              success: false,
              error: "فشل في تهيئة Pi SDK",
            })
            return
          }
        }

        // إعداد بيانات الدفع
        const piPaymentData = {
          amount: paymentData.amount / 1000, // تحويل من ريال يمني إلى Pi
          memo: paymentData.memo,
          metadata: paymentData.metadata,
        }

        // إنشاء الدفع
        window.Pi!.createPayment(piPaymentData, {
          onReadyForServerApproval: (paymentId: string) => {
            console.log("Payment ready for server approval:", paymentId)
            // في التطبيق الحقيقي، سيتم إرسال معرف الدفع إلى الخادم للموافقة
            this.approvePaymentOnServer(paymentId, paymentData)
              .then(() => {
                resolve({
                  success: true,
                  transactionId: paymentId,
                })
              })
              .catch((error) => {
                resolve({
                  success: false,
                  error: `فشل في الموافقة على الدفع: ${error.message}`,
                })
              })
          },
          onReadyForServerCompletion: (paymentId: string, txid: string) => {
            console.log("Payment ready for server completion:", paymentId, txid)
            // إكمال الدفع على الخادم
            this.completePaymentOnServer(paymentId, txid)
          },
          onCancel: (paymentId: string) => {
            console.log("Payment cancelled:", paymentId)
            resolve({
              success: false,
              error: "تم إلغاء عملية الدفع",
            })
          },
          onError: (error: any, payment?: any) => {
            console.error("Payment error:", error, payment)
            resolve({
              success: false,
              error: `خطأ في الدفع: ${error.message || "خطأ غير معروف"}`,
            })
          },
        })
      } catch (error) {
        console.error("خطأ في إنشاء الدفع:", error)
        resolve({
          success: false,
          error: `فشل في إنشاء الدفع: ${error.message || "خطأ غير معروف"}`,
        })
      }
    })
  }

  private async approvePaymentOnServer(paymentId: string, paymentData: PiPaymentData): Promise<void> {
    try {
      // في التطبيق الحقيقي، سيتم إرسال طلب إلى الخادم للموافقة على الدفع
      const response = await fetch("/api/payments/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.authToken}`,
        },
        body: JSON.stringify({
          paymentId,
          paymentData,
        }),
      })

      if (!response.ok) {
        throw new Error("فشل في الموافقة على الدفع من الخادم")
      }

      console.log("تم الموافقة على الدفع من الخادم")
    } catch (error) {
      console.error("خطأ في الموافقة على الدفع:", error)
      // في هذا المثال، سنتجاهل الخطأ ونتابع
      // في التطبيق الحقيقي، يجب معالجة هذا الخطأ بشكل صحيح
    }
  }

  private async completePaymentOnServer(paymentId: string, txid: string): Promise<void> {
    try {
      // في التطبيق الحقيقي، سيتم إرسال طلب إلى الخادم لإكمال الدفع
      const response = await fetch("/api/payments/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.authToken}`,
        },
        body: JSON.stringify({
          paymentId,
          txid,
        }),
      })

      if (!response.ok) {
        throw new Error("فشل في إكمال الدفع من الخادم")
      }

      console.log("تم إكمال الدفع من الخادم")
    } catch (error) {
      console.error("خطأ في إكمال الدفع:", error)
    }
  }

  // دالة للتحقق من حالة الدفع
  async getPaymentStatus(paymentId: string): Promise<any> {
    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("فشل في الحصول على حالة الدفع")
      }

      return await response.json()
    } catch (error) {
      console.error("خطأ في الحصول على حالة الدفع:", error)
      throw error
    }
  }
}

export const PiPaymentService = new PiPaymentServiceClass()
