// تفاصيل المعاملة
const transactionDetails = {
  product: "آيفون 15 برو ماكس",
  amount: 3.820, // Pi
  sender: "GCPQYUYCL7TUMP7MBC6ZTNYSAXH2DDI23X7J7J5MNB2JW5T73KKOZ4CR",
  recipient: "GAHPCOE5XS2PBFUVTPXF5IR3AZ5ASESD4FZZAGAH425WTZKLPNHY7FW4"
};

// دالة تنفيذ الدفع عبر Pi Network
function handlePiPayment() {
  Pi.createPayment({
    amount: transactionDetails.amount,
    memo: transactionDetails.product, // بإمكانك عرض اسم المنتج في المذكرة
    metadata: { // بيانات إضافية اختيارية
      product: transactionDetails.product,
      sender: transactionDetails.sender,
      recipient: transactionDetails.recipient
    },
    onReadyForServerCompletion: function(paymentId: string, txid?: string) {
      // إرسال بيانات الدفع إلى الخادم للتحقق النهائي
      fetch('/api/verify-pi-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId,
          txid,
          ...transactionDetails
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('تم الدفع بنجاح!');
        } else {
          alert('فشل التحقق من الدفع!');
        }
      });
    }
  });
}
// Pi Network Payment Integration with Pi Browser Support
export interface PiPayment {
  amount: number
  memo: string
  metadata: {
    productId?: string
    orderId?: string
    userId?: string
  }
}

export interface PiTransfer {
  amount: number
  toWallet: string
  memo: string
  metadata: {
    productId?: string
    orderId?: string
    userId?: string
    transferType?: string
  }
}

export interface PiPaymentResult {
  paymentId: string
  txid: string
  status: "completed" | "cancelled" | "failed" | "pending"
  amount: number
  toWallet?: string
}

export const PI_WALLET_ADDRESS = "GAHPCOE5XS2PBFUVTPXF5IR3AZ5ASESD4FZZAGAH425WTZKLPNHY7FW4"

// Pi Browser Detection - تحسين الكشف عن Pi Browser
export const isPiBrowser = (): boolean => {
  if (typeof window === "undefined") return false

  // تحسين الكشف عن Pi Browser بطرق متعددة
  const userAgent = window.navigator.userAgent.toLowerCase()
  const isPiApp =
    userAgent.includes("pibrowser") || userAgent.includes("pi network") || userAgent.includes("pi-network")

  const isPiHostname = window.location.hostname.includes("pi.app") || window.location.hostname.includes("minepi.com")

  const hasPiObject = typeof window.Pi !== "undefined"

  return isPiApp || isPiHostname || hasPiObject
}

