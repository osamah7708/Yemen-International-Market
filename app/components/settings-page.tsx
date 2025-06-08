"use client"

import { User, Bell, Shield, LogOut } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

interface SettingsPageProps {
  user: any
  setUser: (user: any) => void
}

export default function SettingsPage({ user, setUser }: SettingsPageProps) {
  const { toast } = useToast()

  const handleLogout = () => {
    setUser(null)
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح",
    })
  }

  const handleSaveProfile = () => {
    toast({
      title: "تم حفظ البيانات",
      description: "تم تحديث معلومات الملف الشخصي",
    })
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">يرجى تسجيل الدخول</h3>
        <p className="text-gray-500">قم بتسجيل الدخول للوصول إلى الإعدادات</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">الإعدادات</h1>

      {/* معلومات الملف الشخصي */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            الملف الشخصي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input id="name" defaultValue={user.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" defaultValue={user.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input id="phone" defaultValue={user.phone} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">العنوان</Label>
              <Input id="address" placeholder="أدخل عنوانك" />
            </div>
          </div>
          <Button onClick={handleSaveProfile}>حفظ التغييرات</Button>
        </CardContent>
      </Card>

      {/* إعدادات الإشعارات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            الإشعارات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>إشعارات الطلبات</Label>
              <p className="text-sm text-gray-600">تلقي إشعارات حول حالة طلباتك</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>العروض والخصومات</Label>
              <p className="text-sm text-gray-600">تلقي إشعارات حول العروض الجديدة</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>المنتجات الجديدة</Label>
              <p className="text-sm text-gray-600">تلقي إشعارات حول المنتجات الجديدة</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* إعدادات الأمان */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            الأمان والخصوصية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            تغيير كلمة المرور
          </Button>
          <Button variant="outline" className="w-full justify-start">
            إعدادات الخصوصية
          </Button>
          <Button variant="outline" className="w-full justify-start">
            سجل تسجيل الدخول
          </Button>
        </CardContent>
      </Card>

      {/* معلومات التطبيق */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات التطبيق</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>إصدار التطبيق</span>
            <span className="text-gray-600">1.0.0</span>
          </div>
          <Separator />
          <Button variant="outline" className="w-full justify-start">
            شروط الاستخدام
          </Button>
          <Button variant="outline" className="w-full justify-start">
            سياسة الخصوصية
          </Button>
          <Button variant="outline" className="w-full justify-start">
            اتصل بنا
          </Button>
        </CardContent>
      </Card>

      {/* تسجيل الخروج */}
      <Card>
        <CardContent className="pt-6">
          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            <LogOut className="ml-2 h-4 w-4" />
            تسجيل الخروج
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
