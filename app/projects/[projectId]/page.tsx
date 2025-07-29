"use client"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Calendar, Users, Settings, Activity, Plus } from "lucide-react"
import { getProjectById } from "@/lib/projects"
import { getPersonById } from "@/lib/people"
import { getIssuesByProject } from "@/lib/issues"

export default function ProjectDetailsPage() {
  const params = useParams()
  const projectId = params.projectId as string

  const project = getProjectById(projectId)

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Project not found</p>
      </div>
    )
  }

  const owner = getPersonById(project.ownerId)
  const projectIssues = getIssuesByProject(project.id)
  const completedIssues = projectIssues.filter((issue) => issue.status === "Done")
  const completionRate = projectIssues.length > 0 ? (completedIssues.length / projectIssues.length) * 100 : 0

  // Get unique assignees for this project
  const assigneeIds = [...new Set(projectIssues.map((issue) => issue.assigneeId))]
  const members = assigneeIds.map((id) => getPersonById(id)).filter(Boolean)

  // Mock recent activity based on issues
  const recentActivity = projectIssues.slice(0, 5).map((issue) => {
    const assignee = getPersonById(issue.assigneeId)
    return {
      user: assignee?.name || "Unknown",
      action: "updated issue",
      target: issue.title,
      time: new Date(issue.updatedAt).toLocaleDateString(),
    }
  })

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <Badge
              variant="secondary"
              className={
                project.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : project.status === "Planning"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
              }
            >
              {project.status}
            </Badge>
          </div>
          <p className="text-gray-600 max-w-2xl">{project.description}</p>
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{members.length} members</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Issue
          </Button>
        </div>
      </div>

      {/* Project Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-sm text-gray-600">{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {projectIssues.filter((issue) => issue.status === "To Do").length}
                </div>
                <div className="text-sm text-gray-600">To Do</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {projectIssues.filter((issue) => issue.status === "In Progress").length}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {projectIssues.filter((issue) => issue.status === "Blocked").length}
                </div>
                <div className="text-sm text-gray-600">Blocked</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {projectIssues.filter((issue) => issue.status === "Done").length}
                </div>
                <div className="text-sm text-gray-600">Done</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="issues">Issues ({projectIssues.length})</TabsTrigger>
          <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Owner</CardTitle>
              </CardHeader>
              <CardContent>
                {owner ? (
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={owner.imageURL || "/placeholder.svg"} />
                      <AvatarFallback>
                        {owner.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{owner.name}</p>
                      <p className="text-sm text-gray-600">{owner.role}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No owner assigned</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  variant="secondary"
                  className={
                    project.team === "dev"
                      ? "bg-blue-100 text-blue-800"
                      : project.team === "design"
                        ? "bg-purple-100 text-purple-800"
                        : project.team === "product"
                          ? "bg-green-100 text-green-800"
                          : project.team === "qa"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-pink-100 text-pink-800"
                  }
                >
                  {project.team}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="issues" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Project Issues</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Issue
            </Button>
          </div>
          <div className="space-y-4">
            {projectIssues.map((issue) => {
              const assignee = getPersonById(issue.assigneeId)
              return (
                <Card key={issue.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">{issue.title}</h4>
                        <p className="text-sm text-gray-600">{issue.description}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{issue.status}</Badge>
                          <Badge
                            variant="secondary"
                            className={
                              issue.priority === "Critical"
                                ? "bg-red-100 text-red-800"
                                : issue.priority === "High"
                                  ? "bg-orange-100 text-orange-800"
                                  : issue.priority === "Medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                            }
                          >
                            {issue.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {issue.storyPoints} pts
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {assignee ? `Assigned to ${assignee.name}` : "Unassigned"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            {projectIssues.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No issues found for this project</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Team Members</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={member.imageURL || "/placeholder.svg"} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {members.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                <p>No team members assigned to this project</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Activity className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
