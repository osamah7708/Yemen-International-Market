"use client"

import { useState, useEffect } from "react"
import { Package, Clock, CheckCircle, XCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"

const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    total: 3.82,
    items: [{ name: "آيفون 15 برو ماكس", quantity: 1, price: 3.82 }],
    paymentMethod: "Pi Network",
    trackingNumber: "TRK123456789",
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    status: "processing",
    total: 2.67,
    items: [
      { name: "لابتوب ديل XPS 13", quantity: 1, price: 2.55 },
      { name: "تفاح أحمر طازج", quantity: 1, price: 0.012 },
    ],
    paymentMethod: "Pi Transfer",
    trackingNumber: "TRK123456790",
  },
  {
    id: "ORD-003",
    date: "2024-01-05",
    status: "cancelled",
    total: 0.095,
    items: [{ name: "قميص قطني رجالي", quantity: 1, price: 0.095 }],
    paymentMethod: "Pi Network",
    trackingNumber: null,
  },
]

export default function OrdersPage() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState(mockOrders)
  const [filterStatus, setFilterStatus] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push("/auth/login")
    }
  }, [router])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "processing":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "تم التسليم"
      case "processing":
        return "قيد المعالجة"
      case "cancelled":
        return "ملغي"
      default:
        return "غير معروف"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredOrders = filterStatus === "all" ? orders : orders.filter((order) => order.status === filterStatus)

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
    <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
      {/* Header */}
      <AppHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <Button variant={filterStatus === "all" ? "default" : "outline"} onClick={() => setFilterStatus("all")}>
            جميع الطلبات
          </Button>
          <Button
            variant={filterStatus === "processing" ? "default" : "outline"}
            onClick={() => setFilterStatus("processing")}
          >
            قيد المعالجة
          </Button>
          <Button
            variant={filterStatus === "delivered" ? "default" : "outline"}
            onClick={() => setFilterStatus("delivered")}
          >
            تم التسليم
          </Button>
          <Button
            variant={filterStatus === "cancelled" ? "default" : "outline"}
            onClick={() => setFilterStatus("cancelled")}
          >
            ملغي
          </Button>
        </div>

        {/* Orders */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <CardTitle className="text-lg">طلب رقم {order.id}</CardTitle>
                        <p className="text-sm text-gray-600">تاريخ الطلب: {order.date}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Items */}
                    <div className="lg:col-span-2">
                      <h4 className="font-medium mb-3">المنتجات:</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-red-600">{item.price.toFixed(3)} Pi</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">تفاصيل الطلب</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>الإجمالي:</span>
                            <span className="font-bold">{order.total.toFixed(3)} Pi</span>
                          </div>
                          <div className="flex justify-between">
                            <span>طريقة الدفع:</span>
                            <span>{order.paymentMethod}</span>
                          </div>
                          {order.trackingNumber && (
                            <div className="flex justify-between">
                              <span>رقم التتبع:</span>
                              <span className="font-mono text-xs">{order.trackingNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 ml-1" />
                          التفاصيل
                        </Button>
                        {order.status === "processing" && (
                          <Button variant="outline" size="sm" className="flex-1">
                            تتبع الطلب
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد طلبات</h3>
              <p className="text-gray-600 mb-4">لم تقم بأي طلبات بعد</p>
              <Link href="/">
                <Button>ابدأ التسوق</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
