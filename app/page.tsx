"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ShoppingCart, User, Menu, Star, Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
  {
    id: 7,
    name: "الأيباد والتابلت",
    icon: "📱",
    count: 180,
    image: "/placeholder.svg?height=200&width=200&text=أيباد+وتابلت",
  },
  {
    id: 8,
    name: "الساعات الذكية",
    icon: "⌚",
    count: 220,
    image: "/placeholder.svg?height=200&width=200&text=ساعات+ذكية",
  },
  {
    id: 9,
    name: "السيارات",
    icon: "🚗",
    count: 150,
    image: "/placeholder.svg?height=200&width=200&text=سيارات",
  },
  {
    id: 10,
    name: "الدراجات النارية",
    icon: "🏍️",
    count: 95,
    image: "/placeholder.svg?height=200&width=200&text=دراجات+نارية",
  },
  {
    id: 11,
    name: "الأدوات المنزلية",
    icon: "🏠",
    count: 780,
    image: "/placeholder.svg?height=200&width=200&text=أدوات+منزلية",
  },
  {
    id: 12,
    name: "الإكسسوارات",
    icon: "💍",
    count: 340,
    image: "/placeholder.svg?height=200&width=200&text=إكسسوارات",
  },
]

const featuredProducts = [
  {
    id: 1,
    name: "آيفون 15 برو ماكس",
    price: 3.82, // $1,200 ÷ 314,159 = 0.00382 Pi
    originalPrice: 4.77, // $1,500 ÷ 314,159 = 0.00477 Pi
    marketPrice: "$1,200", // السعر في الأسواق
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
    price: 2.55, // $800 ÷ 314,159 = 0.00255 Pi
    originalPrice: 3.18, // $1,000 ÷ 314,159 = 0.00318 Pi
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
    name: "ساعة أبل الذكية سيريز 9",
    price: 1.27, // $400 ÷ 314,159 = 0.00127 Pi
    originalPrice: 1.59, // $500 ÷ 314,159 = 0.00159 Pi
    marketPrice: "$400",
    image: "/placeholder.svg?height=300&width=300&text=ساعة+أبل+الذكية",
    rating: 4.9,
    reviews: 203,
    category: "الساعات الذكية",
    discount: 20,
    isNew: true,
  },
  {
    id: 4,
    name: "تويوتا كامري 2024",
    price: 79.58, // $25,000 ÷ 314,159 = 0.07958 Pi
    originalPrice: 95.5, // $30,000 ÷ 314,159 = 0.09550 Pi
    marketPrice: "$25,000",
    image: "/placeholder.svg?height=300&width=300&text=تويوتا+كامري",
    rating: 4.7,
    reviews: 45,
    category: "السيارات",
    discount: 17,
    isNew: true,
  },
  {
    id: 5,
    name: "ثوب رجالي فاخر",
    price: 0.16, // $50 ÷ 314,159 = 0.00016 Pi
    originalPrice: 0.22, // $70 ÷ 314,159 = 0.00022 Pi
    marketPrice: "$50",
    image: "/placeholder.svg?height=300&width=300&text=ثوب+رجالي+فاخر",
    rating: 4.5,
    reviews: 67,
    category: "الملابس الرجالية",
    discount: 29,
    isNew: false,
  },
  {
    id: 6,
    name: "عباية نسائية أنيقة",
    price: 0.19, // $60 ÷ 314,159 = 0.00019 Pi
    originalPrice: 0.25, // $80 ÷ 314,159 = 0.00025 Pi
    marketPrice: "$60",
    image: "/placeholder.svg?height=300&width=300&text=عباية+نسائية",
    rating: 4.8,
    reviews: 156,
    category: "الملابس النسائية",
    discount: 25,
    isNew: false,
  },
  {
    id: 7,
    name: "سامسونج جالاكسي S24",
    price: 2.86, // $900 ÷ 314,159 = 0.00286 Pi
    originalPrice: 3.5, // $1,100 ÷ 314,159 = 0.00350 Pi
    marketPrice: "$900",
    image: "/placeholder.svg?height=300&width=300&text=سامسونج+جالاكسي",
    rating: 4.7,
    reviews: 98,
    category: "الجوالات والهواتف",
    discount: 18,
    isNew: true,
  },
  {
    id: 8,
    name: "أيباد برو 12.9 إنش",
    price: 3.5, // $1,100 ÷ 314,159 = 0.00350 Pi
    originalPrice: 4.14, // $1,300 ÷ 314,159 = 0.00414 Pi
    marketPrice: "$1,100",
    image: "/placeholder.svg?height=300&width=300&text=أيباد+برو",
    rating: 4.8,
    reviews: 145,
    category: "الأيباد والتابلت",
    discount: 15,
    isNew: true,
  },
]

