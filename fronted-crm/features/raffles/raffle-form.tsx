"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Calendar } from "@/shared/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Switch } from "@/shared/components/ui/switch"
import { CalendarIcon, Upload } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/shared/lib/utils"
import { Raffle } from "./types/raffle.type"
import { Asset } from "@/shared/lib/asset"
import { CreateRafflePayload } from "./types/create-raffle-payload"
import { RaffleStatus, RaffleVisibility } from "./types/raffle.type"
import { useImageUpload } from "@/shared/hooks/use-image-upload"
import { Base64 } from "@/shared/lib/base64"

interface RaffleFormProps {
  raffle?: Raffle
  onSubmit: (data: CreateRafflePayload | Partial<Raffle>) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export default function RaffleForm({ raffle, onSubmit, onCancel, isLoading }: RaffleFormProps) {
  const isEditing = !!raffle

  const [formData, setFormData] = useState<CreateRafflePayload>({
    name: "",
    image: undefined,
    initialAmount: 0,
    pricePeerTicket: 5,
    status: RaffleStatus.ONGOING,
    visibility: RaffleVisibility.PUBLIC,
    endsAt: "",
  })

  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  const {
    fileInputRef,
    previewUrl,
    file,
    handleImageUpload,
    handleFileChange
  } = useImageUpload()

  // Initialize form with raffle data if editing
  useEffect(() => {
    if (raffle) {
      setFormData({
        name: raffle.name,
        image: undefined,
        initialAmount: raffle.initialAmount,
        pricePeerTicket: raffle.pricePeerTicket,
        visibility: raffle.visibility,
        status: raffle.status,
        endsAt: raffle.endsAt,
      })

      if (raffle.endsAt) setEndDate(new Date(raffle.endsAt))

    }
  }, [raffle])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Handle number inputs
    if (name == 'initialAmount' || name == 'pricePeerTicket'){
      setFormData({
        ...formData,
        [name]: Number.parseFloat(value) || 0,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleStatusChange = (checked: boolean) => {
    setFormData({
      ...formData,
      visibility: checked 
      ? RaffleVisibility.PUBLIC
      : RaffleVisibility.PRIVATE,
    })
  }

  const handleDateChange = (date: Date | undefined) => {
    setEndDate(date)
    if (date) {
      setFormData({
        ...formData,
        endsAt: date.toISOString().split("T")[0],
      })
    }
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
      <div className="space-y-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-8 items-start">
          <div className="flex flex-col items-center space-y-2">
            <div className="h-32 w-32 rounded-md border overflow-hidden bg-muted flex items-center justify-center">
              <img
                src={previewUrl || raffle?.image || Asset.defaultRaffleImage}
                alt="Raffle"
                className="h-full w-full object-cover"
              />
            </div>
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={handleImageUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Subir Imagen
            </Button>
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de sorteo</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Ingrese un nombre de sorteo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialAmount">Monto inicial</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">$</span>
                <Input
                  id="initialAmount"
                  name="initialAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.initialAmount}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="pl-7"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialAmount">Precio de boletos</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">$</span>
                <Input
                  id="pricePeerTicket"
                  name="pricePeerTicket"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.pricePeerTicket}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="pl-7"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha de finalización</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Seleccione fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={handleDateChange}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="visibility"
                checked={formData.visibility === RaffleVisibility.PUBLIC}
                onCheckedChange={handleStatusChange}
                disabled={isLoading}
              />
              <Label htmlFor="visibility">{formData.visibility === RaffleVisibility.PUBLIC ? "Publico" : "Privado"}</Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripcion</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Ingrese la descripcion del sorteo"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isEditing ? "Actualizar sorteo" : "Crear sorteo"}
        </Button>
      </div>
    </form>
  )
}
