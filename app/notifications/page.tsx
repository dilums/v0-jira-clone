"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Check, Trash2, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Notification {
  id: string
  title: string
  description: string
  type: "critical" | "high" | "medium" | "low"
  read: boolean
  timestamp: string
  avatar?: string
  category: "project" | "issue" | "comment" | "system"
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Project deadline approaching",
    description: "Marketing Site Redesign is due in 2 days. 3 issues still pending.",
    type: "critical",
    read: false,
    timestamp: "2 hours ago",
    avatar: "/placeholder-user.jpg",
    category: "project",
  },
  {
    id: "2",
    title: "New issue assigned to you",
    description: "Fix broken login redirect flow has been assigned to you by Lucy Pearl.",
    type: "high",
    read: false,
    timestamp: "4 hours ago",
    avatar: "/placeholder-user.jpg",
    category: "issue",
  },
  {
    id: "3",
    title: "Comment on your issue",
    description: "Miles Parker commented on 'Implement drag-and-drop on Kanban'",
    type: "medium",
    read: true,
    timestamp: "6 hours ago",
    avatar: "/placeholder-user.jpg",
    category: "comment",
  },
  {
    id: "4",
    title: "Code review requested",
    description: "Your pull request for dashboard improvements needs review.",
    type: "medium",
    read: false,
    timestamp: "8 hours ago",
    avatar: "/placeholder-user.jpg",
    category: "issue",
  },
  {
    id: "5",
    title: "Sprint planning meeting",
    description: "Sprint planning meeting scheduled for tomorrow at 10:00 AM.",
    type: "low",
    read: true,
    timestamp: "1 day ago",
    avatar: "/placeholder-user.jpg",
    category: "system",
  },
  {
    id: "6",
    title: "System maintenance scheduled",
    description: "Scheduled maintenance on Sunday 2:00 AM - 4:00 AM EST.",
    type: "low",
    read: true,
    timestamp: "2 days ago",
    category: "system",
  },
  {
    id: "7",
    title: "Issue status changed",
    description: "QA regression on mobile filters moved to 'In Progress'",
    type: "medium",
    read: true,
    timestamp: "3 days ago",
    avatar: "/placeholder-user.jpg",
    category: "issue",
  },
  {
    id: "8",
    title: "New team member added",
    description: "Sarah Johnson has been added to the Development team.",
    type: "low",
    read: true,
    timestamp: "1 week ago",
    category: "system",
  },
]

const getTypeColor = (type: string) => {
  switch (type) {
    case "critical":
      return "bg-red-500"
    case "high":
      return "bg-orange-500"
    case "medium":
      return "bg-yellow-500"
    case "low":
      return "bg-blue-500"
    default:
      return "bg-gray-500"
  }
}

const getTypeBadgeVariant = (type: string) => {
  switch (type) {
    case "critical":
      return "destructive"
    case "high":
      return "secondary"
    case "medium":
      return "outline"
    case "low":
      return "secondary"
    default:
      return "secondary"
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const filteredNotifications = notifications.filter((notif) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !notif.read) ||
      (filter === "read" && notif.read) ||
      notif.category === filter

    const matchesSearch =
      search === "" ||
      notif.title.toLowerCase().includes(search.toLowerCase()) ||
      notif.description.toLowerCase().includes(search.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Stay updated with your project activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {unreadCount} unread
          </Badge>
          <Button onClick={markAllAsRead} variant="outline" size="sm">
            <Check className="h-4 w-4 mr-2" />
            Mark all read
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              All Notifications
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search notifications..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="project">Projects</SelectItem>
                  <SelectItem value="issue">Issues</SelectItem>
                  <SelectItem value="comment">Comments</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No notifications found</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                    notification.read
                      ? "bg-gray-50 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800"
                      : "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${getTypeColor(notification.type)}`} />
                    {notification.avatar && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3
                          className={`font-medium ${notification.read ? "text-gray-700 dark:text-gray-300" : "text-gray-900 dark:text-white"}`}
                        >
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={getTypeBadgeVariant(notification.type)} className="text-xs">
                            {notification.type}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{notification.timestamp}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
