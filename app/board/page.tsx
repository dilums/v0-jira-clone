"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Filter, Search } from "lucide-react"
import { issues as initialIssues } from "@/lib/issues"
import { getPersonById } from "@/lib/people"
import { getProjectById } from "@/lib/projects"
import { useRouter } from "next/navigation"

const columns = [
  { id: "todo", title: "To Do", status: "To Do" },
  { id: "inprogress", title: "In Progress", status: "In Progress" },
  { id: "blocked", title: "Blocked", status: "Blocked" },
  { id: "done", title: "Done", status: "Done" },
]

const priorityColors = {
  Low: "bg-gray-100 text-gray-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-orange-100 text-orange-800",
  Critical: "bg-red-100 text-red-800",
}

export default function KanbanBoard() {
  const [issues, setIssues] = useState(initialIssues)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProject, setSelectedProject] = useState("all")
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const router = useRouter()

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProject = selectedProject === "all" || issue.projectId === selectedProject
    return matchesSearch && matchesProject
  })

  const getIssuesByStatus = (status: string) => {
    return filteredIssues.filter((issue) => issue.status === status)
  }

  const uniqueProjects = [...new Set(issues.map((issue) => issue.projectId))]

  const handleDragStart = (e: React.DragEvent, issueId: string) => {
    setDraggedItem(issueId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()

    if (draggedItem) {
      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue.id === draggedItem ? { ...issue, status: newStatus, updatedAt: new Date().toISOString() } : issue,
        ),
      )
      setDraggedItem(null)
    }
  }

  const handleDoubleClick = (issueId: string) => {
    router.push(`/issues/${issueId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
          <p className="text-gray-600 mt-2">Manage your team's work with visual boards</p>
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
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {uniqueProjects.map((projectId) => {
              const project = getProjectById(projectId)
              return project ? (
                <SelectItem key={projectId} value={projectId}>
                  {project.name}
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

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {columns.map((column) => {
          const columnIssues = getIssuesByStatus(column.status)
          return (
            <div
              key={column.id}
              className="bg-gray-50 rounded-lg p-4 min-h-[500px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <Badge variant="secondary">{columnIssues.length}</Badge>
              </div>

              <div className="space-y-3">
                {columnIssues.map((issue) => {
                  const assignee = getPersonById(issue.assigneeId)
                  const project = getProjectById(issue.projectId)

                  return (
                    <Card
                      key={issue.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={(e) => handleDragStart(e, issue.id)}
                      onDoubleClick={() => handleDoubleClick(issue.id)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm leading-tight">{issue.title}</h4>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${priorityColors[issue.priority as keyof typeof priorityColors]}`}
                            >
                              {issue.priority}
                            </Badge>
                          </div>

                          <p className="text-xs text-gray-600 line-clamp-2">{issue.description}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {assignee && (
                                <>
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={assignee.imageURL || "/placeholder.svg"} />
                                    <AvatarFallback className="text-xs">
                                      {assignee.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs text-gray-600">{assignee.name}</span>
                                </>
                              )}
                            </div>

                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {issue.storyPoints} pts
                              </Badge>
                            </div>
                          </div>

                          {project && <div className="text-xs text-gray-500">{project.name}</div>}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {columnIssues.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No issues in {column.title.toLowerCase()}</p>
                    <p className="text-xs mt-1">Drop issues here</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-sm text-gray-500 text-center">
        <p>💡 Drag and drop issues between columns to change their status</p>
        <p>Double-click an issue to view details</p>
      </div>
    </div>
  )
}
