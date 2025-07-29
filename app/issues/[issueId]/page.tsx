"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Edit, MessageSquare, Clock, Calendar, BarChart3 } from "lucide-react"
import { getIssueById } from "@/lib/issues"
import { getPersonById } from "@/lib/people"
import { getProjectById } from "@/lib/projects"

const priorityColors = {
  Low: "bg-gray-100 text-gray-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-orange-100 text-orange-800",
  Critical: "bg-red-100 text-red-800",
}

const statusColors = {
  "To Do": "bg-gray-100 text-gray-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Blocked: "bg-red-100 text-red-800",
  Done: "bg-green-100 text-green-800",
}

export default function IssueDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const issueId = params.issueId as string

  const issue = getIssueById(issueId)

  if (!issue) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Issue not found</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  const assignee = getPersonById(issue.assigneeId)
  const project = getProjectById(issue.projectId)

  // Mock comments data
  const comments = [
    {
      id: "1",
      author: assignee?.name || "Unknown",
      avatar: assignee?.imageURL || "/placeholder.svg",
      content: "I've started working on this issue. Will update the progress soon.",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      author: "Product Manager",
      avatar: "/placeholder.svg",
      content: "Please make sure to follow the design specifications in Figma.",
      timestamp: "1 day ago",
    },
  ]

  // Mock activity data
  const activity = [
    { action: "Status changed", details: "from To Do to In Progress", timestamp: "2 hours ago" },
    { action: "Issue created", details: "by Product Manager", timestamp: "3 days ago" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">{issue.title}</h1>
            <Badge variant="secondary" className={statusColors[issue.status as keyof typeof statusColors]}>
              {issue.status}
            </Badge>
            <Badge variant="secondary" className={priorityColors[issue.priority as keyof typeof priorityColors]}>
              {issue.priority}
            </Badge>
          </div>
          {project && (
            <p className="text-gray-600 mt-1">
              <span className="font-medium">{project.name}</span> • Issue #{issue.id.slice(0, 8)}
            </p>
          )}
        </div>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Issue
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{issue.description}</p>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="comments" className="space-y-4">
            <TabsList>
              <TabsTrigger value="comments" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Comments ({comments.length})</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Activity</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comments" className="space-y-4">
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {comment.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-sm">{comment.author}</span>
                            <span className="text-xs text-gray-500">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <Textarea placeholder="Add a comment..." rows={3} />
                    <div className="flex justify-end">
                      <Button size="sm">Add Comment</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <div className="space-y-4">
                {activity.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{item.action}</span> {item.details}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{item.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Issue Details */}
          <Card>
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <Select defaultValue={issue.status}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Blocked">Blocked</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Priority</label>
                <Select defaultValue={issue.priority}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Story Points</label>
                <Select defaultValue={issue.storyPoints.toString()}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
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
            </CardContent>
          </Card>

          {/* Assignee */}
          <Card>
            <CardHeader>
              <CardTitle>Assignee</CardTitle>
            </CardHeader>
            <CardContent>
              {assignee ? (
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={assignee.imageURL || "/placeholder.svg"} />
                    <AvatarFallback>
                      {assignee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{assignee.name}</p>
                    <p className="text-sm text-gray-600">{assignee.role}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Unassigned</p>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Created:</span>
                <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Updated:</span>
                <span>{new Date(issue.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <BarChart3 className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Story Points:</span>
                <Badge variant="outline">{issue.storyPoints}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
