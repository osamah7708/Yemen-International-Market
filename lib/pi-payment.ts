// Pi Network Payment Integration
export interface PiPayment {
  amount: number
  memo: string
  metadata: {
    productId?: string
    orderId?: string
    userId?: string
  }
}

export interface PiPaymentResult {
  paymentId: string
  txid: string
  status: "completed" | "cancelled" | "failed"
}

// Pi Network SDK types
declare global {
  interface Window {
    Pi?: {
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
    }
  }
}

export const PI_WALLET_ADDRESS = "GAHPCOE5XS2PBFUVTPXF5IR3AZ5ASESD4FZZAGAH425WTZKLPNHY7FW4"

export class PiPaymentService {
  private static instance: PiPaymentService
  private isInitialized = false

  static getInstance(): PiPaymentService {
    if (!PiPaymentService.instance) {
      PiPaymentService.instance = new PiPaymentService()
    }
    return PiPaymentService.instance
  }

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true

    try {
      // Load Pi Network SDK
      if (!window.Pi) {
        await this.loadPiSDK()
      }

      this.isInitialized = true
      return true
    } catch (error) {
      console.error("Failed to initialize Pi Payment:", error)
      return false
    }
  }

  private async loadPiSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script")
      script.src = "https://sdk.minepi.com/pi-sdk.js"
      script.onload = () => resolve()
      script.onerror = () => reject(new Error("Failed to load Pi SDK"))
      document.head.appendChild(script)
    })
  }

  async authenticateUser(): Promise<{ accessToken: string; user: any } | null> {
    if (!window.Pi) {
      throw new Error("Pi SDK not loaded")
    }

    try {
      const auth = await window.Pi.authenticate()
      return auth
    } catch (error) {
      console.error("Pi authentication failed:", error)
      return null
    }
  }

  async createPayment(amount: number, memo: string, metadata: PiPayment["metadata"] = {}): Promise<PiPaymentResult> {
    if (!window.Pi) {
      throw new Error("Pi SDK not loaded")
    }

    return new Promise((resolve, reject) => {
      const payment: PiPayment = {
        amount,
        memo,
        metadata,
      }

      window.Pi!.createPayment(payment, {
        onReadyForServerApproval: (paymentId: string) => {
          console.log("Payment ready for server approval:", paymentId)
          // Here you would typically call your backend to approve the payment
          this.approvePayment(paymentId)
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          console.log("Payment ready for completion:", paymentId, txid)
          // Here you would typically call your backend to complete the payment
          this.completePayment(paymentId, txid)
          resolve({
            paymentId,
            txid,
            status: "completed",
          })
        },
        onCancel: (paymentId: string) => {
          console.log("Payment cancelled:", paymentId)
          resolve({
            paymentId,
            txid: "",
            status: "cancelled",
          })
        },
        onError: (error: Error) => {
          console.error("Payment error:", error)
          reject(error)
        },
      })
    })
  }

  private async approvePayment(paymentId: string): Promise<void> {
    // In a real app, this would call your backend API
    console.log("Approving payment:", paymentId)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  private async completePayment(paymentId: string, txid: string): Promise<void> {
    // In a real app, this would call your backend API
    console.log("Completing payment:", paymentId, txid)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}
