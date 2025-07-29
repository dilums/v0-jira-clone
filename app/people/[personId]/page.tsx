"use client"

import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, MapPin, Clock, Activity } from "lucide-react"
import { getPersonById } from "@/lib/people"
import { getIssuesByAssignee } from "@/lib/issues"
import { getProjectById } from "@/lib/projects"

export default function PersonDetailsPage() {
  const params = useParams()
  const personId = params.personId as string

  const person = getPersonById(personId)

  if (!person) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Person not found</p>
      </div>
    )
  }

  const assignedIssues = getIssuesByAssignee(person.id)

  // Generate recent activity based on assigned issues
  const recentActivity = assignedIssues.slice(0, 5).map((issue) => ({
    action: "Updated issue",
    target: issue.title,
    time: new Date(issue.updatedAt).toLocaleDateString(),
  }))

  const teamColors = {
    dev: "bg-blue-100 text-blue-800",
    design: "bg-purple-100 text-purple-800",
    product: "bg-green-100 text-green-800",
    qa: "bg-orange-100 text-orange-800",
    marketing: "bg-pink-100 text-pink-800",
  }

  return (
    <div className="space-y-6">
      {/* Person Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={person.imageURL || "/placeholder.svg"} />
              <AvatarFallback className="text-2xl">
                {person.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{person.name}</h1>
                <p className="text-xl text-gray-600">{person.role}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{person.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{person.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{person.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>
                    {person.workingHours.start} - {person.workingHours.end} {person.workingHours.timezone}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className={teamColors[person.team as keyof typeof teamColors]}>
                  {person.team}
                </Badge>
                <div className="flex items-center space-x-2 ml-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Online</span>
                </div>
              </div>

              <p className="text-gray-700">{person.bio}</p>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline">Message</Button>
              <Button>Schedule Meeting</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="issues" className="space-y-6">
        <TabsList>
          <TabsTrigger value="issues">Assigned Issues ({assignedIssues.length})</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Assigned Issues</h3>
            <Badge variant="secondary">{assignedIssues.length} issues</Badge>
          </div>
          <div className="space-y-4">
            {assignedIssues.map((issue) => {
              const project = getProjectById(issue.projectId)
              return (
                <Card key={issue.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
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
                          {project && <span className="text-sm text-gray-600">{project.name}</span>}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            {assignedIssues.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No issues assigned to this person</p>
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
                    {activity.action} <span className="font-medium">{activity.target}</span>
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

        <TabsContent value="teams" className="space-y-6">
          <h3 className="text-lg font-semibold">Team Memberships</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium capitalize">{person.team} Team</h4>
                    <p className="text-sm text-gray-600">Active member</p>
                  </div>
                  <Badge variant="secondary" className={teamColors[person.team as keyof typeof teamColors]}>
                    {person.team}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
