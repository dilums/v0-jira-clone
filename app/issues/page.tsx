"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Search, Filter, Calendar, User } from "lucide-react"
import { issues } from "@/lib/issues"
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

export default function IssuesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState("all")

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter
    const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter
    const matchesAssignee = assigneeFilter === "all" || issue.assigneeId === assigneeFilter
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
  })

  const uniqueStatuses = [...new Set(issues.map((issue) => issue.status))]
  const uniquePriorities = [...new Set(issues.map((issue) => issue.priority))]
  const uniqueAssignees = [...new Set(issues.map((issue) => issue.assigneeId))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Issues</h1>
          <p className="text-gray-600 mt-2">Track and manage all project issues</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Issue
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {uniqueStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            {uniquePriorities.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            {uniqueAssignees.map((assigneeId) => {
              const assignee = getPersonById(assigneeId)
              return assignee ? (
                <SelectItem key={assigneeId} value={assigneeId}>
                  {assignee.name}
                </SelectItem>
              ) : null
            })}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Issues List */}
      <div className="space-y-6">
        {filteredIssues.map((issue) => {
          const assignee = getPersonById(issue.assigneeId)
          const project = getProjectById(issue.projectId)

          return (
            <Link key={issue.id} href={`/issues/${issue.id}`} className='block' >
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">{issue.title}</h3>
                          <p className="text-gray-600 text-sm line-clamp-2">{issue.description}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Badge
                            variant="secondary"
                            className={priorityColors[issue.priority as keyof typeof priorityColors]}
                          >
                            {issue.priority}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={statusColors[issue.status as keyof typeof statusColors]}
                          >
                            {issue.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          {assignee && (
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={assignee.imageURL || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs">
                                  {assignee.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span>{assignee.name}</span>
                            </div>
                          )}
                          {project && (
                            <div className="flex items-center space-x-1">
                              <span className="font-medium">{project.name}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-4">
                          <Badge variant="outline" className="text-xs">
                            {issue.storyPoints} pts
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(issue.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {filteredIssues.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No issues found matching your criteria.</p>
        </div>
      )}

      <div className="text-sm text-gray-500 text-center">
        <p>
          Showing {filteredIssues.length} of {issues.length} issues
        </p>
      </div>
    </div>
  )
}
