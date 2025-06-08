"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PiPaymentButton } from "@/components/ui/pi-payment-button"
import { PiWalletInfo } from "@/components/ui/pi-wallet-info"
import { PiTransferButton } from "@/components/ui/pi-transfer-button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"

const categories = [
  {
    id: 1,
    name: "المواد الغذائية",
    icon: "🍎",
    count: 1250,
    image: "/placeholder.svg?height=200&width=200&text=مواد+غذائية",
  },
  {
    id: 2,
    name: "الملابس الرجالية",
    icon: "👔",
    count: 890,
    image: "/placeholder.svg?height=200&width=200&text=ملابس+رجالية",
  },
  {
    id: 3,
    name: "الملابس النسائية",
    icon: "👗",
    count: 1100,
    image: "/placeholder.svg?height=200&width=200&text=ملابس+نسائية",
  },
  {
    id: 4,
    name: "ملابس الأطفال",
    icon: "👶",
    count: 650,
    image: "/placeholder.svg?height=200&width=200&text=ملابس+أطفال",
  },
  {
    id: 5,
    name: "الجوالات والهواتف",
    icon: "📱",
    count: 450,
    image: "/placeholder.svg?height=200&width=200&text=جوالات",
  },
  {
    id: 6,
    name: "أجهزة الكمبيوتر",
    icon: "💻",
    count: 320,
    image: "/placeholder.svg?height=200&width=200&text=كمبيوترات",
  },
]

const featuredProducts = [
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
  },
]

export default function YemenMarketHomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-red-50 pb-20" dir="rtl">
      {/* Header */}
      <AppHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 via-red-700 to-green-600 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 break-words">
            مرحباً بك في سوق اليمن الدولي
          </h2>
          <p className="text-sm md:text-lg lg:text-xl mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed">
            نقدم لك أفضل المنتجات من جميع أنحاء العالم بأسعار تناسب المجتمع اليمني
            <br className="hidden md:block" />
            جودة عالية • أسعار منافسة • خدمة متميزة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-white text-red-600 hover:bg-gray-100 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg w-full sm:w-auto"
            >
              تسوق الآن
            </Button>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 w-full sm:w-auto">
              <p className="text-xs md:text-sm opacity-90">نظام التسعير بعملة Pi</p>
              <p className="text-base md:text-lg font-bold">1 Pi = 314,159$</p>
              <p className="text-xs opacity-75">الأسعار محسوبة حسب السعر الحقيقي في الأسواق</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-800">تصفح الأقسام</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden h-full">
                  <div className="relative h-32 md:h-40 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-3xl md:text-4xl">{category.icon}</span>
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        {category.count.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 md:p-4">
                    <h4 className="font-bold text-sm md:text-base text-gray-800 truncate" title={category.name}>
                      {category.name}
                    </h4>
                    <p className="text-xs text-gray-600">{category.count.toLocaleString()} منتج</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 md:mb-12 gap-4">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800">المنتجات المميزة</h3>
            <Button
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-full sm:w-auto"
            >
              عرض الكل
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-xl transition-shadow group overflow-hidden h-full flex flex-col"
              >
                <div className="relative">
                  <div className="w-full h-48 md:h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-4xl md:text-6xl opacity-50">📱</span>
                  </div>
                  {product.discount > 0 && (
                    <Badge className="absolute top-2 md:top-4 right-2 md:right-4 bg-red-500 text-white text-xs">
                      خصم {product.discount}%
                    </Badge>
                  )}
                  {product.isNew && (
                    <Badge className="absolute top-2 md:top-4 left-2 md:left-4 bg-green-500 text-white text-xs">
                      جديد
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4 md:p-6 flex-1 flex flex-col">
                  <Badge variant="outline" className="mb-2 text-xs w-fit">
                    {product.category}
                  </Badge>
                  <h4 className="font-bold text-base md:text-lg mb-2 text-gray-800 line-clamp-2" title={product.name}>
                    {product.name}
                  </h4>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 md:h-4 md:w-4 ${
                            i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs md:text-sm text-gray-600 mr-2">({product.reviews} تقييم)</span>
                  </div>
                  <div className="flex items-center justify-between mb-4 flex-1">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                        <span className="text-lg md:text-2xl font-bold text-red-600">
                          {product.price.toFixed(3)} Pi
                        </span>
                        <span className="text-xs md:text-sm text-gray-500 bg-gray-100 px-1 md:px-2 py-1 rounded">
                          {product.marketPrice}
                        </span>
                      </div>
                      {product.originalPrice > product.price && (
                        <span className="text-xs md:text-sm text-gray-500 line-through">
                          {product.originalPrice.toFixed(3)} Pi
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 md:p-6 pt-0 space-y-2 md:space-y-3">
                  <div className="w-full">
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
                  </div>
                  <div className="w-full">
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
                  </div>
                  <Button variant="outline" className="w-full">
                    أضف إلى السلة
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pi Network Payment Info */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-800">
              الدفع بعملة Pi Network
            </h3>
            <PiWalletInfo />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-reverse space-x-3 mb-4">
              <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-xl md:text-2xl">🛒</span>
              </div>
              <h5 className="text-lg md:text-xl font-bold">سوق اليمن الدولي</h5>
            </div>
            <p className="text-sm md:text-base text-gray-300 mb-4 max-w-2xl mx-auto">
              نقدم أفضل المنتجات بأسعار تناسب المجتمع اليمني مع ضمان الجودة والخدمة المتميزة
            </p>
            <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-400">
              <p className="text-xs md:text-sm">&copy; 2024 سوق اليمن الدولي. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