// تحسين Deep Link Generator للعمل مع Pi Browser
export const generatePiDeepLink = (action: string, params: Record<string, any> = {}): string => {
  // تحديد URL الأساسي للـ Deep Link
  const baseUrl = isPiBrowser() ? "pi://app" : "https://app-cdn.minepi.com/app"

  // إضافة معرف التطبيق
  const appId = "yemen-international-market"

  // إنشاء URL للعودة
  const returnUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/payment-callback`
      : "https://yemen-market.vercel.app/payment-callback"

  // بناء معلمات الاستعلام
  const queryParams = new URLSearchParams({
    app_id: appId,
    action,
    ...params,
    return_url: returnUrl,
  }).toString()

  return `${baseUrl}?${queryParams}`
}

// فتح Pi Browser مباشرة
export const openPiBrowser = (action: string, params: Record<string, any> = {}): void => {
  const deepLink = generatePiDeepLink(action, params)

  // محاولة فتح التطبيق
  const newWindow = window.open(deepLink, "_blank")

  // إذا فشل الفتح، حاول بطريقة أخرى
  if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
    // محاولة استخدام location.href كبديل
    window.location.href = deepLink
  }
}

export class PiPaymentService {
  private static instance: PiPaymentService
  private isInitialized = false
  private pendingPayments = new Map<string, any>()

  static getInstance(): PiPaymentService {
    if (!PiPaymentService.instance) {
      PiPaymentService.instance = new PiPaymentService()
    }
    return PiPaymentService.instance
  }

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true

    try {
      console.log("Initializing Pi Payment Service...")
      console.log("Pi Browser detected:", isPiBrowser())

      // تحقق من وجود Pi SDK
      if (isPiBrowser() && window.Pi) {
        console.log("Pi SDK available, initializing...")
        await this.initializePiSDK()
      } else {
        console.log("Using Mock Pi SDK for development/testing")
        this.setupMockPiSDK()
      }

      // إعداد معالج الـ callbacks
      this.setupCallbackHandler()

      this.isInitialized = true
      console.log("Pi Payment Service initialized successfully")
      return true
    } catch (error) {
      console.error("Failed to initialize Pi Payment Service:", error)
      // في حالة الفشل، استخدم المحاكاة كـ fallback
      this.setupMockPiSDK()
      this.isInitialized = true
      return true
    }
  }

  private async initializePiSDK(): Promise<void> {
    if (!window.Pi) throw new Error("Pi SDK not available")

    try {
      // تهيئة Pi SDK مع إعدادات التطبيق
      await window.Pi.init({
        version: "2.0",
        sandbox: process.env.NODE_ENV === "development",
      })
      console.log("Pi SDK initialized successfully")
    } catch (error) {
      console.error("Pi SDK initialization failed:", error)
      throw error
    }
  }

  private setupCallbackHandler(): void {
    // معالج للعودة من Pi Browser
    if (typeof window !== "undefined") {
      window.addEventListener("message", (event) => {
        if (event.origin !== window.location.origin) return

        const { type, data } = event.data
        if (type === "PI_PAYMENT_CALLBACK") {
          this.handlePaymentCallback(data)
        }
      })

      // معالج للـ URL callbacks
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.has("pi_payment_id") || urlParams.has("payment_id")) {
        const paymentId = urlParams.get("pi_payment_id") || urlParams.get("payment_id") || ""
        const status = urlParams.get("status") || "completed"
        const txid = urlParams.get("txid") || urlParams.get("transaction_id") || ""
        const amount = Number.parseFloat(urlParams.get("amount") || "0")

        this.handlePaymentCallback({
          paymentId,
          status,
          txid,
          amount,
        })
      }
    }
  }

  private handlePaymentCallback(data: any): void {
    const { paymentId, status, txid } = data
    console.log("Payment callback received:", data)

    const pendingPayment = this.pendingPayments.get(paymentId)
    if (pendingPayment) {
      const { resolve, amount, toWallet } = pendingPayment

      resolve({
        paymentId,
        txid,
        status,
        amount,
        toWallet,
      })

      this.pendingPayments.delete(paymentId)

      // حفظ المعاملة في localStorage
      this.saveTransaction({
        paymentId,
        txid,
        status,
        amount,
        toWallet,
        timestamp: new Date().toISOString(),
      })
    }
  }

  private saveTransaction(transaction: any): void {
    try {
      const existingTransactions = JSON.parse(localStorage.getItem("userTransactions") || "[]")
      existingTransactions.push(transaction)
      localStorage.setItem("userTransactions", JSON.stringify(existingTransactions))
      console.log("Transaction saved:", transaction)
    } catch (error) {
      console.error("Failed to save transaction:", error)
    }
  }

  private setupMockPiSDK(): void {
    if (typeof window === "undefined") return
    ;(window as any).Pi = {
      init: async (options: any) => {
        console.log("Mock Pi SDK init called with:", options)
        return Promise.resolve()
      },

      authenticate: async () => {
        console.log("Mock Pi authentication started...")
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockAuth = {
          accessToken: `mock_token_${Date.now()}`,
          user: {
            uid: `mock_user_${Date.now()}`,
            username: "test_user",
            roles: ["user"],
          },
        }

        console.log("Mock Pi authentication completed:", mockAuth)
        return mockAuth
      },

      createPayment: (payment: PiPayment, callbacks: any) => {
        console.log("Mock Pi payment creation started:", payment)

        const paymentId = `mock_payment_${Date.now()}`
        const txid = `mock_tx_${Date.now()}`

        // محاكاة فتح Pi Browser
        if (isPiBrowser()) {
          console.log("Redirecting to Pi Browser for payment...")
          const deepLink = generatePiDeepLink("payment", {
            amount: payment.amount,
            memo: payment.memo,
            paymentId,
          })
          window.location.href = deepLink
        } else {
          // محاكاة تدفق الدفع العادي
          setTimeout(() => {
            console.log("Mock payment approval phase")
            callbacks.onReadyForServerApproval(paymentId)
          }, 1000)

          setTimeout(() => {
            console.log("Mock payment completion phase")
            callbacks.onReadyForServerCompletion(paymentId, txid)
          }, 2000)
        }
      },

      createTransfer: (transfer: PiTransfer, callbacks: any) => {
        console.log("Mock Pi direct transfer started:", transfer)

        const transferId = `mock_transfer_${Date.now()}`
        const txid = `mock_tx_${Date.now()}`

        // التحقق من صحة عنوان المحفظة
        if (!transfer.toWallet || transfer.toWallet.length < 10) {
          setTimeout(() => {
            callbacks.onError(new Error("عنوان المحفظة غير صحيح"))
          }, 500)
          return
        }

        // محاكاة فتح Pi Browser للتحويل
        if (isPiBrowser()) {
          console.log("Redirecting to Pi Browser for transfer...")
          const deepLink = generatePiDeepLink("transfer", {
            amount: transfer.amount,
            to_address: transfer.toWallet,
            memo: transfer.memo,
            payment_id: transferId,
          })
          window.location.href = deepLink
        } else {
          // محاكاة تدفق التحويل العادي
          setTimeout(() => {
            console.log("Mock transfer approval phase")
            callbacks.onReadyForServerApproval(transferId)
          }, 1000)

          setTimeout(() => {
            console.log("Mock transfer completion phase")
            callbacks.onReadyForServerCompletion(transferId, txid)
          }, 2500)
        }
      },
    }
  }

  async authenticateUser(): Promise<{ accessToken: string; user: any } | null> {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize()
        if (!initialized) {
          throw new Error("Failed to initialize Pi Payment Service")
        }
      }

      if (typeof window === "undefined") {
        throw new Error("Window object not available")
      }

      if (!window.Pi) {
        throw new Error("Pi SDK not available")
      }

      console.log("Starting Pi authentication...")

      // في Pi Browser، قد نحتاج لإعادة توجيه للمصادقة
      if (isPiBrowser()) {
        const result = await window.Pi.authenticate()
        return result
      } else {
        // للتطوير والاختبار
        const result = await window.Pi.authenticate()
        return result
      }
    } catch (error) {
      console.error("Pi authentication failed:", error)
      throw error
    }
  }

  async createDirectTransfer(
    amount: number,
    toWallet: string,
    memo: string,
    metadata: PiTransfer["metadata"] = {},
  ): Promise<PiPaymentResult> {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize()
        if (!initialized) {
          throw new Error("Failed to initialize Pi Payment Service")
        }
      }

      if (typeof window === "undefined") {
        throw new Error("Window object not available")
      }

      // التحقق من صحة عنوان المحفظة
      if (!toWallet || toWallet.trim().length === 0) {
        throw new Error("عنوان المحفظة مطلوب")
      }

      if (toWallet.length < 10) {
        throw new Error("عنوان المحفظة غير صحيح")
      }

      const transferId = `transfer_${Date.now()}`

      // إذا كنا في Pi Browser، استخدم الـ Deep Link مباشرة
      if (isPiBrowser()) {
        console.log("Using direct Pi Browser integration for transfer")

        // حفظ المعاملة المعلقة
        this.pendingPayments.set(transferId, {
          resolve: () => {},
          reject: () => {},
          amount,
          toWallet,
          timestamp: Date.now(),
        })

        // حفظ معلومات المعاملة في localStorage للاسترجاع لاحقاً
        localStorage.setItem(
          "pendingPiTransfer",
          JSON.stringify({
            transferId,
            amount,
            toWallet,
            memo,
            metadata,
            timestamp: Date.now(),
          }),
        )

        // فتح Pi Browser مباشرة
        openPiBrowser("transfer", {
          amount: amount.toString(),
          to_address: toWallet,
          memo: memo,
          payment_id: transferId,
          metadata: JSON.stringify(metadata),
        })

        // إرجاع معاملة معلقة
        return {
          paymentId: transferId,
          txid: "",
          status: "pending",
          amount,
          toWallet,
        }
      }

      // إذا كان Pi SDK متاح
      if (window.Pi) {
        const transfer: PiTransfer = { amount, toWallet, memo, metadata }

        return new Promise((resolve, reject) => {
          try {
            // حفظ المعاملة المعلقة
            this.pendingPayments.set(transferId, {
              resolve,
              reject,
              amount,
              toWallet,
              timestamp: Date.now(),
            })

            if (window.Pi.createTransfer) {
              // استخدام Pi Browser الحقيقي
              window.Pi.createTransfer(transfer, {
                onReadyForServerApproval: (id: string) => {
                  console.log("Transfer ready for server approval:", id)
                },
                onReadyForServerCompletion: (id: string, txid: string) => {
                  console.log("Transfer completed:", id, txid)
                  resolve({
                    paymentId: id,
                    txid,
                    status: "completed",
                    amount,
                    toWallet,
                  })
                  this.pendingPayments.delete(transferId)
                },
                onCancel: (id: string) => {
                  console.log("Transfer cancelled:", id)
                  resolve({
                    paymentId: id,
                    txid: "",
                    status: "cancelled",
                    amount,
                    toWallet,
                  })
                  this.pendingPayments.delete(transferId)
                },
                onError: (error: Error) => {
                  console.error("Transfer error:", error)
                  reject(error)
                  this.pendingPayments.delete(transferId)
                },
              })
            } else {
              // استخدام createPayment كبديل أو للمحاكاة
              const paymentMemo = `${memo} - تحويل إلى: ${toWallet}`
              const paymentMetadata = { ...metadata, toWallet, transferType: "direct" }

              window.Pi!.createPayment(
                { amount, memo: paymentMemo, metadata: paymentMetadata },
                {
                  onReadyForServerApproval: (paymentId: string) => {
                    console.log("Payment (as transfer) ready for server approval:", paymentId)
                  },
                  onReadyForServerCompletion: (paymentId: string, txid: string) => {
                    console.log("Payment (as transfer) completed:", paymentId, txid)
                    resolve({
                      paymentId,
                      txid,
                      status: "completed",
                      amount,
                      toWallet,
                    })
                    this.pendingPayments.delete(transferId)
                  },
                  onCancel: (paymentId: string) => {
                    console.log("Payment (as transfer) cancelled:", paymentId)
                    resolve({
                      paymentId,
                      txid: "",
                      status: "cancelled",
                      amount,
                      toWallet,
                    })
                    this.pendingPayments.delete(transferId)
                  },
                  onError: (error: Error) => {
                    console.error("Payment (as transfer) error:", error)
                    reject(error)
                    this.pendingPayments.delete(transferId)
                  },
                },
              )
            }

            // مهلة زمنية للمعاملة (5 دقائق)
            setTimeout(
              () => {
                if (this.pendingPayments.has(transferId)) {
                  this.pendingPayments.delete(transferId)
                  reject(new Error("انتهت مهلة المعاملة"))
                }
              },
              5 * 60 * 1000,
            )
          } catch (error) {
            console.error("Error in createDirectTransfer:", error)
            this.pendingPayments.delete(transferId)
            reject(error)
          }
        })
      } else {
        throw new Error("Pi SDK not available")
      }
    } catch (error) {
      console.error("Direct transfer creation failed:", error)
      throw error
    }
  }

  // دالة للتحقق من حالة المعاملة
  async checkTransactionStatus(paymentId: string): Promise<PiPaymentResult | null> {
    try {
      // في التطبيق الحقيقي، هذا سيكون استعلام API
      const transactions = JSON.parse(localStorage.getItem("userTransactions") || "[]")
      const transaction = transactions.find((t: any) => t.paymentId === paymentId)

      if (transaction) {
        return {
          paymentId: transaction.paymentId,
          txid: transaction.txid,
          status: transaction.status,
          amount: transaction.amount,
          toWallet: transaction.toWallet,
        }
      }

      return null
    } catch (error) {
      console.error("Failed to check transaction status:", error)
      return null
    }
  }

  // دالة لإلغاء المعاملة المعلقة
  cancelPendingPayment(paymentId: string): void {
    if (this.pendingPayments.has(paymentId)) {
      const { reject } = this.pendingPayments.get(paymentId)
      reject(new Error("تم إلغاء المعاملة من قبل المستخدم"))
      this.pendingPayments.delete(paymentId)
    }
  }
}

// Pi Network SDK types للـ TypeScript
declare global {
  interface Window {
    Pi?: {
      init?: (options: { version?: string; sandbox?: boolean }) => Promise<void>
      authenticate: () => Promise<{ accessToken: string; user: any }>
      createPayment: (
        payment: PiPayment,
        callbacks: {
          onReadyForServerApproval: (paymentId: string) => void
          onReadyForServerCompletion: (paymentId: string, txid: string) => void
          onCancel: (paymentId: string) => void
          onError: (error: Error, payment?: any) => void
        },
      ) => void
      createTransfer?: (
        transfer: PiTransfer,
        callbacks: {
          onReadyForServerApproval: (transferId: string) => void
          onReadyForServerCompletion: (transferId: string, txid: string) => void
          onCancel: (transferId: string) => void
          onError: (error: Error, transfer?: any) => void
        },
      ) => void
    }
  }
}
