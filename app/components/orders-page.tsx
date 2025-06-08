import { Package, Clock, CheckCircle, XCircle, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface OrdersPageProps {
  user: any
}

const sampleOrders = [
  {
    id: "ORDER_1703123456789",
    date: "2024-01-15",
    status: "delivered",
    total: 5500,
    items: [
      { name: "أرز بسمتي فاخر", quantity: 2, price: 2500 },
      { name: "منظف متعدد الاستخدامات", quantity: 1, price: 800 },
    ],
  },
  {
    id: "ORDER_1703123456790",
    date: "2024-01-20",
    status: "processing",
    total: 15000,
    items: [{ name: "ساعة ذكية رياضية", quantity: 1, price: 15000 }],
  },
  {
    id: "ORDER_1703123456791",
    date: "2024-01-22",
    status: "pending",
    total: 3200,
    items: [
      { name: "أرز بسمتي فاخر", quantity: 1, price: 2500 },
      { name: "منظف متعدد الاستخدامات", quantity: 1, price: 800 },
    ],
  },
]

const getStatusInfo = (status: string) => {
  switch (status) {
    case "pending":
      return { label: "في الانتظار", color: "bg-yellow-500", icon: Clock }
    case "processing":
      return { label: "قيد المعالجة", color: "bg-blue-500", icon: Package }
    case "delivered":
      return { label: "تم التسليم", color: "bg-green-500", icon: CheckCircle }
    case "cancelled":
      return { label: "ملغي", color: "bg-red-500", icon: XCircle }
    default:
      return { label: "غير معروف", color: "bg-gray-500", icon: Package }
  }
}

export default function OrdersPage({ user }: OrdersPageProps) {
  if (!user) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">يرجى تسجيل الدخول</h3>
        <p className="text-gray-500">قم بتسجيل الدخول لعرض طلباتك</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">طلباتي</h1>
        <Badge variant="secondary">{sampleOrders.length} طلب</Badge>
      </div>

      <div className="space-y-4">
        {sampleOrders.map((order) => {
          const statusInfo = getStatusInfo(order.status)
          const StatusIcon = statusInfo.icon

          return (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">طلب #{order.id.slice(-6)}</CardTitle>
                  <Badge className={`${statusInfo.color} text-white`}>
                    <StatusIcon className="ml-1 h-3 w-3" />
                    {statusInfo.label}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">تاريخ الطلب: {order.date}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">{(item.price * item.quantity).toLocaleString()} ر.ي</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="ml-1 h-3 w-3" />
                      عرض التفاصيل
                    </Button>
                    {order.status === "delivered" && (
                      <Button variant="outline" size="sm">
                        إعادة الطلب
                      </Button>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">المجموع</p>
                    <p className="text-lg font-bold text-green-600">{order.total.toLocaleString()} ر.ي</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {sampleOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات</h3>
          <p className="text-gray-500">لم تقم بأي طلبات بعد</p>
        </div>
      )}
    </div>
  )
}
