"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Upload } from "lucide-react"
import type { User } from "@/shared/lib/types"
import { Asset } from "@/shared/lib/asset"
import { useImageUpload } from "@/shared/hooks/use-image-upload"
import { Base64 } from "@/shared/lib/base64"

interface CustomerFormProps {
  customer?: User
  onSubmit: (data: CreateCustomerPayload) => void
  onCancel: () => void
  isLoading: boolean
}

export default function CustomerForm({ customer, onSubmit, onCancel, isLoading }: CustomerFormProps) {
  const isEditing = !!customer

  const [formData, setFormData] = useState<CreateCustomerPayload>({
    name: "",
    email: "",
    number: "",
    image: undefined,
    role: 'customer'
  })

  const {
    fileInputRef,
    previewUrl,
    file,
    handleImageUpload,
    handleFileChange
  } = useImageUpload()

  // Initialize form with customer data if editing
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email || "",
        number: customer.number || "",
        image: customer.image,
        role: 'customer'
      })
    }
  }, [customer])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (file) formData.image = await Base64.convert(file)
    onSubmit(formData)
  }

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
            <AvatarImage src={customer?.image || previewUrl || Asset.defaultProfileImage} alt={formData.name || "New Customer"} />
            <AvatarFallback>{formData.name?.substring(0, 2).toUpperCase() || "NC"}</AvatarFallback>
          </Avatar>
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={handleImageUpload}>
            <Upload className="h-4 w-4 mr-2" />
            Cambiar imagen
          </Button>
        </div>

        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Ingrese el nombre completo del cliente"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electronico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Ingrese la dirección de correo electrónico del cliente"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="number">Numero de telefono</Label>
            <Input
              id="number"
              name="number"
              value={formData.number || ""}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Ingrese el número de teléfono del cliente"
              required
            />
          </div>
          
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isEditing ? "Actualizar cliente" : "Agregar cliente"}
        </Button>
      </div>
    </form>
  )
}
