"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Wallet } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // محاكاة عملية تسجيل الدخول
    setTimeout(() => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "user_" + Date.now(),
          email: formData.email,
          name: "مستخدم تجريبي",
          piWallet: "GAHPCOE5XS2PBFUVTPXF5IR3AZ5ASESD4FZZAGAH425WTZKLPNHY7FW4",
        }),
      )
      setIsLoading(false)
      router.push("/")
    }, 1500)
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-50 to-red-50 flex items-center justify-center p-4"
      dir="rtl"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-600 to-green-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl text-white">🛒</span>
          </div>
          <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
          <p className="text-gray-600">مرحباً بك في سوق اليمن الدولي</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  className="pr-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  className="pr-10 pl-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              <ArrowRight className="mr-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">أو</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" type="button">
              <Wallet className="ml-2 h-4 w-4" />
              تسجيل الدخول بـ Pi Network
            </Button>
          </div>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              ليس لديك حساب؟{" "}
              <Link href="/auth/register" className="text-red-600 hover:underline font-medium">
                إنشاء حساب جديد
              </Link>
            </p>
            <Link href="/auth/forgot-password" className="text-sm text-gray-500 hover:underline">
              نسيت كلمة المرور؟
            </Link>
          </div>

          <div className="mt-6">
            <Badge variant="outline" className="w-full justify-center text-green-600 border-green-600">
              ✓ دفع آمن بعملة Pi Network
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
