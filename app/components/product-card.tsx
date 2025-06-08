"use client"

import { Star, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// أضف استيراد QuickPaymentCard:
import { QuickPaymentCard } from "./quick-payment-card"

// أضف state لإظهار خيارات الدفع:
import { useState } from "react"

interface ProductCardProps {
  product: {
    id: number
    name: string
    price: number
    originalPrice?: number
    image: string
    rating: number
    reviews: number
    description: string
    inStock: boolean
  }
  onAddToCart: (product: any) => void
  onBuyNow: (product: any) => void
}

export function ProductCard({ product, onAddToCart, onBuyNow }: ProductCardProps) {
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleQuickPiPayment = (product) => {
    onBuyNow(product)
  }

  const handleQuickPayNetworkPayment = (product) => {
    onBuyNow(product)
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="relative mb-4">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          {discount > 0 && <Badge className="absolute top-2 right-2 bg-red-500">-{discount}%</Badge>}
          {!product.inStock && <Badge className="absolute top-2 left-2 bg-gray-500">نفد المخزون</Badge>}
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

          <div className="flex items-center gap-2">
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
            <span className="text-sm text-gray-600">({product.reviews})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-green-600">{product.price.toLocaleString()} ر.ي</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">{product.originalPrice.toLocaleString()} ر.ي</span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="w-full space-y-2">
          <Button className="w-full" onClick={() => onAddToCart(product)} disabled={!product.inStock} variant="outline">
            <ShoppingCart className="ml-2 h-4 w-4" />
            {product.inStock ? "إضافة للسلة" : "غير متوفر"}
          </Button>

          {product.inStock && (
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => setShowPaymentOptions(!showPaymentOptions)}
            >
              💳 خيارات الدفع السريع
            </Button>
          )}
        </div>

        {showPaymentOptions && product.inStock && (
          <QuickPaymentCard
            product={product}
            onPiPayment={handleQuickPiPayment}
            onPayNetworkPayment={handleQuickPayNetworkPayment}
          />
        )}
      </CardFooter>
    </Card>
  )
}
