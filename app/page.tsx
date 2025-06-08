"use client"

import { useState, useEffect } from "react"
import { Search, ShoppingCart, User, Menu, Home, Package, Settings, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { ProductCard } from "./components/product-card"
import { AuthModal } from "./components/auth-modal"
import { CartSheet } from "./components/cart-sheet"
import OrdersPage from "./components/orders-page"
import SettingsPage from "./components/settings-page"
import { PaymentModal } from "./components/payment-modal"
import { ErrorLogger } from "./utils/error-logger"

const categories = [
  { id: "food", name: "المواد الغذائية", icon: "🍎" },
  { id: "cleaning", name: "مواد التنظيف", icon: "🧽" },
  { id: "luxury", name: "المنتجات الكمالية", icon: "💎" },
  { id: "daily", name: "المنتجات اليومية", icon: "🛒" },
  { id: "emergency", name: "المنتجات الطارئة", icon: "🚨" },
]

const sampleProducts = [
  {
    id: 1,
    name: "أرز بسمتي فاخر",
    price: 2500,
    originalPrice: 3000,
    image: "/placeholder.svg?height=200&width=200",
    category: "food",
    rating: 4.5,
    reviews: 128,
    description: "أرز بسمتي عالي الجودة مستورد من الهند",
    inStock: true,
    quantity: 50,
  },
  {
    id: 2,
    name: "منظف متعدد الاستخدامات",
    price: 800,
    originalPrice: 1000,
    image: "/placeholder.svg?height=200&width=200",
    category: "cleaning",
    rating: 4.2,
    reviews: 89,
    description: "منظف قوي وآمن لجميع الأسطح",
    inStock: true,
    quantity: 30,
  },
  {
    id: 3,
    name: "ساعة ذكية رياضية",
    price: 15000,
    originalPrice: 18000,
    image: "/placeholder.svg?height=200&width=200",
    category: "luxury",
    rating: 4.8,
    reviews: 256,
    description: "ساعة ذكية مقاومة للماء مع مراقب صحي",
    inStock: false,
    quantity: 0,
  },
]

export default function YemenMarketApp() {
  const [currentPage, setCurrentPage] = useState("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredProducts, setFilteredProducts] = useState(sampleProducts)
  const [cart, setCart] = useState([])
  const [user, setUser] = useState(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const { toast } = useToast()
  // أضف state جديد للمنتج المحدد للشراء المباشر:
  const [selectedProductForBuyNow, setSelectedProductForBuyNow] = useState(null)

  useEffect(() => {
    filterProducts()
  }, [searchQuery, selectedCategory])

  const filterProducts = () => {
    let filtered = sampleProducts

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredProducts(filtered)
  }

  const addToCart = (product) => {
    try {
      if (!product.inStock) {
        toast({
          title: "المنتج غير متوفر",
          description: "هذا المنتج غير متوفر حالياً",
          variant: "destructive",
        })
        return
      }

      const existingItem = cart.find((item) => item.id === product.id)
      if (existingItem) {
        setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
      } else {
        setCart([...cart, { ...product, quantity: 1 }])
      }

      toast({
        title: "تم إضافة المنتج",
        description: `تم إضافة ${product.name} إلى السلة`,
      })

      ErrorLogger.logInfo("Product added to cart", { productId: product.id, productName: product.name })
    } catch (error) {
      ErrorLogger.logError("Failed to add product to cart", error, { productId: product.id })
      toast({
        title: "خطأ في إضافة المنتج",
        description: "حدث خطأ أثناء إضافة المنتج إلى السلة",
        variant: "destructive",
      })
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId))
    toast({
      title: "تم حذف المنتج",
      description: "تم حذف المنتج من السلة",
    })
  }

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
      return
    }

    setCart(cart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleCheckout = () => {
    if (!user) {
      setIsAuthModalOpen(true)
      return
    }

    if (cart.length === 0) {
      toast({
        title: "السلة فارغة",
        description: "يرجى إضافة منتجات إلى السلة أولاً",
        variant: "destructive",
      })
      return
    }

    setIsPaymentModalOpen(true)
  }

  // أضف دالة للشراء المباشر:
  const handleBuyNow = (product) => {
    if (!user) {
      setIsAuthModalOpen(true)
      return
    }

    setSelectedProductForBuyNow(product)
    setIsPaymentModalOpen(true)

    ErrorLogger.logInfo("Buy now initiated", { productId: product.id, productName: product.name })
  }

  const renderContent = () => {
    switch (currentPage) {
      case "orders":
        return <OrdersPage user={user} />
      case "settings":
        return <SettingsPage user={user} setUser={setUser} />
      default:
        return (
          <div className="space-y-6">
            {/* البحث والفلترة */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="ابحث عن المنتجات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("all")}
                    className="whitespace-nowrap"
                  >
                    جميع الفئات
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.id)}
                      className="whitespace-nowrap"
                    >
                      {category.icon} {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* عرض المنتجات */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} onBuyNow={handleBuyNow} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد منتجات</h3>
                <p className="text-gray-500">لم يتم العثور على منتجات تطابق البحث</p>
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* الهيدر */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <nav className="space-y-4 mt-8">
                    <Button
                      variant={currentPage === "home" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setCurrentPage("home")}
                    >
                      <Home className="ml-2 h-4 w-4" />
                      الرئيسية
                    </Button>
                    {user && (
                      <>
                        <Button
                          variant={currentPage === "orders" ? "default" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => setCurrentPage("orders")}
                        >
                          <Package className="ml-2 h-4 w-4" />
                          طلباتي
                        </Button>
                        <Button
                          variant={currentPage === "settings" ? "default" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => setCurrentPage("settings")}
                        >
                          <Settings className="ml-2 h-4 w-4" />
                          الإعدادات
                        </Button>
                      </>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>

              <h1 className="text-xl font-bold text-green-600">سوق اليمن الدولي</h1>
            </div>

            <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
              <Button variant={currentPage === "home" ? "default" : "ghost"} onClick={() => setCurrentPage("home")}>
                <Home className="ml-2 h-4 w-4" />
                الرئيسية
              </Button>
              {user && (
                <>
                  <Button
                    variant={currentPage === "orders" ? "default" : "ghost"}
                    onClick={() => setCurrentPage("orders")}
                  >
                    <Package className="ml-2 h-4 w-4" />
                    طلباتي
                  </Button>
                  <Button
                    variant={currentPage === "settings" ? "default" : "ghost"}
                    onClick={() => setCurrentPage("settings")}
                  >
                    <Settings className="ml-2 h-4 w-4" />
                    الإعدادات
                  </Button>
                </>
              )}
            </nav>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => setIsCartOpen(true)} className="relative">
                <ShoppingCart className="h-4 w-4" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {cart.length}
                  </Badge>
                )}
              </Button>

              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{user.name}</span>
                  <Button variant="outline" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsAuthModalOpen(true)}>
                  <LogIn className="ml-2 h-4 w-4" />
                  تسجيل الدخول
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderContent()}</main>

      {/* المودالات */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={setUser} />

      <CartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
        totalPrice={getTotalPrice()}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false)
          setSelectedProductForBuyNow(null)
        }}
        cart={selectedProductForBuyNow ? [{ ...selectedProductForBuyNow, quantity: 1 }] : cart}
        totalPrice={selectedProductForBuyNow ? selectedProductForBuyNow.price : getTotalPrice()}
        user={user}
        onPaymentSuccess={() => {
          if (!selectedProductForBuyNow) {
            setCart([])
          }
          setIsPaymentModalOpen(false)
          setSelectedProductForBuyNow(null)
          toast({
            title: "تم الدفع بنجاح",
            description: "تم تأكيد طلبك وسيتم التواصل معك قريباً",
          })
        }}
      />
    </div>
  )
}
