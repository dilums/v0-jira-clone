"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CalendarDays, TrendingUp, Clock, Target, Zap, Award, ArrowRight, Plus, BarChart3, List } from "lucide-react"
import { DonutChart } from "@/components/ui/donut-chart"
import { issues } from "@/lib/issues"
import { projects } from "@/lib/projects"
import { people } from "@/lib/people"
import { getCurrentUser } from "@/lib/current-user"
import { getPersonById } from "@/lib/people"
import { getProjectById } from "@/lib/projects"
import { getIssuesByAssignee } from "@/lib/issues"

export default function Dashboard() {
  const [chartView, setChartView] = useState<"donut" | "list">("donut")
  const currentUser = getCurrentUser()
  const myIssues = getIssuesByAssignee(currentUser.id)

  // Calculate dashboard metrics from actual data
  const issuesByStatus = {
    todo: issues.filter((issue) => issue.status === "To Do").length,
    inProgress: issues.filter((issue) => issue.status === "In Progress").length,
    done: issues.filter((issue) => issue.status === "Done").length,
    blocked: issues.filter((issue) => issue.status === "Blocked").length,
  }

  const totalIssues = issues.length
  const activeProjects = projects.filter((project) => project.status === "Active").length
  const teamMembers = people.length

  // Get my recent issues (now showing more)
  const myRecentIssues = myIssues.slice(0, 5)

  // Get upcoming project deadlines
  const upcomingDeadlines = projects
    .filter((project) => project.status === "Active" || project.status === "Planning")
    .map((project) => ({
      project: project.name,
      deadline: project.endDate,
      daysLeft: Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
    }))
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 3)

  // Team activity (mock data based on recent issue updates)
  const teamActivity = issues
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4)
    .map((issue) => {
      const assignee = getPersonById(issue.assigneeId)
      const project = getProjectById(issue.projectId)
      return {
        user: assignee?.name || "Unknown",
        avatar: assignee?.imageURL || "/placeholder.svg",
        action: "updated",
        target: issue.title,
        project: project?.name || "Unknown Project",
        time: new Date(issue.updatedAt).toLocaleDateString(),
      }
    })

  const completionRate = totalIssues > 0 ? Math.round((issuesByStatus.done / totalIssues) * 100) : 0

  // Data for donut chart
  const chartData = [
    { name: "To Do", value: issuesByStatus.todo, color: "#6b7280" },
    { name: "In Progress", value: issuesByStatus.inProgress, color: "#3b82f6" },
    { name: "Done", value: issuesByStatus.done, color: "#10b981" },
    { name: "Blocked", value: issuesByStatus.blocked, color: "#ef4444" },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {currentUser.name.split(" ")[0]}! 👋</h1>
            <p className="text-blue-100 mt-1">Here's what's happening with your projects today.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Quick Create
            </Button>
            <Avatar className="h-12 w-12 border-2 border-white">
              <AvatarImage src={currentUser.imageURL || "/placeholder.svg"} />
              <AvatarFallback>
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">My Issues</CardTitle>
            <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{myIssues.length}</div>
            <p className="text-xs text-blue-600 dark:text-blue-300">
              {myIssues.filter((i) => i.status === "Done").length} completed this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">Active Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{activeProjects}</div>
            <p className="text-xs text-green-600 dark:text-green-300">2 launching this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200">Team Velocity</CardTitle>
            <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">32</div>
            <p className="text-xs text-purple-600 dark:text-purple-300">Story points this sprint</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-200">Completion Rate</CardTitle>
            <Award className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{completionRate}%</div>
            <p className="text-xs text-orange-600 dark:text-orange-300">+5% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Recent Work */}
        <Card className="dark:bg-zinc-900 dark:border-zinc-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="dark:text-gray-100">My Recent Work</CardTitle>
                <CardDescription className="dark:text-gray-400">Issues you're currently working on</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="dark:hover:bg-zinc-800">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {myRecentIssues.length > 0 ? (
              myRecentIssues.map((issue) => {
                const project = getProjectById(issue.projectId)
                return (
                  <div
                    key={issue.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        issue.status === "Done"
                          ? "bg-green-500"
                          : issue.status === "In Progress"
                            ? "bg-blue-500"
                            : issue.status === "Blocked"
                              ? "bg-red-500"
                              : "bg-gray-400"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm dark:text-gray-100">{issue.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{project?.name}</p>
                    </div>
                    <Badge variant="outline" className="text-xs dark:border-zinc-600">
                      {issue.status}
                    </Badge>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No issues assigned to you</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Activity */}
        <Card className="dark:bg-zinc-900 dark:border-zinc-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="dark:text-gray-100">Team Activity</CardTitle>
                <CardDescription className="dark:text-gray-400">Recent updates from your team</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="dark:hover:bg-zinc-800">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm dark:text-gray-100">
                    <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                    <span className="font-medium text-blue-600 dark:text-blue-400">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.project} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Overview with Chart Toggle */}
        <Card className="dark:bg-zinc-900 dark:border-zinc-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="dark:text-gray-100">Project Status Overview</CardTitle>
                <CardDescription className="dark:text-gray-400">Current status across all projects</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={chartView === "donut" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartView("donut")}
                  className="dark:border-zinc-600"
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={chartView === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartView("list")}
                  className="dark:border-zinc-600"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {chartView === "donut" ? (
              <div className="space-y-4">
                <DonutChart data={chartData} size={200} strokeWidth={20} />
                <div className="grid grid-cols-2 gap-4">
                  {chartData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm dark:text-gray-300">{item.name}</span>
                      <Badge variant="secondary" className="ml-auto dark:bg-zinc-700">
                        {item.value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-sm dark:text-gray-300">To Do</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
                      <div
                        className="bg-gray-400 h-2 rounded-full"
                        style={{ width: `${(issuesByStatus.todo / totalIssues) * 100}%` }}
                      ></div>
                    </div>
                    <Badge variant="secondary" className="dark:bg-zinc-700">
                      {issuesByStatus.todo}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm dark:text-gray-300">In Progress</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(issuesByStatus.inProgress / totalIssues) * 100}%` }}
                      ></div>
                    </div>
                    <Badge variant="default">{issuesByStatus.inProgress}</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm dark:text-gray-300">Done</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(issuesByStatus.done / totalIssues) * 100}%` }}
                      ></div>
                    </div>
                    <Badge variant="outline" className="dark:border-zinc-600">
                      {issuesByStatus.done}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm dark:text-gray-300">Blocked</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${(issuesByStatus.blocked / totalIssues) * 100}%` }}
                      ></div>
                    </div>
                    <Badge variant="destructive">{issuesByStatus.blocked}</Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="dark:bg-zinc-900 dark:border-zinc-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="dark:text-gray-100">Upcoming Deadlines</CardTitle>
                <CardDescription className="dark:text-gray-400">Projects requiring attention</CardDescription>
              </div>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingDeadlines.length > 0 ? (
              upcomingDeadlines.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <CalendarDays className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium text-sm dark:text-gray-100">{item.project}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(item.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={item.daysLeft < 30 ? "destructive" : item.daysLeft < 60 ? "default" : "secondary"}>
                    {item.daysLeft > 0 ? `${item.daysLeft} days` : "Overdue"}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No upcoming deadlines</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
