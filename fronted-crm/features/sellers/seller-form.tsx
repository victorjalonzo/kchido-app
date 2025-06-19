"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Upload } from "lucide-react"
import type { User } from "@/shared/lib/types"
import { CreateSellerPayload } from "./types/create-seller.payload"
import { UpdateSellerPayload } from "./types/update-seller.payload"
import { Seller } from "./types/seller.type"
import { useImageUpload } from "@/shared/hooks/use-image-upload"
import { Base64 } from "@/shared/lib/base64"
import { Asset } from "@/shared/lib/asset"
import { RandomPassword } from "@/shared/lib/random-password"

// Available permissions for sellers
const availablePermissions = [
  { id: "manageRaffles", label: "Manejar Sorteos", required: false},
  { id: "manageSellers", label: "Manejar Vendedores", required: false},
  { id: "manageTickets", label: "Manejar Boletos", required: true},
  { id: "manageChatbot", label: "Manejar Chatbot", required: false },
  { id: "manageCustomers", label: "Manejar Clientes", required: true },
]

interface SellerFormProps {
  seller?: Seller
  onSubmit: (data: CreateSellerPayload) => void
  onCancel: () => void
  isLoading: boolean
}

export default function SellerForm({ seller, onSubmit, onCancel, isLoading }: SellerFormProps) {
  const isEditing = !!seller

  const [formData, setFormData] = useState<CreateSellerPayload>({
    name: "",
    email: "",
    number: "",
    role: 'seller',
    password: RandomPassword.generate(20),
    image: undefined,
    permissions: {
      manageTickets: true,
      manageCustomers: true      
    },
  })

  const {

    fileInputRef,
    previewUrl,
    file,
    handleImageUpload,
    handleFileChange

  } = useImageUpload()

  // Initialize form with seller data if editing
  useEffect(() => {
    if (seller) {
      setFormData({
        id: seller.id, 
        name: seller.name,
        email: seller.email || "",
        number: seller.number || "",
        role: seller.role,
        permissions: seller.permissions,
      })
    }
  }, [seller])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    const currentPermissions = formData.permissions 
    ?? availablePermissions.reduce((acc, e) => {
      acc[e.id] = false
      return acc
    }, {})

    currentPermissions[permissionId] = checked ? true : false

    setFormData({
      ...formData,
      permissions: currentPermissions,
    })
    
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (file) formData.image = await Base64.convert(file)
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-8 items-start">
        <div className="flex flex-col items-center space-y-2">
          <Avatar className="h-24 w-24">
            <AvatarImage src={previewUrl || seller?.image || Asset.defaultProfileImage} alt={formData.name || "New Seller"} />
            <AvatarFallback>{formData.name?.substring(0, 2).toUpperCase() || "NS"}</AvatarFallback>
          </Avatar>
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={handleImageUpload}>
            <Upload className="h-4 w-4 mr-2" />
            Cambiar Imagen
          </Button>
        </div>

        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Ingrese el nombre completo del vendedor"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Introduzca el correo electrónico del vendedor"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="number">Numero de Telefono</Label>
            <Input
              id="number"
              name="number"
              value={formData.number || ""}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Introduzca el número del vendedor"
            />
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="text"
                value={formData.password || ""}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Introduzca una contraseña"
              />
            </div>
          )}

        </div>
      </div>

      <div className="space-y-3">
        <Label>Permisos</Label>
        <div className="grid gap-2 sm:grid-cols-2">
          {availablePermissions.map((permission) => (
            <div key={permission.id} className="flex items-center space-x-2">
              <Checkbox
                id={`permission-${permission.id}`}
                checked={formData.permissions ? (formData.permissions[permission.id] ? true : false )  : false}
                onCheckedChange={(checked) => handlePermissionChange(permission.id, checked === true)}
                disabled={permission.required ?? isLoading}
              />
              <Label htmlFor={`permission-${permission.id}`} className="text-sm font-normal">
                {permission.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isEditing ? "Actualizar Vendedor" : "Crear"}
        </Button>
      </div>
    </form>
  )
}
