"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Kanban,
  FolderOpen,
  Users,
  Settings,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Bell,
  Rocket,
  Target,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Kanban, label: "Kanban Board", href: "/board" },
  { icon: FolderOpen, label: "Projects", href: "/projects" },
  { icon: AlertCircle, label: "Issues", href: "/issues" },
  { icon: Users, label: "People", href: "/people" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Rocket, label: "Releases", href: "/releases" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

// Mock sprint data
const currentSprint = {
  name: "Sprint 24",
  startDate: "2024-01-15",
  endDate: "2024-01-29",
  daysTotal: 14,
  daysRemaining: 5,
  progress: 64, // percentage
}

export default function LeftSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const getProgressColor = (daysRemaining: number, daysTotal: number) => {
    const ratio = daysRemaining / daysTotal
    if (ratio > 0.5) return "bg-green-500"
    if (ratio > 0.25) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getEncouragingMessage = (daysRemaining: number) => {
    if (daysRemaining > 7) return "Great pace! 🚀"
    if (daysRemaining > 3) return "Keep it up! 💪"
    if (daysRemaining > 1) return "Final push! ⚡"
    return "Last day! 🎯"
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 transition-all duration-300 z-40 flex flex-col",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-end p-4">
          <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="dark:hover:bg-zinc-800">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600 dark:border-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800",
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Sprint Progress Section */}
        {!collapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-sm text-blue-900 dark:text-blue-100">{currentSprint.name}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-700 dark:text-blue-300">{currentSprint.daysRemaining} days left</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">{currentSprint.progress}%</span>
                  </div>

                  <Progress value={currentSprint.progress} className="h-2 bg-blue-100 dark:bg-blue-900" />

                  <div className="text-center">
                    <span className="text-xs font-medium text-blue-800 dark:text-blue-200">
                      {getEncouragingMessage(currentSprint.daysRemaining)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Collapsed Sprint Indicator */}
        {collapsed && (
          <div className="p-2 border-t border-gray-200 dark:border-zinc-800">
            <div className="flex flex-col items-center gap-1">
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <div className="w-8 bg-blue-100 dark:bg-blue-900 rounded-full h-1">
                <div
                  className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${currentSprint.progress}%` }}
                />
              </div>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                {currentSprint.daysRemaining}d
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
