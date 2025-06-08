"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Home, Search, ShoppingCart, Heart, User, Bell, Settings, Package, CreditCard, LogOut } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function BottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [cartCount, setCartCount] = useState(0)
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [notificationsCount, setNotificationsCount] = useState(3)
  const [user, setUser] = useState<any>(null)
  const [language, setLanguage] = useState("ar")

  useEffect(() => {
    // محاكاة عدد العناصر في السلة والمفضلة
    try {
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]")
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
      setCartCount(cartItems.length)
      setFavoritesCount(favorites.length)

      // الحصول على بيانات المستخدم
      const userData = localStorage.getItem("user")
      if (userData) {
        setUser(JSON.parse(userData))
      }

      // الحصول على اللغة المحفوظة
      const savedLanguage = localStorage.getItem("language") || "ar"
      setLanguage(savedLanguage)
    } catch (error) {
      console.error("Error loading counts:", error)
    }
  }, [pathname])

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  const changeLanguage = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    // في التطبيق الحقيقي، هنا سيتم تغيير اللغة باستخدام مكتبة i18n
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-area-padding">
      <div className="flex justify-around items-center py-2">
        <Link href="/" className="flex flex-col items-center">
          <div className={`p-2 rounded-full ${isActive("/") ? "bg-red-100 text-red-600" : "text-gray-500"}`}>
            <Home className="h-6 w-6" />
          </div>
          <span className={`text-xs ${isActive("/") ? "text-red-600 font-medium" : "text-gray-500"}`}>الرئيسية</span>
        </Link>

        <Link href="/search" className="flex flex-col items-center">
          <div className={`p-2 rounded-full ${isActive("/search") ? "bg-red-100 text-red-600" : "text-gray-500"}`}>
            <Search className="h-6 w-6" />
          </div>
          <span className={`text-xs ${isActive("/search") ? "text-red-600 font-medium" : "text-gray-500"}`}>البحث</span>
        </Link>

        <Link href="/cart" className="flex flex-col items-center">
          <div
            className={`p-2 rounded-full ${isActive("/cart") ? "bg-red-100 text-red-600" : "text-gray-500"} relative`}
          >
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className={`text-xs ${isActive("/cart") ? "text-red-600 font-medium" : "text-gray-500"}`}>السلة</span>
        </Link>

        <Link href="/favorites" className="flex flex-col items-center">
          <div
            className={`p-2 rounded-full ${
              isActive("/favorites") ? "bg-red-100 text-red-600" : "text-gray-500"
            } relative`}
          >
            <Heart className="h-6 w-6" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className={`text-xs ${isActive("/favorites") ? "text-red-600 font-medium" : "text-gray-500"}`}>
            المفضلة
          </span>
        </Link>

        {/* Profile with Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex flex-col items-center cursor-pointer">
              <div
                className={`p-2 rounded-full ${isActive("/profile") ? "bg-red-100 text-red-600" : "text-gray-500"} relative`}
              >
                <User className="h-6 w-6" />
                {notificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notificationsCount}
                  </span>
                )}
              </div>
              <span className={`text-xs ${isActive("/profile") ? "text-red-600 font-medium" : "text-gray-500"}`}>
                حسابي
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 mb-2">
            {user ? (
              <>
                <div className="px-3 py-2 border-b">
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>

                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="h-4 w-4 ml-2" />
                  الملف الشخصي
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push("/orders")}>
                  <Package className="h-4 w-4 ml-2" />
                  طلباتي
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push("/transactions")}>
                  <CreditCard className="h-4 w-4 ml-2" />
                  المعاملات
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Bell className="h-4 w-4 ml-2" />
                      <span>الإشعارات</span>
                    </div>
                    {notificationsCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {notificationsCount}
                      </Badge>
                    )}
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <Settings className="h-4 w-4 ml-2" />
                  الإعدادات
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <div className="flex items-center justify-between w-full">
                    <span>اللغة:</span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant={language === "ar" ? "default" : "outline"}
                        className="h-6 text-xs px-2"
                        onClick={() => changeLanguage("ar")}
                      >
                        ع
                      </Button>
                      <Button
                        size="sm"
                        variant={language === "en" ? "default" : "outline"}
                        className="h-6 text-xs px-2"
                        onClick={() => changeLanguage("en")}
                      >
                        EN
                      </Button>
                    </div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="h-4 w-4 ml-2" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={() => router.push("/auth/login")}>
                  <User className="h-4 w-4 ml-2" />
                  تسجيل الدخول
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push("/auth/register")}>
                  <User className="h-4 w-4 ml-2" />
                  إنشاء حساب
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <div className="flex items-center justify-between w-full">
                    <span>اللغة:</span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant={language === "ar" ? "default" : "outline"}
                        className="h-6 text-xs px-2"
                        onClick={() => changeLanguage("ar")}
                      >
                        ع
                      </Button>
                      <Button
                        size="sm"
                        variant={language === "en" ? "default" : "outline"}
                        className="h-6 text-xs px-2"
                        onClick={() => changeLanguage("en")}
                      >
                        EN
                      </Button>
                    </div>
                  </div>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
