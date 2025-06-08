"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, ShoppingCart, User, Star, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PiPaymentButton } from "@/components/ui/pi-payment-button"
import { PiWalletInfo } from "@/components/ui/pi-wallet-info"
import { PiTransferButton } from "@/components/ui/pi-transfer-button"
import Link from "next/link"
import { useRouter } from "next/navigation"

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
  const [searchQuery, setSearchQuery] = useState("")
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-red-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-red-600">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-reverse space-x-4">
              <div className="relative w-14 h-14 overflow-hidden rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-2xl">🛒</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">سوق اليمن الدولي</h1>
                <p className="text-sm text-gray-600">خدمات لا متناهية لتسهيل حياتك</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <form onSubmit={handleSearch} className="relative w-full">
                  <Input
                    type="search"
                    placeholder="ابحث عن المنتجات..."
                    className="pl-12 pr-4 py-3 text-right border-2 border-gray-200 focus:border-red-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>

            {/* Navigation Icons */}
            <div className="flex items-center space-x-reverse space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-6 w-6" />
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">3</Badge>
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-6 w-6" />
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">5</Badge>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="text-right">
                  {user ? (
                    <>
                      <DropdownMenuItem>مرحباً، {user.name}</DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/profile">الملف الشخصي</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/orders">طلباتي</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>الإعدادات</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>تسجيل الخروج</DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem>
                        <Link href="/auth/login">تسجيل الدخول</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/auth/register">إنشاء حساب</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <form onSubmit={handleSearch} className="relative w-full">
                <Input
                  type="search"
                  placeholder="ابحث عن المنتجات..."
                  className="pl-12 pr-4 py-3 text-right border-2 border-gray-200 focus:border-red-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                >
                  <Search className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 via-red-700 to-green-600 text-white py-20">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl font-bold mb-6">مرحباً بك في سوق اليمن الدولي</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            نقدم لك أفضل المنتجات من جميع أنحاء العالم بأسعار تناسب المجتمع اليمني
            <br />
            جودة عالية • أسعار منافسة • خدمة متميزة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 text-lg">
              تسوق الآن
            </Button>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm opacity-90">نظام التسعير بعملة Pi</p>
              <p className="text-lg font-bold">1 Pi = 314,159$</p>
              <p className="text-xs opacity-75">الأسعار محسوبة حسب السعر الحقيقي في الأسواق</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">تصفح الأقسام</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden">
                  <div className="relative h-40 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-4xl">{category.icon}</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-4 text-white">
                        <h4 className="font-bold text-lg">{category.name}</h4>
                        <p className="text-sm opacity-90">{category.count.toLocaleString()} منتج</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800">المنتجات المميزة</h3>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
              عرض الكل
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-xl transition-shadow group overflow-hidden">
                <div className="relative">
                  <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-6xl opacity-50">📱</span>
                  </div>
                  {product.discount > 0 && (
                    <Badge className="absolute top-4 right-4 bg-red-500 text-white">خصم {product.discount}%</Badge>
                  )}
                  {product.isNew && <Badge className="absolute top-4 left-4 bg-green-500 text-white">جديد</Badge>}
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
                  <div className="flex items-center justify-between">
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
                    أضف إلى السلة
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pi Network Payment Info */}
      <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">الدفع بعملة Pi Network</h3>
            <PiWalletInfo />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-reverse space-x-3 mb-4">
              <div className="relative w-12 h-12 overflow-hidden rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-2xl">🛒</span>
              </div>
              <h5 className="text-xl font-bold">سوق اليمن الدولي</h5>
            </div>
            <p className="text-gray-300 mb-4">
              نقدم أفضل المنتجات بأسعار تناسب المجتمع اليمني مع ضمان الجودة والخدمة المتميزة
            </p>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 سوق اليمن الدولي. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
