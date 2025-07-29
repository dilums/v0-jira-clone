"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Edit,
  Camera,
  Award,
  Target,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { getCurrentUser } from "@/lib/current-user"
import { getIssuesByAssignee } from "@/lib/issues"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const currentUser = getCurrentUser()
  const assignedIssues = getIssuesByAssignee(currentUser.id)

  // Calculate user stats
  const completedIssues = assignedIssues.filter((issue) => issue.status === "Done")
  const inProgressIssues = assignedIssues.filter((issue) => issue.status === "In Progress")
  const totalStoryPoints = assignedIssues.reduce((sum, issue) => sum + issue.storyPoints, 0)
  const completedStoryPoints = completedIssues.reduce((sum, issue) => sum + issue.storyPoints, 0)

  // Mock achievements
  const achievements = [
    { name: "Issue Resolver", description: "Completed 10+ issues", icon: "🏆", earned: true },
    { name: "Team Player", description: "Collaborated on 5+ projects", icon: "🤝", earned: true },
    { name: "Sprint Champion", description: "Completed sprint goals 3 times", icon: "🚀", earned: false },
    { name: "Bug Hunter", description: "Fixed 20+ critical bugs", icon: "🐛", earned: false },
  ]

  // Mock recent activity
  const recentActivity = [
    { action: "Completed", item: "Fix login redirect flow", time: "2 hours ago", type: "issue" },
    { action: "Updated", item: "User profile form logic", time: "1 day ago", type: "issue" },
    { action: "Commented on", item: "Dashboard performance", time: "2 days ago", type: "issue" },
    { action: "Created", item: "Mobile responsive fixes", time: "3 days ago", type: "issue" },
  ]

  const teamColors = {
    dev: "bg-blue-100 text-blue-800",
    design: "bg-purple-100 text-purple-800",
    product: "bg-green-100 text-green-800",
    qa: "bg-orange-100 text-orange-800",
    marketing: "bg-pink-100 text-pink-800",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>

        {/* Profile Info */}
        <div className="relative -mt-16 ml-6">
          <div className="flex items-end space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src={currentUser.imageURL || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Button size="sm" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">{currentUser.name}</h1>
                  <p className="text-blue-100">{currentUser.role}</p>
                </div>
                <Button variant="secondary" onClick={() => setIsEditing(!isEditing)} className="mb-4">
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? "Save" : "Edit Profile"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <Textarea defaultValue={currentUser.bio} placeholder="Tell us about yourself..." rows={4} />
              ) : (
                <p className="text-gray-700">{currentUser.bio}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  {isEditing ? <Input defaultValue={currentUser.email} /> : <span>{currentUser.email}</span>}
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  {isEditing ? <Input defaultValue={currentUser.phone} /> : <span>{currentUser.phone}</span>}
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {isEditing ? <Input defaultValue={currentUser.location} /> : <span>{currentUser.location}</span>}
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>
                    {currentUser.workingHours.start} - {currentUser.workingHours.end}{" "}
                    {currentUser.workingHours.timezone}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className={teamColors[currentUser.team as keyof typeof teamColors]}>
                  {currentUser.team} team
                </Badge>
                <div className="flex items-center space-x-2 ml-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Online</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="activity" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 mt-1">
                          {activity.type === "issue" ? (
                            <AlertCircle className="h-4 w-4 text-blue-500" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.action}</span>{" "}
                            <span className="text-blue-600">{activity.item}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 ${
                          achievement.earned
                            ? "border-yellow-200 bg-yellow-50"
                            : "border-gray-200 bg-gray-50 opacity-60"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div>
                            <h4 className="font-medium">{achievement.name}</h4>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                          </div>
                          {achievement.earned && <Award className="h-5 w-5 text-yellow-500 ml-auto" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="goals" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Complete Sprint Goals</h4>
                        <span className="text-sm text-gray-600">75%</span>
                      </div>
                      <Progress value={75} className="mb-2" />
                      <p className="text-sm text-gray-600">3 of 4 sprint goals completed</p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Story Points This Month</h4>
                        <span className="text-sm text-gray-600">60%</span>
                      </div>
                      <Progress value={60} className="mb-2" />
                      <p className="text-sm text-gray-600">18 of 30 story points completed</p>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Code Reviews</h4>
                        <span className="text-sm text-gray-600">90%</span>
                      </div>
                      <Progress value={90} className="mb-2" />
                      <p className="text-sm text-gray-600">9 of 10 reviews completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>My Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{assignedIssues.length}</div>
                  <div className="text-sm text-gray-600">Total Issues</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{completedIssues.length}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{inProgressIssues.length}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{totalStoryPoints}</div>
                  <div className="text-sm text-gray-600">Story Points</div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Completion Rate</span>
                  <span className="text-sm text-gray-600">
                    {assignedIssues.length > 0 ? Math.round((completedIssues.length / assignedIssues.length) * 100) : 0}
                    %
                  </span>
                </div>
                <Progress
                  value={assignedIssues.length > 0 ? (completedIssues.length / assignedIssues.length) * 100 : 0}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Target className="h-4 w-4 mr-2" />
                View My Issues
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <TrendingUp className="h-4 w-4 mr-2" />
                Performance Report
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
