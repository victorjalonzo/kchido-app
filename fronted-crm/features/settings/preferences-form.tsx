"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"
import { useToast } from "@/shared/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { useTheme } from "next-themes"
import { Moon, Sun, Monitor } from "lucide-react"

export default function PreferencesForm() {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)

  // Mock preferences data
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    timezone: "utc",
    language: "es",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Success",
        description: "Your preferences have been updated.",
      })
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Apariencia</h3>

          <div>
            <Label>Tema</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <Button
                type="button"
                variant={theme === "light" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setTheme("light")}
              >
                <Sun className="h-4 w-4 mr-2" />
                Claro
              </Button>
              <Button
                type="button"
                variant={theme === "dark" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setTheme("dark")}
              >
                <Moon className="h-4 w-4 mr-2" />
                Oscuro
              </Button>
              <Button
                type="button"
                variant={theme === "system" ? "default" : "outline"}
                className="justify-start"
                onClick={() => setTheme("system")}
              >
                <Monitor className="h-4 w-4 mr-2" />
                Sistema
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select
                value={preferences.language}
                onValueChange={(value) => setPreferences({ ...preferences, language: value })}
              >
                <SelectTrigger id="language" disabled={true}>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Zona horaria</Label>
              <Select
                value={preferences.timezone}
                onValueChange={(value) => setPreferences({ ...preferences, timezone: value })}
              >
                <SelectTrigger id="timezone" disabled={true}>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                  <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                  <SelectItem value="cst">CST (Central Standard Time)</SelectItem>
                  <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>


      </div>


    </form>
  )
}
