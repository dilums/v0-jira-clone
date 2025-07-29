"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"

const roles = [
  {
    name: "Admin",
    description: "Full access to all features and settings",
    permissions: ["Create Projects", "Manage Users", "Delete Issues", "Access Settings"],
    users: 2,
  },
  {
    name: "Member",
    description: "Standard user with project access",
    permissions: ["Create Issues", "Edit Issues", "Comment", "View Projects"],
    users: 12,
  },
  {
    name: "Viewer",
    description: "Read-only access to projects",
    permissions: ["View Projects", "View Issues", "Comment"],
    users: 3,
  },
]

export default function RolesSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Roles & Permissions</CardTitle>
            <CardDescription>Configure user roles and their permissions</CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {roles.map((role, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{role.name}</h3>
                      <Badge variant="secondary">{role.users} users</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{role.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {role.permissions.map((permission, pIndex) => (
                        <Badge key={pIndex} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
