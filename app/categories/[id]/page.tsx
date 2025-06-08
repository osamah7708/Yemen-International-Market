"use client"

import { useState } from "react"
import { Star, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PiPaymentButton } from "@/components/ui/pi-payment-button"
import Link from "next/link"
import { useParams } from "next/navigation"
import { AppHeader } from "@/components/app-header"

const categoryProducts = {
  "1": [
    {
      id: 1,
      name: "تفاح أحمر طازج",
      price: 0.012,
      originalPrice: 0.015,
      marketPrice: "$3.80",
      image: "/placeholder.svg?height=300&width=300&text=تفاح+أحمر",
      rating: 4.8,
      reviews: 124,
      discount: 20,
      isNew: true,
    },
    {
      id: 2,
      name: "موز طازج",
      price: 0.008,
      originalPrice: 0.01,
      marketPrice: "$2.50",
      image: "/placeholder.svg?height=300&width=300&text=موز",
      rating: 4.6,
      reviews: 89,
      discount: 20,
      isNew: false,
    },
  ],
  "5": [
    {
      id: 3,
      name: "آيفون 15 برو ماكس",
      price: 3.82,
      originalPrice: 4.77,
      marketPrice: "$1,200",
      image: "/placeholder.svg?height=300&width=300&text=آيفون+15+برو+ماكس",
      rating: 4.8,
      reviews: 124,
      discount: 20,
      isNew: true,
    },
    {
      id: 4,
      name: "سامسونج جالاكسي S24",
      price: 2.55,
      originalPrice: 3.18,
      marketPrice: "$800",
      image: "/placeholder.svg?height=300&width=300&text=سامسونج+جالاكسي",
      rating: 4.6,
      reviews: 89,
      discount: 20,
      isNew: false,
    },
  ],
}

const categories = {
  "1": { name: "المواد الغذائية", icon: "🍎" },
  "2": { name: "الملابس الرجالية", icon: "👔" },
  "3": { name: "الملابس النسائية", icon: "👗" },
  "4": { name: "ملابس الأطفال", icon: "👶" },
  "5": { name: "الجوالات والهواتف", icon: "📱" },
  "6": { name: "أجهزة الكمبيوتر", icon: "💻" },
}

export default function CategoryPage() {
  const params = useParams()
  const categoryId = params.id as string
  const [searchTerm, setSearchTerm] = useState("")

  const category = categories[categoryId as keyof typeof categories]
  const products = categoryProducts[categoryId as keyof typeof categoryProducts] || []

  const filteredProducts = products.filter((product) => product.name.includes(searchTerm))

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">القسم غير موجود</h1>
          <Link href="/categories">
            <Button>العودة للأقسام</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
      {/* Header */}
      <AppHeader />

      {/* Products */}
      <div className="container mx-auto px-4 py-8">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-xl transition-shadow group overflow-hidden">
                <div className="relative">
                  <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-6xl opacity-50">📱</span>
                  </div>
                  {product.discount > 0 && (
                    <Badge className="absolute top-4 right-4 bg-red-500 text-white">خصم {product.discount}%</Badge>
                  )}
                  {product.isNew && <Badge className="absolute top-4 left-4 bg-green-500 text-white">جديد</Badge>}
                  <Button variant="ghost" size="icon" className="absolute top-4 left-4 bg-white/80 hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-6">
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
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-600">سيتم إضافة المنتجات قريباً</p>
          </div>
        )}
      </div>
    </div>
  )
}
