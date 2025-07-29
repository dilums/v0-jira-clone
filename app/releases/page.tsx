"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Rocket, Search, Filter, Download, ExternalLink, Calendar, Bug, Wrench } from "lucide-react"

interface Release {
  id: string
  version: string
  releaseDate: string
  status: "released" | "beta" | "alpha" | "planned"
  fixes: number
  bugs: number
  features: number
  downloads: number
  description: string
  changelog?: string
}

const mockReleases: Release[] = [
  {
    id: "1",
    version: "v2.4.1",
    releaseDate: "2024-01-15",
    status: "released",
    fixes: 12,
    bugs: 3,
    features: 5,
    downloads: 15420,
    description: "Bug fixes and performance improvements",
    changelog: "https://github.com/company/app/releases/tag/v2.4.1",
  },
  {
    id: "2",
    version: "v2.4.0",
    releaseDate: "2024-01-08",
    status: "released",
    fixes: 8,
    bugs: 2,
    features: 12,
    downloads: 18950,
    description: "Major feature release with new dashboard",
    changelog: "https://github.com/company/app/releases/tag/v2.4.0",
  },
  {
    id: "3",
    version: "v2.3.2",
    releaseDate: "2023-12-20",
    status: "released",
    fixes: 15,
    bugs: 5,
    features: 2,
    downloads: 12340,
    description: "Critical security patches and bug fixes",
  },
  {
    id: "4",
    version: "v2.3.1",
    releaseDate: "2023-12-10",
    status: "released",
    fixes: 6,
    bugs: 1,
    features: 3,
    downloads: 9870,
    description: "Minor improvements and fixes",
  },
  {
    id: "5",
    version: "v2.3.0",
    releaseDate: "2023-11-25",
    status: "released",
    fixes: 20,
    bugs: 8,
    features: 18,
    downloads: 25600,
    description: "Major release with Kanban board improvements",
  },
  {
    id: "6",
    version: "v2.2.3",
    releaseDate: "2023-11-10",
    status: "released",
    fixes: 9,
    bugs: 2,
    features: 1,
    downloads: 8750,
    description: "Performance optimizations",
  },
  {
    id: "7",
    version: "v2.2.2",
    releaseDate: "2023-10-28",
    status: "released",
    fixes: 11,
    bugs: 4,
    features: 0,
    downloads: 7890,
    description: "Bug fixes for mobile interface",
  },
  {
    id: "8",
    version: "v2.2.1",
    releaseDate: "2023-10-15",
    status: "released",
    fixes: 7,
    bugs: 1,
    features: 2,
    downloads: 6540,
    description: "Minor updates and fixes",
  },
  {
    id: "9",
    version: "v2.2.0",
    releaseDate: "2023-09-30",
    status: "released",
    fixes: 25,
    bugs: 12,
    features: 22,
    downloads: 32100,
    description: "Major release with user management features",
  },
  {
    id: "10",
    version: "v2.5.0",
    releaseDate: "2024-02-01",
    status: "beta",
    fixes: 18,
    bugs: 6,
    features: 15,
    downloads: 450,
    description: "Beta release with AI-powered features",
  },
  {
    id: "11",
    version: "v2.6.0",
    releaseDate: "2024-03-15",
    status: "planned",
    fixes: 0,
    bugs: 0,
    features: 20,
    downloads: 0,
    description: "Planned release with advanced analytics",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "released":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "beta":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "alpha":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    case "planned":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }
}

const ITEMS_PER_PAGE = 5

export default function ReleasesPage() {
  const [releases] = useState(mockReleases)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredReleases = releases.filter((release) => {
    const matchesSearch =
      search === "" ||
      release.version.toLowerCase().includes(search.toLowerCase()) ||
      release.description.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === "all" || release.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredReleases.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedReleases = filteredReleases.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Releases</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track all product releases and their details</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Rocket className="h-4 w-4 mr-2" />
          New Release
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Release History
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search releases..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="released">Released</SelectItem>
                  <SelectItem value="beta">Beta</SelectItem>
                  <SelectItem value="alpha">Alpha</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Release Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Fixes</TableHead>
                <TableHead className="text-center">Bugs</TableHead>
                <TableHead className="text-center">Features</TableHead>
                <TableHead className="text-center">Downloads</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedReleases.map((release) => (
                <TableRow key={release.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {release.version}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {formatDate(release.releaseDate)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(release.status)}>{release.status}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Wrench className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{release.fixes}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Bug className="h-4 w-4 text-red-600" />
                      <span className="font-medium">{release.bugs}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Rocket className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{release.features}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Download className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">{formatNumber(release.downloads)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{release.description}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {release.changelog && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                      {release.status === "released" && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) setCurrentPage(currentPage - 1)
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(page)
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {filteredReleases.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Rocket className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No releases found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
