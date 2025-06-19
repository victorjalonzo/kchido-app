"use client"

import type React from "react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { useSecurity } from "./hooks/useSecurity"

export default function SecurityForm() {
  const {
    security,
    setSecurity,
    isLoading,
    handleSubmit
  } = useSecurity()

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-medium">Cambiar contraseña</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña actual</Label>
            <Input
              id="currentPassword"
              type="password"
              value={security.currentPassword}
              onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
              disabled={isLoading}
              placeholder="Introduzca su contraseña actual"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <Input
              id="newPassword"
              type="password"
              value={security.newPassword}
              onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
              disabled={isLoading}
              placeholder="Introduzca nueva contraseña"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirme Su Nueva Contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={security.confirmPassword}
              onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
              disabled={isLoading}
              placeholder="Confirme su nueva contraseña"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            Actualizar contraseña
          </Button>
        </div>
      </form>
    </div>
  )
}
