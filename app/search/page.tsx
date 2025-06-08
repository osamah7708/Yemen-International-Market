"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Star, Heart, ShoppingCart, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PiPaymentButton } from "@/components/ui/pi-payment-button"
import { PiTransferButton } from "@/components/ui/pi-transfer-button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

const allProducts = [
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
  {
    id: 3,
    name: "تفاح أحمر طازج",
    price: 0.012,
    originalPrice: 0.015,
    marketPrice: "$3.80",
    image: "/placeholder.svg?height=300&width=300&text=تفاح+أحمر",
    rating: 4.8,
    reviews: 124,
    category: "المواد الغذائية",
    discount: 20,
    isNew: true,
  },
  {
    id: 4,
    name: "قميص قطني رجالي",
    price: 0.095,
    originalPrice: 0.12,
    marketPrice: "$30",
    image: "/placeholder.svg?height=300&width=300&text=قميص+رجالي",
    rating: 4.5,
    reviews: 67,
    category: "الملابس الرجالية",
    discount: 21,
    isNew: false,
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
  },
  {
    id: 6,
    name: "حذاء رياضي للأطفال",
    price: 0.063,
    originalPrice: 0.079,
    marketPrice: "$20",
    image: "/placeholder.svg?height=300&width=300&text=حذاء+أطفال",
    rating: 4.4,
    reviews: 45,
    category: "ملابس الأطفال",
    discount: 20,
    isNew: false,
  },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [filteredProducts, setFilteredProducts] = useState(allProducts)
  const [sortBy, setSortBy] = useState("relevance")
  const [filterCategory, setFilterCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")

  useEffect(() => {
    let filtered = allProducts

    // البحث النصي
    if (searchQuery) {
      filtered = filtered.filter(
        (product) => product.name.includes(searchQuery) || product.category.includes(searchQuery),
      )
    }

    // فلترة حسب الفئة
    if (filterCategory !== "all") {
      filtered = filtered.filter((product) => product.category === filterCategory)
    }

    // فلترة حسب السعر
    if (priceRange !== "all") {
      switch (priceRange) {
        case "low":
          filtered = filtered.filter((product) => product.price < 0.1)
          break
        case "medium":
          filtered = filtered.filter((product) => product.price >= 0.1 && product.price < 1)
          break
        case "high":
          filtered = filtered.filter((product) => product.price >= 1)
          break
      }
    }

    // الترتيب
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      default:
        // relevance - keep original order
        break
    }

    setFilteredProducts(filtered)
  }, [searchQuery, sortBy, filterCategory, priceRange])

  const categories = [...new Set(allProducts.map((p) => p.category))]

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">البحث في المنتجات</h1>
              <p className="text-gray-600 mt-1">
                {searchQuery ? `نتائج البحث عن: "${searchQuery}"` : "تصفح جميع المنتجات"}
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">العودة للرئيسية</Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mb-6">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="search"
              placeholder="ابحث عن المنتجات..."
              className="pr-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  ترتيب حسب
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("relevance")}>الأكثر صلة</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-low")}>السعر: من الأقل للأعلى</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-high")}>السعر: من الأعلى للأقل</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("rating")}>الأعلى تقييماً</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("newest")}>الأحدث</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  الفئة
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterCategory("all")}>جميع الفئات</DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem key={category} onClick={() => setFilterCategory(category)}>
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  💰 السعر
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setPriceRange("all")}>جميع الأسعار</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriceRange("low")}>أقل من 0.1 Pi</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriceRange("medium")}>0.1 - 1 Pi</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriceRange("high")}>أكثر من 1 Pi</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Badge variant="secondary">{filteredProducts.length} منتج</Badge>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 py-8">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-xl transition-shadow group overflow-hidden">
                <div className="relative">
                  <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-6xl opacity-50">📦</span>
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
                    <ShoppingCart className="h-4 w-4 ml-2" />
                    أضف إلى السلة
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">لم يتم العثور على نتائج</h3>
            <p className="text-gray-600">جرب البحث بكلمات مختلفة أو تغيير الفلاتر</p>
          </div>
        )}
      </div>
    </div>
  )
}
