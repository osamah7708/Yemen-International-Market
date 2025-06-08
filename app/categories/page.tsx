"use client"

import { useState } from "react"
import { Search, Filter, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const categories = [
  {
    id: 1,
    name: "المواد الغذائية",
    icon: "🍎",
    count: 1250,
    subcategories: ["فواكه وخضروات", "لحوم ودواجن", "منتجات الألبان", "حبوب ومعلبات"],
    image: "/placeholder.svg?height=200&width=200&text=مواد+غذائية",
  },
  {
    id: 2,
    name: "الملابس الرجالية",
    icon: "👔",
    count: 890,
    subcategories: ["قمصان", "بناطيل", "أحذية", "إكسسوارات"],
    image: "/placeholder.svg?height=200&width=200&text=ملابس+رجالية",
  },
  {
    id: 3,
    name: "الملابس النسائية",
    icon: "👗",
    count: 1100,
    subcategories: ["فساتين", "بلوزات", "أحذية", "حقائب"],
    image: "/placeholder.svg?height=200&width=200&text=ملابس+نسائية",
  },
  {
    id: 4,
    name: "ملابس الأطفال",
    icon: "👶",
    count: 650,
    subcategories: ["ملابس الرضع", "ملابس الأطفال", "أحذية الأطفال", "ألعاب"],
    image: "/placeholder.svg?height=200&width=200&text=ملابس+أطفال",
  },
  {
    id: 5,
    name: "الجوالات والهواتف",
    icon: "📱",
    count: 450,
    subcategories: ["هواتف ذكية", "إكسسوارات", "شواحن", "سماعات"],
    image: "/placeholder.svg?height=200&width=200&text=جوالات",
  },
  {
    id: 6,
    name: "أجهزة الكمبيوتر",
    icon: "💻",
    count: 320,
    subcategories: ["لابتوب", "كمبيوتر مكتبي", "إكسسوارات", "برامج"],
    image: "/placeholder.svg?height=200&width=200&text=كمبيوترات",
  },
  {
    id: 7,
    name: "الأجهزة المنزلية",
    icon: "🏠",
    count: 780,
    subcategories: ["أجهزة المطبخ", "أجهزة التنظيف", "أثاث", "ديكور"],
    image: "/placeholder.svg?height=200&width=200&text=أجهزة+منزلية",
  },
  {
    id: 8,
    name: "الصحة والجمال",
    icon: "💄",
    count: 560,
    subcategories: ["مستحضرات التجميل", "العناية بالبشرة", "العطور", "المكملات"],
    image: "/placeholder.svg?height=200&width=200&text=صحة+وجمال",
  },
]

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredCategories = categories.filter(
    (category) => category.name.includes(searchTerm) || category.subcategories.some((sub) => sub.includes(searchTerm)),
  )

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">تصفح الأقسام</h1>
              <p className="text-gray-600 mt-1">اكتشف جميع المنتجات المتاحة</p>
            </div>
            <Link href="/">
              <Button variant="outline">العودة للرئيسية</Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="search"
                placeholder="ابحث في الأقسام..."
                className="pr-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-8">
        <div
          className={`grid gap-6 ${
            viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
          }`}
        >
          {filteredCategories.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden h-full">
                {viewMode === "grid" ? (
                  <>
                    <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <span className="text-6xl">{category.icon}</span>
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary">{category.count.toLocaleString()} منتج</Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-xl mb-3 text-gray-800">{category.name}</h3>
                      <div className="space-y-2">
                        {category.subcategories.slice(0, 3).map((sub, index) => (
                          <div key={index} className="text-sm text-gray-600 flex items-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full ml-2"></span>
                            {sub}
                          </div>
                        ))}
                        {category.subcategories.length > 3 && (
                          <div className="text-sm text-gray-500">+{category.subcategories.length - 3} المزيد</div>
                        )}
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">{category.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-xl text-gray-800">{category.name}</h3>
                          <Badge variant="secondary">{category.count.toLocaleString()} منتج</Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {category.subcategories.map((sub, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {sub}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">لم يتم العثور على نتائج</h3>
            <p className="text-gray-600">جرب البحث بكلمات مختلفة</p>
          </div>
        )}
      </div>
    </div>
  )
}
