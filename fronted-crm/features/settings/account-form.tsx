"use client"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Upload } from "lucide-react"
import { useAccount } from "./hooks/useAccount"
import { Asset } from "@/shared/lib/asset"

export default function AccountForm() {
  const {
    userData,
    user,
    setUserData,
    isLoading,
    fileInputRef,
    previewUrl,
    handleSubmit,
    handleImageUpload,
    handleFileChange
  } = useAccount()

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-8 items-start">
        <div className="flex flex-col items-center space-y-2">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Avatar className="h-24 w-24">
          <AvatarImage
              src={previewUrl || user?.image || Asset.defaultProfileImage}
              alt={user?.name || "User avatar"}
            />
            <AvatarFallback>AU</AvatarFallback>
          </Avatar>
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={handleImageUpload}>
            <Upload className="h-4 w-4 mr-2" />
            Cambiar Foto
          </Button>
        </div>

        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                disabled={isLoading}
                placeholder="Introduzca su nombre completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electronico</Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                disabled={isLoading}
                placeholder="Introduzca su correo electronico"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Numero Telefonico</Label>
            <Input
              id="phone"
              value={userData.number}
              onChange={(e) => setUserData({ ...userData, number: e.target.value })}
              disabled={isLoading}
              placeholder="Introduzca su numero telefonico"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </form>
  )
}

