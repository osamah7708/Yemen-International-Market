import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">الصفحة غير موجودة</h2>
        <p className="text-gray-600 mb-4">عذراً، لا يمكن العثور على الصفحة المطلوبة</p>
        <Link href="/">
          <Button>العودة للرئيسية</Button>
        </Link>
      </div>
    </div>
  )
}
