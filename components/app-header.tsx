"use client"

import Link from "next/link"

interface AppHeaderProps {
  showTitle?: boolean
  transparent?: boolean
}

export function AppHeader({ showTitle = true, transparent = false }: AppHeaderProps) {
  return (
    <header
      className={`w-full z-40 ${
        transparent ? "bg-transparent" : "bg-white shadow-sm border-b border-gray-200"
      } safe-area-padding`}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center">
          {/* Logo and Title - Centered */}
          <Link href="/" className="flex flex-col items-center text-center">
            <div className="w-16 h-16 app-logo rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl text-white">🛒</span>
            </div>
            {showTitle && (
              <div>
                <h1 className="text-3xl font-bold app-header-gradient mb-2">سوق اليمن الدولي</h1>
                <p className="text-sm app-subtitle font-medium">خدمات لامتناهية من أجل حياة أسهل</p>
              </div>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
