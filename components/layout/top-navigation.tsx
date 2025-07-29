"use client"

import { useState } from "react"
import { Search, Plus, Bell, Settings, User, LogOut, Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCurrentUser } from "@/lib/current-user"
import { useRouter } from "next/navigation"
import { useTheme } from "@/lib/theme-context"

const notifications = [
  {
    id: "1",
    title: "New issue assigned to you",
    description: "Fix broken login redirect flow has been assigned to you",
    time: "2 minutes ago",
    importance: "high",
    read: false,
  },
  {
    id: "2",
    title: "Project deadline approaching",
    description: "Customer Dashboard project is due in 3 days",
    time: "1 hour ago",
    importance: "critical",
    read: false,
  },
  {
    id: "3",
    title: "Comment on your issue",
    description: "John commented on 'Update user profile validation logic'",
    time: "3 hours ago",
    importance: "medium",
    read: true,
  },
  {
    id: "4",
    title: "Sprint planning meeting",
    description: "Sprint planning meeting scheduled for tomorrow at 10 AM",
    time: "1 day ago",
    importance: "low",
    read: true,
  },
  {
    id: "5",
    title: "Code review requested",
    description: "Your review is requested on PR #123",
    time: "2 days ago",
    importance: "medium",
    read: false,
  },
]

const importanceColors = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-blue-500",
}

export default function TopNavigation() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: false,
    mentions: true,
    sounds: true,
  })
  const [language, setLanguage] = useState("en")

  const router = useRouter()
  const currentUser = getCurrentUser()
  const { theme, setTheme } = useTheme()

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleProfileClick = () => {
    router.push("/profile")
  }

  const handleSettingsClick = () => {
    setSettingsOpen(true)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 h-16">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">ProjectFlow</div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search issues, projects, people..."
                className="pl-10 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="dark:border-zinc-700 bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="dark:bg-zinc-800 dark:border-zinc-700">
                <DropdownMenuItem className="dark:hover:bg-zinc-700">New Issue</DropdownMenuItem>
                <DropdownMenuItem className="dark:hover:bg-zinc-700">New Project</DropdownMenuItem>
                <DropdownMenuItem className="dark:hover:bg-zinc-700">New Team</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  {theme === "light" ? (
                    <Sun className="h-4 w-4" />
                  ) : theme === "dark" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Monitor className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="dark:bg-zinc-800 dark:border-zinc-700">
                <DropdownMenuItem onClick={() => setTheme("light")} className="dark:hover:bg-zinc-700">
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="dark:hover:bg-zinc-700">
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="dark:hover:bg-zinc-700">
                  <Monitor className="mr-2 h-4 w-4" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 dark:bg-zinc-800 dark:border-zinc-700" align="end">
                <div className="p-4 border-b dark:border-zinc-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Notifications</h3>
                    <Badge variant="secondary" className="dark:bg-zinc-700">
                      {unreadCount} new
                    </Badge>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer ${
                        !notification.read ? "bg-blue-50 dark:bg-zinc-800/50" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            importanceColors[notification.importance as keyof typeof importanceColors]
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{notification.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.description}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{notification.time}</p>
                        </div>
                        {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t dark:border-zinc-700">
                  <Button variant="ghost" className="w-full text-sm">
                    View all notifications
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={currentUser.imageURL || "/placeholder.svg"} />
                  <AvatarFallback>
                    {currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 dark:bg-zinc-800 dark:border-zinc-700">
                <div className="flex items-center space-x-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.imageURL || "/placeholder.svg"} />
                    <AvatarFallback>
                      {currentUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator className="dark:bg-zinc-700" />
                <DropdownMenuItem onClick={handleProfileClick} className="dark:hover:bg-zinc-700">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSettingsClick} className="dark:hover:bg-zinc-700">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="dark:bg-zinc-700" />
                <DropdownMenuItem className="dark:hover:bg-zinc-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-[425px] dark:bg-zinc-800 dark:border-zinc-700">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">Personal Settings</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Customize your workspace experience and preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Notifications */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium dark:text-gray-200">Notifications</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="dark:text-gray-200">
                      Email notifications
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Receive updates via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notificationSettings.email}
                    onCheckedChange={(checked) => setNotificationSettings((prev) => ({ ...prev, email: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications" className="dark:text-gray-200">
                      Push notifications
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Browser notifications</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notificationSettings.push}
                    onCheckedChange={(checked) => setNotificationSettings((prev) => ({ ...prev, push: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="mention-notifications" className="dark:text-gray-200">
                      Mentions
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">When someone mentions you</p>
                  </div>
                  <Switch
                    id="mention-notifications"
                    checked={notificationSettings.mentions}
                    onCheckedChange={(checked) => setNotificationSettings((prev) => ({ ...prev, mentions: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sound-notifications" className="dark:text-gray-200">
                      Sound alerts
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Play sounds for notifications</p>
                  </div>
                  <Switch
                    id="sound-notifications"
                    checked={notificationSettings.sounds}
                    onCheckedChange={(checked) => setNotificationSettings((prev) => ({ ...prev, sounds: checked }))}
                  />
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium dark:text-gray-200">Appearance</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="theme" className="dark:text-gray-200">
                    Theme
                  </Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="mt-1 dark:bg-zinc-700 dark:border-zinc-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-zinc-700 dark:border-zinc-600">
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language" className="dark:text-gray-200">
                    Language
                  </Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="mt-1 dark:bg-zinc-700 dark:border-zinc-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-zinc-700 dark:border-zinc-600">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Workspace */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium dark:text-gray-200">Workspace</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="dark:text-gray-200">Compact mode</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Show more content in less space</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="dark:text-gray-200">Auto-save drafts</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Automatically save your work</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setSettingsOpen(false)} className="dark:border-zinc-600">
              Cancel
            </Button>
            <Button onClick={() => setSettingsOpen(false)}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
