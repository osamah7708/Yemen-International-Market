"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PiPaymentButton } from "@/components/ui/pi-payment-button"
import { PiTransferButton } from "@/components/ui/pi-transfer-button"
import Link from "next/link"
import { useRouter } from "next/navigation"

const mockCartItems = [
  {
    id: 1,
    name: "آيفون 15 برو ماكس",
    price: 3.82,
    originalPrice: 4.77,
    marketPrice: "$1,200",
    image: "/placeholder.svg?height=300&width=300&text=آيفون+15+برو+ماكس",
    quantity: 1,
    category: "الجوالات والهواتف",
  },
  {
    id: 2,
    name: "تفاح أحمر طازج",
    price: 0.012,
    originalPrice: 0.015,
    marketPrice: "$3.80",
    image: "/placeholder.svg?height=300&width=300&text=تفاح+أحمر",
    quantity: 3,
    category: "المواد الغذائية",
  },
]

export default function CartPage() {
  const [user, setUser] = useState<any>(null)
  const [cartItems, setCartItems] = useState(mockCartItems)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push("/auth/login")
    }
  }, [router])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
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
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">سلة التسوق</h1>
                <p className="text-gray-600">{getTotalItems()} منتج في السلة</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                متابعة التسوق
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-2xl opacity-50">📦</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-lg">{item.name}</h3>
                            <Badge variant="outline" className="text-xs mt-1">
                              {item.category}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-red-600">{item.price.toFixed(3)} Pi</span>
                              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {item.marketPrice}
                              </span>
                            </div>
                            {item.originalPrice > item.price && (
                              <span className="text-sm text-gray-500 line-through">
                                {item.originalPrice.toFixed(3)} Pi
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="mt-3 text-left">
                          <span className="text-lg font-bold text-gray-800">
                            المجموع: {(item.price * item.quantity).toFixed(3)} Pi
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>{(item.price * item.quantity).toFixed(3)} Pi</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">الإجمالي:</span>
                      <span className="text-2xl font-bold text-red-600">{getTotalPrice().toFixed(3)} Pi</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>إتمام الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <PiPaymentButton
                    amount={getTotalPrice()}
                    productName={`طلب يحتوي على ${getTotalItems()} منتج`}
                    orderId={`ORDER_${Date.now()}`}
                    onPaymentSuccess={(result) => {
                      console.log("Payment successful:", result)
                      setCartItems([]) // Clear cart after successful payment
                    }}
                    onPaymentError={(error) => {
                      console.error("Payment failed:", error)
                    }}
                  />

                  <PiTransferButton
                    amount={getTotalPrice()}
                    productName={`طلب يحتوي على ${getTotalItems()} منتج`}
                    orderId={`ORDER_${Date.now()}`}
                    onTransferSuccess={(result) => {
                      console.log("Transfer successful:", result)
                      setCartItems([]) // Clear cart after successful transfer
                    }}
                    onTransferError={(error) => {
                      console.error("Transfer failed:", error)
                    }}
                  />
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🚚</div>
                    <p className="text-sm text-blue-700 font-medium">شحن مجاني للطلبات أكثر من 1 Pi</p>
                    {getTotalPrice() >= 1 && <Badge className="mt-2 bg-green-500">✓ مؤهل للشحن المجاني</Badge>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">سلة التسوق فارغة</h3>
            <p className="text-gray-600 mb-4">ابدأ بإضافة منتجات إلى سلة التسوق</p>
            <Link href="/">
              <Button>تصفح المنتجات</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