export default function YemenMarketHomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-red-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-red-600">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-reverse space-x-4">
              <div className="relative w-14 h-14 overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg?height=100&width=100&text=شعار+سوق+اليمن"
                  alt="شعار سوق اليمن الدولي"
                  width={56}
                  height={56}
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">سوق اليمن الدولي</h1>
                <p className="text-sm text-gray-600">خدمات لا متناهية لتسهيل حياتك</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="ابحث عن المنتجات..."
                  className="pl-12 pr-4 py-3 text-right border-2 border-gray-200 focus:border-red-500"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
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
                  <DropdownMenuItem>تسجيل الدخول</DropdownMenuItem>
                  <DropdownMenuItem>إنشاء حساب</DropdownMenuItem>
                  <DropdownMenuItem>طلباتي</DropdownMenuItem>
                  <DropdownMenuItem>الإعدادات</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="ابحث عن المنتجات..."
                className="pl-12 pr-4 py-3 text-right border-2 border-gray-200 focus:border-red-500"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 via-red-700 to-green-600 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/placeholder.svg?height=600&width=1200&text=صورة+رئيسية+لسوق+اليمن+الدولي"
            alt="سوق اليمن الدولي"
            fill
            className="object-cover opacity-20"
          />
        </div>
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
              <Card
                key={category.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden"
              >
                <div className="relative h-40">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <h4 className="font-bold text-lg">{category.name}</h4>
                      <p className="text-sm opacity-90">{category.count.toLocaleString()} منتج</p>
                    </div>
                  </div>
                </div>
              </Card>
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
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
                  />
                  {product.discount > 0 && (
                    <Badge className="absolute top-4 right-4 bg-red-500 text-white">خصم {product.discount}%</Badge>
                  )}
                  {product.isNew && <Badge className="absolute top-4 left-4 bg-green-500 text-white">جديد</Badge>}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-reverse space-x-2">
                      <Button size="icon" variant="secondary" className="rounded-full">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="secondary" className="rounded-full">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
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
                <CardFooter className="p-6 pt-0">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">أضف إلى السلة</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/placeholder.svg?height=400&width=1200&text=صورة+ترويجية+لسوق+اليمن"
            alt="عروض خاصة"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/80 to-green-600/80"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-2xl">
            <h3 className="text-3xl font-bold mb-4">عروض خاصة لفترة محدودة</h3>
            <p className="text-lg mb-6">استفد من خصومات تصل إلى 50% على مجموعة مختارة من المنتجات الفاخرة</p>
            <Button className="bg-white text-red-600 hover:bg-gray-100">تسوق العروض الآن</Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h4 className="text-xl font-bold mb-2">شحن سريع ومجاني</h4>
              <p className="text-gray-600">توصيل مجاني لجميع أنحاء اليمن خلال 3-5 أيام عمل</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h4 className="text-xl font-bold mb-2">دفع آمن</h4>
              <p className="text-gray-600">نظام دفع آمن ومشفر عبر شبكة باي نتورك</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎧</span>
              </div>
              <h4 className="text-xl font-bold mb-2">دعم فني 24/7</h4>
              <p className="text-gray-600">فريق دعم متاح على مدار الساعة عبر الهاتف والواتساب</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-reverse space-x-3 mb-4">
                <div className="relative w-12 h-12 overflow-hidden rounded-full">
                  <Image
                    src="/placeholder.svg?height=100&width=100&text=شعار+سوق+اليمن"
                    alt="شعار سوق اليمن الدولي"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <h5 className="text-xl font-bold">سوق اليمن الدولي</h5>
              </div>
              <p className="text-gray-300 mb-4">
                نقدم أفضل المنتجات بأسعار تناسب المجتمع اليمني مع ضمان الجودة والخدمة المتميزة
              </p>
              <div className="flex space-x-reverse space-x-4">
                <Button variant="ghost" size="icon" className="text-white hover:text-red-400">
                  <span className="text-xl">📘</span>
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:text-green-400">
                  <span className="text-xl">📱</span>
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:text-pink-400">
                  <span className="text-xl">📷</span>
                </Button>
              </div>
            </div>
            <div>
              <h6 className="font-bold mb-4">روابط سريعة</h6>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white">
                    من نحن
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    اتصل بنا
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    الشروط والأحكام
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    سياسة الخصوصية
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-bold mb-4">خدمة العملاء</h6>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white">
                    مركز المساعدة
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    تتبع الطلب
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    الإرجاع والاستبدال
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    الأسئلة الشائعة
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-bold mb-4">تواصل معنا</h6>
              <div className="space-y-2 text-gray-300">
                <p>📞 +967 1 234 567</p>
                <p>📧 info@yemenmarket.com</p>
                <p>📍 صنعاء، اليمن</p>
                <p>💰 1 Pi = 314,159$</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 سوق اليمن الدولي. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
