"use client"

import { CreditCard, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface QuickPaymentCardProps {
  product: any
  onPiPayment: (product: any) => void
  onPayNetworkPayment: (product: any) => void
}

export function QuickPaymentCard({ product, onPiPayment, onPayNetworkPayment }: QuickPaymentCardProps) {
  return (
    <Card className="mt-4 border-green-200 bg-green-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-green-600" />
          خيارات الدفع السريع
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Pi Network Payment */}
        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">π</span>
            </div>
            <div>
              <p className="font-medium text-sm">Pi Network</p>
              <p className="text-xs text-gray-600">{(product.price / 1000).toFixed(2)} π</p>
            </div>
          </div>
          <Button
            size="sm"
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            onClick={() => onPiPayment(product)}
          >
            ادفع بـ Pi
          </Button>
        </div>

        {/* PayNetwork Payment */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-blue-600" />
            <div>
              <p className="font-medium text-sm">PayNetwork</p>
              <p className="text-xs text-gray-600">{product.price.toLocaleString()} ر.ي</p>
            </div>
          </div>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => onPayNetworkPayment(product)}>
            ادفع الآن
          </Button>
        </div>

        <div className="text-center">
          <Badge variant="secondary" className="text-xs">
            🔒 دفع آمن ومشفر
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
