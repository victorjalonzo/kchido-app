"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import RaffleForm from "./raffle-form"
import { useToast } from "@/shared/components/ui/use-toast"
import type { Raffle } from "@/shared/lib/types"
import { CreateRafflePayload } from "./types/create-raffle-payload"
import { RaffleAPI } from "./api/raffles-api"

interface CreateRaffleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRaffleCreated: (raffle: Raffle) => void
}

export default function CreateRaffleDialog({ open, onOpenChange, onRaffleCreated }: CreateRaffleDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (payload: CreateRafflePayload) => {
    setIsLoading(true)

    await RaffleAPI.create(payload)
    .then(raffle => {
      console.log(raffle)

      setIsLoading(false)
      onRaffleCreated(raffle)
      onOpenChange(false)

      toast({
        title: "Exito",
        description: "Sorteo creado exitosamente",
      })

    })
    .catch(r => {
      console.log(r)
      setIsLoading(false)

      toast({
        title: "Error",
        description: "No se pudo crear el sorteo",
      })
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear nuevo sorteo</DialogTitle>
        </DialogHeader>
        <RaffleForm onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}
