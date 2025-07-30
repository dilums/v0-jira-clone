"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Search, Plus, Bell, Sun, Moon, Monitor, Settings, User, LogOut, Users, FolderPlus, Bug } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentUser } from "@/lib/current-user"
import { useTheme } from "next-themes"
import { projects } from "@/lib/projects"
import { people } from "@/lib/people"

// Mock notifications data
const notifications = [
  {
    id: "1",
    title: "Project deadline approaching",
    description: "Marketing Site Redesign is due in 2 days",
    type: "critical",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    title: "New issue assigned to you",
    description: "Fix broken login redirect flow",
    type: "high",
    timestamp: "4 hours ago",
    read: false,
  },
  {
    id: "3",
    title: "Comment on your issue",
    description: "Miles Parker commented on your issue",
    type: "medium",
    timestamp: "6 hours ago",
    read: true,
  },
  {
    id: "4",
    title: "Code review requested",
    description: "Your pull request needs review",
    type: "medium",
    timestamp: "8 hours ago",
    read: false,
  },
  {
    id: "5",
    title: "Sprint planning meeting",
    description: "Meeting scheduled for tomorrow",
    type: "low",
    timestamp: "1 day ago",
    read: true,
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

export default function TopNavigation() {
  const [searchQuery, setSearchQuery] = useState("")
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [newIssueOpen, setNewIssueOpen] = useState(false)
  const [newProjectOpen, setNewProjectOpen] = useState(false)
  const [newTeamOpen, setNewTeamOpen] = useState(false)
  const currentUser = getCurrentUser()
  const { theme, setTheme } = useTheme()

  const unreadCount = notifications.filter((n) => !n.read).length

  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle issue creation logic here
    setNewIssueOpen(false)
  }

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle project creation logic here
    setNewProjectOpen(false)
  }

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle team creation logic here
    setNewTeamOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left: Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">J</span>
            </div>
            <span className="font-semibold text-lg text-gray-900 dark:text-white">Jira Clone</span>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search projects, issues, people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">
          {/* Create Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setNewIssueOpen(true)}>
                <Bug className="h-4 w-4 mr-2" />
                New Issue
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setNewProjectOpen(true)}>
                <FolderPlus className="h-4 w-4 mr-2" />
                New Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setNewTeamOpen(true)}>
                <Users className="h-4 w-4 mr-2" />
                New Team
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* New Issue Dialog */}
          <Dialog open={newIssueOpen} onOpenChange={setNewIssueOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Bug className="h-5 w-5" />
                  Create New Issue
                </DialogTitle>
                <DialogDescription>Create a new issue to track work, bugs, or feature requests.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateIssue} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="issue-project">Project *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex items-center gap-2">
                              <img
                                src={project.imageURL || "/placeholder.svg"}
                                alt={project.name}
                                className="w-4 h-4"
                              />
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
                              {project.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issue-type">Issue Type *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bug">🐛 Bug</SelectItem>
                        <SelectItem value="feature">✨ Feature</SelectItem>
                        <SelectItem value="task">📋 Task</SelectItem>
                        <SelectItem value="story">📖 Story</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issue-title">Title *</Label>
                  <Input
                    id="issue-title"
                    placeholder="Enter issue title"
                    required
                    className="bg-white dark:bg-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issue-description">Description</Label>
                  <Textarea
                    id="issue-description"
                    placeholder="Describe the issue in detail..."
                    rows={4}
                    className="bg-white dark:bg-zinc-800"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="issue-priority">Priority</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">🔴 Critical</SelectItem>
                        <SelectItem value="high">🟠 High</SelectItem>
                        <SelectItem value="medium">🟡 Medium</SelectItem>
                        <SelectItem value="low">🔵 Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issue-assignee">Assignee</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Assign to..." />
                      </SelectTrigger>
                      <SelectContent>
                        {people.map((person) => (
                          <SelectItem key={person.id} value={person.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="w-4 h-4">
                                <AvatarImage src={person.imageURL || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs">
                                  {person.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              {person.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issue-points">Story Points</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Points" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="8">8</SelectItem>
                        <SelectItem value="13">13</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issue-labels">Labels</Label>
                  <Input
                    id="issue-labels"
                    placeholder="Add labels (comma separated)"
                    className="bg-white dark:bg-zinc-800"
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setNewIssueOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Issue</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* New Project Dialog */}
          <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FolderPlus className="h-5 w-5" />
                  Create New Project
                </DialogTitle>
                <DialogDescription>Set up a new project to organize your team's work.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name *</Label>
                  <Input
                    id="project-name"
                    placeholder="Enter project name"
                    required
                    className="bg-white dark:bg-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-key">Project Key *</Label>
                  <Input
                    id="project-key"
                    placeholder="e.g., PROJ"
                    required
                    className="bg-white dark:bg-zinc-800"
                    maxLength={10}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    A short identifier for your project (2-10 characters)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    placeholder="Describe your project..."
                    rows={3}
                    className="bg-white dark:bg-zinc-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-lead">Project Lead *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project lead" />
                      </SelectTrigger>
                      <SelectContent>
                        {people.map((person) => (
                          <SelectItem key={person.id} value={person.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="w-4 h-4">
                                <AvatarImage src={person.imageURL || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs">
                                  {person.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              {person.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-team">Default Team</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dev">Development</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="qa">QA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-start">Start Date</Label>
                    <Input id="project-start" type="date" className="bg-white dark:bg-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-end">Target End Date</Label>
                    <Input id="project-end" type="date" className="bg-white dark:bg-zinc-800" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-template">Project Template</Label>
                  <Select defaultValue="kanban">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kanban">📋 Kanban</SelectItem>
                      <SelectItem value="scrum">🏃 Scrum</SelectItem>
                      <SelectItem value="basic">📝 Basic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="project-public" />
                  <Label htmlFor="project-public">Make project public</Label>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setNewProjectOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Project</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* New Team Dialog */}
          <Dialog open={newTeamOpen} onOpenChange={setNewTeamOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Create New Team
                </DialogTitle>
                <DialogDescription>Create a new team to organize people and manage permissions.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name">Team Name *</Label>
                  <Input id="team-name" placeholder="Enter team name" required className="bg-white dark:bg-zinc-800" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-description">Description</Label>
                  <Textarea
                    id="team-description"
                    placeholder="Describe the team's purpose and responsibilities..."
                    rows={3}
                    className="bg-white dark:bg-zinc-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="team-lead">Team Lead *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team lead" />
                      </SelectTrigger>
                      <SelectContent>
                        {people.map((person) => (
                          <SelectItem key={person.id} value={person.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="w-4 h-4">
                                <AvatarImage src={person.imageURL || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs">
                                  {person.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              {person.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="team-type">Team Type</Label>
                    <Select defaultValue="cross-functional">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">💻 Development</SelectItem>
                        <SelectItem value="design">🎨 Design</SelectItem>
                        <SelectItem value="product">📊 Product</SelectItem>
                        <SelectItem value="marketing">📢 Marketing</SelectItem>
                        <SelectItem value="qa">🧪 QA</SelectItem>
                        <SelectItem value="cross-functional">🤝 Cross-functional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-members">Initial Members</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Add team members..." />
                    </SelectTrigger>
                    <SelectContent>
                      {people.map((person) => (
                        <SelectItem key={person.id} value={person.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-4 h-4">
                              <AvatarImage src={person.imageURL || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">
                                {person.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            {person.name} - {person.role}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    You can add more members after creating the team
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-permissions">Default Permissions</Label>
                  <Select defaultValue="member">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">🔑 Admin - Full access</SelectItem>
                      <SelectItem value="member">👤 Member - Standard access</SelectItem>
                      <SelectItem value="viewer">👁️ Viewer - Read-only access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label>Team Settings</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="team-private" />
                      <Label htmlFor="team-private">Private team</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="team-notifications" defaultChecked />
                      <Label htmlFor="team-notifications">Enable team notifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="team-calendar" defaultChecked />
                      <Label htmlFor="team-calendar">Create team calendar</Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setNewTeamOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Team</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ThemeIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="h-4 w-4 mr-2" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="h-4 w-4 mr-2" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-500">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  <Badge variant="secondary" className="text-xs">
                    {unreadCount} unread
                  </Badge>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.slice(0, 4).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer ${
                      !notification.read ? "bg-blue-50 dark:bg-blue-950/20" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${getTypeColor(notification.type)}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{notification.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{notification.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-200 dark:border-zinc-800">
                <Link href="/notifications">
                  <Button variant="ghost" className="w-full text-sm" onClick={() => setNotificationsOpen(false)}>
                    View all notifications
                  </Button>
                </Link>
              </div>
            </PopoverContent>
          </Popover>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.imageURL || "/placeholder.svg"} alt={currentUser.name} />
                  <AvatarFallback>
                    {currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/profile">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>Manage your account settings and preferences.</DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="general">General</TabsTrigger>
                      <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    </TabsList>
                    <TabsContent value="general" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <div className="flex items-center space-x-2">
                          <Switch id="dark-mode" />
                          <Label htmlFor="dark-mode">Dark mode</Label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <div className="text-sm text-gray-600 dark:text-gray-400">English (US)</div>
                      </div>
                    </TabsContent>
                    <TabsContent value="notifications" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-notifications">Email notifications</Label>
                          <Switch id="email-notifications" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="push-notifications">Push notifications</Label>
                          <Switch id="push-notifications" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="marketing-emails">Marketing emails</Label>
                          <Switch id="marketing-emails" />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
