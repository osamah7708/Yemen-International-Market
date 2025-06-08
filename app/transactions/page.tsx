"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Copy, ExternalLink, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function TransactionsPage() {
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
      loadTransactions()
    } else {
      router.push("/auth/login")
    }
  }, [router])

  const loadTransactions = () => {
    try {
      const savedTransactions = JSON.parse(localStorage.getItem("userTransactions") || "[]")
      // ترتيب المعاملات حسب التاريخ (الأحدث أولاً)
      const sortedTransactions = savedTransactions.sort(
        (a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      setTransactions(sortedTransactions)
    } catch (error) {
      console.error("Error loading transactions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyTransactionId = (txid: string) => {
    navigator.clipboard.writeText(txid)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✅"
      case "pending":
        return "⏳"
      case "failed":
        return "❌"
      case "cancelled":
        return "🚫"
      default:
        return "❓"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "مكتملة"
      case "pending":
        return "قيد المعالجة"
      case "failed":
        return "فاشلة"
      case "cancelled":
        return "ملغية"
      default:
        return "غير معروف"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">يرجى تسجيل الدخول</h1>
          <Link href="/auth/login">
            <Button>تسجيل الدخول</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-2xl text-white">💳</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">تاريخ المعاملات</h1>
                <p className="text-gray-600">جميع معاملات Pi Network الخاصة بك</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadTransactions} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                تحديث
              </Button>
              <Link href="/">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  العودة للرئيسية
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل المعاملات...</p>
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <Card key={transaction.paymentId || index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getStatusIcon(transaction.status)}</span>
                      <div>
                        <CardTitle className="text-lg">معاملة Pi Network</CardTitle>
                        <p className="text-sm text-gray-600">{formatDate(transaction.timestamp)}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(transaction.status)}>{getStatusText(transaction.status)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">رقم المعاملة:</span>
                        <span className="text-sm font-mono">{transaction.paymentId}</span>
                      </div>

                      {transaction.txid && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">رقم التحويل:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono">
                              {transaction.txid.length > 16
                                ? `${transaction.txid.substring(0, 8)}...${transaction.txid.substring(transaction.txid.length - 8)}`
                                : transaction.txid}
                            </span>
                            <Button size="sm" variant="ghost" onClick={() => copyTransactionId(transaction.txid)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">المبلغ:</span>
                        <span className="text-lg font-bold text-blue-600">
                          {transaction.amount ? transaction.amount.toFixed(3) : "0.000"} Pi
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {transaction.toWallet && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600">إلى المحفظة:</span>
                          <span className="text-sm font-mono">
                            {transaction.toWallet.substring(0, 8)}...
                            {transaction.toWallet.substring(transaction.toWallet.length - 8)}
                          </span>
                        </div>
                      )}

                      {transaction.productName && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600">المنتج:</span>
                          <span className="text-sm">{transaction.productName}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">النوع:</span>
                        <span className="text-sm">تحويل مباشر</span>
                      </div>
                    </div>
                  </div>

                  {transaction.status === "completed" && (
                    <div className="mt-4 bg-green-50 border border-green-200 p-3 rounded-lg">
                      <p className="text-green-800 text-sm">✅ تمت المعاملة بنجاح وتم تحويل المبلغ إلى محفظتك</p>
                    </div>
                  )}

                  {transaction.status === "pending" && (
                    <div className="mt-4 bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                      <p className="text-yellow-800 text-sm">⏳ المعاملة قيد المعالجة، سيتم إشعارك عند اكتمالها</p>
                    </div>
                  )}

                  {transaction.status === "failed" && (
                    <div className="mt-4 bg-red-50 border border-red-200 p-3 rounded-lg">
                      <p className="text-red-800 text-sm">❌ فشلت المعاملة، يرجى المحاولة مرة أخرى</p>
                    </div>
                  )}

                  {transaction.txid && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`https://pi.network/blockexplorer/tx/${transaction.txid}`, "_blank")}
                        className="gap-2"
                      >
                        <ExternalLink className="h-3 w-3" />
                        عرض في Pi Explorer
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💳</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد معاملات</h3>
            <p className="text-gray-600 mb-4">لم تقم بأي معاملات Pi بعد</p>
            <Link href="/">
              <Button>ابدأ التسوق</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
