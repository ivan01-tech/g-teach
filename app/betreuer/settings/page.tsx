"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { Save, Bell, Shield, Globe } from "lucide-react"

export default function BetreuerSettingsPage() {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    bookingNotifications: true,
    messageNotifications: true,
    profileVisible: true,
    instantBooking: false,
  })

  const handleSave = async () => {
    setSaving(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and notifications
        </p>
      </div>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account
          </CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ""}
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Contact support to change your email address
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="flex gap-2">
              <Input
                id="password"
                type="password"
                value="••••••••"
                disabled
              />
              <Button variant="outline">Change</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Configure how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive email updates about your account
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                setSettings((s) => ({ ...s, emailNotifications: checked }))
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Booking Notifications</p>
              <p className="text-sm text-muted-foreground">
                Get notified when students book lessons
              </p>
            </div>
            <Switch
              checked={settings.bookingNotifications}
              onCheckedChange={(checked) =>
                setSettings((s) => ({ ...s, bookingNotifications: checked }))
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Message Notifications</p>
              <p className="text-sm text-muted-foreground">
                Get notified when you receive new messages
              </p>
            </div>
            <Switch
              checked={settings.messageNotifications}
              onCheckedChange={(checked) =>
                setSettings((s) => ({ ...s, messageNotifications: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Profile Visibility
          </CardTitle>
          <CardDescription>Control how students find you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Profile Visible</p>
              <p className="text-sm text-muted-foreground">
                Allow students to find your profile in search
              </p>
            </div>
            <Switch
              checked={settings.profileVisible}
              onCheckedChange={(checked) =>
                setSettings((s) => ({ ...s, profileVisible: checked }))
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Instant Booking</p>
              <p className="text-sm text-muted-foreground">
                Allow students to book without approval
              </p>
            </div>
            <Switch
              checked={settings.instantBooking}
              onCheckedChange={(checked) =>
                setSettings((s) => ({ ...s, instantBooking: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}
