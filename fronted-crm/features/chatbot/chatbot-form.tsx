"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"
import { Textarea } from "@/shared/components/ui/textarea"
import { useToast } from "@/shared/components/ui/use-toast"

export default function ChatbotForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Mock chatbot settings
  const [settings, setSettings] = useState({
    isActive: true,
    name: "KChido Chatbot",
    welcomeMessage: "Bienvenido!",
    phoneNumber: "+1 (555) 123-4567",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Success",
        description: "Chatbot settings updated successfully.",
      })
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-lg font-medium">Chatbot Status</h3>
          <p className="text-sm text-muted-foreground">
            {settings.isActive
              ? "Su chatbot está activo y responde consultas"
              : "Su chatbot está inactivo"}
          </p>
        </div>
        <Switch
          checked={settings.isActive}
          onCheckedChange={(checked) => setSettings({ ...settings, isActive: checked })}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Chatbot Name</Label>
        <Input
          id="name"
          value={settings.name}
          onChange={(e) => setSettings({ ...settings, name: e.target.value })}
          disabled={true}
          placeholder="Enter chatbot name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          value={settings.phoneNumber}
          onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
          disabled={true}
          placeholder="Enter phone number"
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isLoading}>
          Save Changes
        </Button>
      </div>
    </form>
  )
}
