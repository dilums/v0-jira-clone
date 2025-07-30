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
  Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Planning: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Archived: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage and track all your projects</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Project
        </Button>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-lg border border-gray-200 dark:border-zinc-800">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
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
                <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full dark:bg-zinc-900 dark:border-zinc-800 relative">
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-md"
                    style={{ backgroundColor: project.color }}
                  />
                  <CardHeader className="pl-5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-3">
                          <img
                            src={project.imageURL || "/placeholder.svg"}
                            alt={project.name}
                            className="w-8 h-8 object-contain"
                          />
                          <CardTitle className="text-lg dark:text-white">{project.name}</CardTitle>
                        </div>
                        <Badge
                          variant="secondary"
                          className={statusColors[project.status as keyof typeof statusColors]}
                        >
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2 dark:text-gray-400">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-5">
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
                              <span className="text-gray-600 dark:text-gray-400">{owner.name}</span>
                            </>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs dark:border-zinc-600">
                          {project.team}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
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

                      <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: project.color,
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
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-zinc-800 font-medium text-sm text-gray-600 dark:text-gray-400">
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
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: project.color }} />
                  <div className="col-span-4 pl-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={project.imageURL || "/placeholder.svg"}
                        alt={project.name}
                        className="w-6 h-6 object-contain"
                      />
                      <div>
                        <h3 className="font-medium dark:text-white">{project.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{project.description}</p>
                      </div>
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
                        <span className="text-sm dark:text-gray-300">{owner.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm dark:text-gray-300">{new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            backgroundColor: project.color,
                            width: `${progress}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{progress}%</span>
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
          <p className="text-gray-500 dark:text-gray-400">No projects found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
