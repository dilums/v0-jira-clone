"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Mail, MapPin, Clock } from "lucide-react"
import { people } from "@/lib/people"

const teamColors = {
  dev: "bg-blue-100 text-blue-800",
  design: "bg-purple-100 text-purple-800",
  product: "bg-green-100 text-green-800",
  qa: "bg-orange-100 text-orange-800",
  marketing: "bg-pink-100 text-pink-800",
}

export default function PeoplePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [teamFilter, setTeamFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")

  const filteredPeople = people.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTeam = teamFilter === "all" || person.team === teamFilter
    const matchesRole = roleFilter === "all" || person.role === roleFilter
    return matchesSearch && matchesTeam && matchesRole
  })

  const uniqueRoles = [...new Set(people.map((person) => person.role))]
  const uniqueTeams = [...new Set(people.map((person) => person.team))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">People</h1>
          <p className="text-gray-600 mt-2">Connect with your team members</p>
        </div>
        <Button>Invite People</Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search people..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        <Select value={teamFilter} onValueChange={setTeamFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            {uniqueTeams.map((team) => (
              <SelectItem key={team} value={team}>
                {team.charAt(0).toUpperCase() + team.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {uniqueRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* People Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPeople.map((person) => (
          <Link key={person.id} href={`/people/${person.id}`}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={person.imageURL || "/placeholder.svg"} />
                      <AvatarFallback>
                        {person.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{person.name}</h3>
                      <p className="text-gray-600 text-sm">{person.role}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{person.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{person.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>
                        {person.workingHours.start} - {person.workingHours.end} {person.workingHours.timezone}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className={teamColors[person.team as keyof typeof teamColors]}>
                      {person.team}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">Online</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">{person.bio}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredPeople.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No people found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
