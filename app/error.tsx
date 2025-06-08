"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">حدث خطأ!</h2>
        <p className="text-gray-600 mb-4">عذراً، حدث خطأ غير متوقع</p>
        <Button onClick={() => reset()}>المحاولة مرة أخرى</Button>
      </div>
    </div>
  )
}
