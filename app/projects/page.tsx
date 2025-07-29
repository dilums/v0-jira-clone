"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Search, Grid, List, Calendar, Users } from "lucide-react"
import { projects } from "@/lib/projects"
import { getPersonById } from "@/lib/people"
import { getIssuesByProject } from "@/lib/issues"

const statusColors = {
  Active: "bg-green-100 text-green-800",
  Planning: "bg-blue-100 text-blue-800",
  Archived: "bg-gray-100 text-gray-800",
}

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-2">Manage and track all your projects</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Project
        </Button>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
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
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Planning">Planning</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const owner = getPersonById(project.ownerId)
            const projectIssues = getIssuesByProject(project.id)
            const openIssues = projectIssues.filter((issue) => issue.status !== "Done").length
            const totalIssues = projectIssues.length

            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <Badge
                          variant="secondary"
                          className={statusColors[project.status as keyof typeof statusColors]}
                        >
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          {owner && (
                            <>
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={owner.imageURL || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs">
                                  {owner.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-gray-600">{owner.name}</span>
                            </>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {project.team}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(project.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>
                            {openIssues}/{totalIssues} issues
                          </span>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: totalIssues > 0 ? `${((totalIssues - openIssues) / totalIssues) * 100}%` : "0%",
                          }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-sm text-gray-600">
            <div className="col-span-4">Project</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Owner</div>
            <div className="col-span-2">Due Date</div>
            <div className="col-span-2">Progress</div>
          </div>
          {filteredProjects.map((project) => {
            const owner = getPersonById(project.ownerId)
            const projectIssues = getIssuesByProject(project.id)
            const openIssues = projectIssues.filter((issue) => issue.status !== "Done").length
            const totalIssues = projectIssues.length
            const progress = totalIssues > 0 ? Math.round(((totalIssues - openIssues) / totalIssues) * 100) : 0

            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <div className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 cursor-pointer">
                  <div className="col-span-4">
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-1">{project.description}</p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Badge variant="secondary" className={statusColors[project.status as keyof typeof statusColors]}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    {owner && (
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={owner.imageURL || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {owner.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{owner.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm">{new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-600">{progress}%</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No projects found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
