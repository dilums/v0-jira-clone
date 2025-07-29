"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const integrations = [
  { name: "Slack", description: "Get notifications in Slack", connected: true, icon: "💬" },
  { name: "GitHub", description: "Link commits to issues", connected: false, icon: "🐙" },
  { name: "Discord", description: "Team communication", connected: true, icon: "🎮" },
  { name: "Figma", description: "Design collaboration", connected: false, icon: "🎨" },
  { name: "Google Drive", description: "File storage", connected: false, icon: "📁" },
  { name: "Zoom", description: "Video meetings", connected: true, icon: "📹" },
]

export default function IntegrationsSettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    mentions: true,
    updates: false,
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>Connect with external tools and services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{integration.icon}</div>
                      <div>
                        <h3 className="font-semibold">{integration.name}</h3>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                      </div>
                    </div>
                    <Button variant={integration.connected ? "outline" : "default"} className="w-full">
                      {integration.connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose how you want to be notified</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-gray-600">Receive updates via email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={notifications.email}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-gray-600">Browser push notifications</p>
            </div>
            <Switch
              id="push-notifications"
              checked={notifications.push}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, push: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="mention-notifications">Mentions</Label>
              <p className="text-sm text-gray-600">When someone mentions you</p>
            </div>
            <Switch
              id="mention-notifications"
              checked={notifications.mentions}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, mentions: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="update-notifications">Project Updates</Label>
              <p className="text-sm text-gray-600">Status changes and updates</p>
            </div>
            <Switch
              id="update-notifications"
              checked={notifications.updates}
              onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, updates: checked }))}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
