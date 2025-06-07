"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Wallet, ExternalLink, QrCode } from "lucide-react"
import { PI_WALLET_ADDRESS } from "@/lib/pi-payment"
import { toast } from "sonner"

export function PiWalletInfo() {
  const [showQR, setShowQR] = useState(false)

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(PI_WALLET_ADDRESS)
    toast.success("تم نسخ عنوان المحفظة")
  }

  const openPiExplorer = () => {
    window.open(`https://pi.network/wallet/${PI_WALLET_ADDRESS}`, "_blank")
  }

  return (
    <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wallet className="h-5 w-5 text-yellow-600" />
          معلومات محفظة Pi Network
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">عنوان محفظة المتجر:</label>
          <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
            <code className="flex-1 text-xs font-mono break-all text-gray-800">{PI_WALLET_ADDRESS}</code>
            <Button size="sm" variant="outline" onClick={copyWalletAddress} className="shrink-0">
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowQR(!showQR)} className="flex-1">
            <QrCode className="h-4 w-4 mr-1" />
            {showQR ? "إخفاء QR" : "عرض QR"}
          </Button>
          <Button size="sm" variant="outline" onClick={openPiExplorer} className="flex-1">
            <ExternalLink className="h-4 w-4 mr-1" />
            عرض في Pi Explorer
          </Button>
        </div>

        {showQR && (
          <div className="text-center p-4 bg-white rounded-lg border">
            <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
              <QrCode className="h-16 w-16 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">QR Code لعنوان المحفظة</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            ✓ محفظة موثقة
          </Badge>
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            ✓ دفع آمن
          </Badge>
          <Badge variant="outline" className="text-purple-600 border-purple-600">
            ✓ معاملات سريعة
          </Badge>
        </div>

        <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
          <strong>ملاحظة:</strong> جميع المدفوعات تتم عبر شبكة Pi Network الآمنة. تأكد من أن لديك رصيد كافٍ في محفظة Pi
          الخاصة بك قبل إتمام عملية الشراء.
        </div>
      </CardContent>
    </Card>
  )
}
