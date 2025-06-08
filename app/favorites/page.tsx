"use client"

import { useState, useEffect } from "react"
import { Heart, Star, ShoppingCart, ArrowLeft, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PiPaymentButton } from "@/components/ui/pi-payment-button"
import { PiTransferButton } from "@/components/ui/pi-transfer-button"
import Link from "next/link"
import { useRouter } from "next/navigation"

const mockFavorites = [
  {
    id: 1,
    name: "آيفون 15 برو ماكس",
    price: 3.82,
    originalPrice: 4.77,
    marketPrice: "$1,200",
    image: "/placeholder.svg?height=300&width=300&text=آيفون+15+برو+ماكس",
    rating: 4.8,
    reviews: 124,
    category: "الجوالات والهواتف",
    discount: 20,
    isNew: true,
    addedDate: "2024-01-15",
  },
  {
    id: 2,
    name: "لابتوب ديل XPS 13",
    price: 2.55,
    originalPrice: 3.18,
    marketPrice: "$800",
    image: "/placeholder.svg?height=300&width=300&text=لابتوب+ديل+XPS",
    rating: 4.6,
    reviews: 89,
    category: "أجهزة الكمبيوتر",
    discount: 20,
    isNew: false,
    addedDate: "2024-01-10",
  },
  {
    id: 5,
    name: "فستان صيفي نسائي",
    price: 0.127,
    originalPrice: 0.159,
    marketPrice: "$40",
    image: "/placeholder.svg?height=300&width=300&text=فستان+نسائي",
    rating: 4.7,
    reviews: 92,
    category: "الملابس النسائية",
    discount: 20,
    isNew: true,
    addedDate: "2024-01-08",
  },
]

export default function FavoritesPage() {
  const [user, setUser] = useState<any>(null)
  const [favorites, setFavorites] = useState(mockFavorites)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push("/auth/login")
    }
  }, [router])

  const removeFavorite = (productId: number) => {
    setFavorites(favorites.filter((item) => item.id !== productId))
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
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-red-600 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">المفضلة</h1>
                <p className="text-gray-600">منتجاتك المفضلة ({favorites.length})</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                العودة للرئيسية
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {favorites.map((product) => (
              <Card key={product.id} className="hover:shadow-xl transition-shadow group overflow-hidden">
                <div className="relative">
                  <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-6xl opacity-50">📦</span>
                  </div>
                  {product.discount > 0 && (
                    <Badge className="absolute top-4 right-4 bg-red-500 text-white">خصم {product.discount}%</Badge>
                  )}
                  {product.isNew && <Badge className="absolute top-4 left-4 bg-green-500 text-white">جديد</Badge>}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 left-4 bg-white/80 hover:bg-white text-red-500"
                    onClick={() => removeFavorite(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-6">
                  <Badge variant="outline" className="mb-2 text-xs">
                    {product.category}
                  </Badge>
                  <h4 className="font-bold text-lg mb-2 text-gray-800">{product.name}</h4>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 mr-2">({product.reviews} تقييم)</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-red-600">{product.price.toFixed(3)} Pi</span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {product.marketPrice}
                        </span>
                      </div>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.originalPrice.toFixed(3)} Pi
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">أضيف في: {product.addedDate}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0 space-y-3">
                  <PiPaymentButton
                    amount={product.price}
                    productName={product.name}
                    productId={product.id.toString()}
                    onPaymentSuccess={(result) => {
                      console.log("Payment successful:", result)
                    }}
                    onPaymentError={(error) => {
                      console.error("Payment failed:", error)
                    }}
                  />
                  <PiTransferButton
                    amount={product.price}
                    productName={product.name}
                    productId={product.id.toString()}
                    onTransferSuccess={(result) => {
                      console.log("Transfer successful:", result)
                    }}
                    onTransferError={(error) => {
                      console.error("Transfer failed:", error)
                    }}
                  />
                  <Button variant="outline" className="w-full">
                    <ShoppingCart className="h-4 w-4 ml-2" />
                    أضف إلى السلة
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد منتجات مفضلة</h3>
            <p className="text-gray-600 mb-4">ابدأ بإضافة منتجات إلى قائمة المفضلة</p>
            <Link href="/">
              <Button>تصفح المنتجات</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
