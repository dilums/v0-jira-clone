"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

const webhooks = [
  {
    url: "https://slack.com/webhook/123",
    events: ["issue.created", "issue.updated"],
    status: "Active",
  },
  {
    url: "https://discord.com/webhook/456",
    events: ["project.created"],
    status: "Inactive",
  },
]

export default function WebhooksSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Webhooks</CardTitle>
            <CardDescription>Configure webhooks for external integrations</CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Webhook
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input id="webhook-url" placeholder="https://your-app.com/webhook" />
            </div>
            <div>
              <Label htmlFor="webhook-events">Events</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="issue.created">Issue Created</SelectItem>
                  <SelectItem value="issue.updated">Issue Updated</SelectItem>
                  <SelectItem value="project.created">Project Created</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <h4 className="font-medium">Existing Webhooks</h4>
            {webhooks.map((webhook, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{webhook.url}</p>
                  <div className="flex space-x-2 mt-1">
                    {webhook.events.map((event, eIndex) => (
                      <Badge key={eIndex} variant="outline" className="text-xs">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={webhook.status === "Active" ? "default" : "secondary"}>{webhook.status}</Badge>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
