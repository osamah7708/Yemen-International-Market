"use client"

import { useState, useEffect } from "react"
import { User, Edit, Wallet, Phone, Mail, MapPin, Save, Copy, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    piWallet: "",
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setFormData({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
        address: parsedUser.address || "",
        piWallet: parsedUser.piWallet || "",
      })
    } else {
      router.push("/auth/login")
    }
  }, [router])

  const handleSave = () => {
    const updatedUser = { ...user, ...formData }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
    setIsEditing(false)
  }

  const copyWalletAddress = async () => {
    if (user.piWallet) {
      try {
        await navigator.clipboard.writeText(user.piWallet)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (err) {
        console.error("Failed to copy wallet address:", err)
      }
    }
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
    <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
      {/* Header */}
      <AppHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>المعلومات الشخصية</CardTitle>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  className="gap-2"
                >
                  {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  {isEditing ? "حفظ" : "تعديل"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      الاسم الكامل
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="أدخل اسمك الكامل"
                      />
                    ) : (
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{user.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      البريد الإلكتروني
                    </label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="أدخل بريدك الإلكتروني"
                      />
                    ) : (
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{user.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      رقم الهاتف
                    </label>
                    {isEditing ? (
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="أدخل رقم هاتفك"
                      />
                    ) : (
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{user.phone || "غير محدد"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      العنوان
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="أدخل عنوانك"
                      />
                    ) : (
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{user.address || "غير محدد"}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    عنوان محفظة Pi Network
                    <Badge variant="outline" className="text-xs">
                      مطلوب للدفع
                    </Badge>
                  </label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={formData.piWallet}
                        onChange={(e) => setFormData({ ...formData, piWallet: e.target.value })}
                        placeholder="أدخل عنوان محفظة Pi الخاصة بك (مثال: GAHPCOE5XS2PBFUVTPXF5IR3AZ5ASESD4FZZAGAH425WTZKLPNHY7FW4)"
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500">
                        هذا العنوان سيتم استخدامه لاستقبال مدفوعات Pi عند الشراء من التطبيق
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {user.piWallet ? (
                        <div className="flex items-center gap-2">
                          <p className="text-gray-800 bg-gray-50 p-3 rounded-lg font-mono text-sm break-all flex-1">
                            {user.piWallet}
                          </p>
                          <Button variant="outline" size="sm" onClick={copyWalletAddress} className="gap-2">
                            {isCopied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {isCopied ? "تم النسخ" : "نسخ"}
                          </Button>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                          <p className="text-yellow-800 text-sm">
                            لم يتم إضافة عنوان محفظة Pi. يرجى إضافة عنوان محفظتك لتتمكن من استقبال المدفوعات.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>الإجراءات السريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/orders">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    📦 طلباتي
                  </Button>
                </Link>
                <Link href="/favorites">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    ❤️ المفضلة
                  </Button>
                </Link>
                <Link href="/cart">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    🛒 سلة التسوق
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start gap-2">
                  ⚙️ الإعدادات
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إحصائيات الحساب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">إجمالي الطلبات</span>
                  <Badge variant="secondary">12</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">المنتجات المفضلة</span>
                  <Badge variant="secondary">8</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">نقاط الولاء</span>
                  <Badge variant="secondary">245</Badge>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`border-2 ${user.piWallet ? "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50" : "border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50"}`}
            >
              <CardHeader>
                <CardTitle className={user.piWallet ? "text-green-800" : "text-yellow-800"}>محفظة Pi Network</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl mb-2">{user.piWallet ? "✅" : "⚠️"}</div>
                  <p className={`text-sm ${user.piWallet ? "text-green-700" : "text-yellow-700"}`}>
                    {user.piWallet ? "محفظة متصلة وجاهزة للاستقبال" : "لم يتم ربط محفظة"}
                  </p>
                  {user.piWallet ? (
                    <Badge className="mt-2 bg-green-500">✓ موثقة وجاهزة</Badge>
                  ) : (
                    <Badge className="mt-2 bg-yellow-500">⚠️ مطلوب إضافة محفظة</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
