"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import RaffleForm from "./raffle-form"
import { useToast } from "@/shared/components/ui/use-toast"
import type { Raffle } from "@/shared/lib/types"
import { RaffleAPI } from "./api/raffles-api"

interface EditRaffleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  raffle: Raffle | null
  onRaffleUpdated: (raffle: Raffle) => void
}

export default function EditRaffleDialog({ open, onOpenChange, raffle, onRaffleUpdated }: EditRaffleDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: Partial<Raffle>) => {
    if (!raffle) return

    setIsLoading(true)

    data.id = raffle.id

    await RaffleAPI.update(data)
    .then(updatedRaffle => {
        setIsLoading(false)
        onRaffleUpdated(updatedRaffle)
        onOpenChange(false)

        toast({
          title: "Exito",
          description: "Sorteo actualizado exitosamente",
        })
    })
    .catch(_ => {
      setIsLoading(false)
      onOpenChange(false)

      toast({
        title: "Error",
        description: "No se pudo actualizar el sorteo.",
      })
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Actualizar Sorteo</DialogTitle>
        </DialogHeader>
        {raffle && (
          <RaffleForm
            raffle={raffle}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
