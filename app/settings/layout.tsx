"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, Shield, Webhook, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const settingsTabs = [
  { id: "users", label: "Users", icon: Users, href: "/settings/users" },
  { id: "roles", label: "Roles", icon: Shield, href: "/settings/roles" },
  { id: "webhooks", label: "Webhooks", icon: Webhook, href: "/settings/webhooks" },
  { id: "integrations", label: "Integrations", icon: Zap, href: "/settings/integrations" },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your workspace settings and preferences</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {settingsTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = pathname === tab.href

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={cn(
                  "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                  isActive
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div>{children}</div>
    </div>
  )
}
