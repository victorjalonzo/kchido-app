"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"
import { useToast } from "@/shared/components/ui/use-toast"
import type { Raffle } from "@/shared/lib/types"
import { RaffleAPI } from "./api/raffles-api"

interface DeleteRaffleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  raffle: Raffle | null
  onRaffleDeleted: (raffleId: string) => void
}

export default function DeleteRaffleDialog({ open, onOpenChange, raffle, onRaffleDeleted }: DeleteRaffleDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!raffle) return

    setIsLoading(true)

    await RaffleAPI.deleteById(raffle.id)
    .then(_ => {
      setIsLoading(false)
      onRaffleDeleted(raffle.id)
      onOpenChange(false)

      toast({
        title: "Exito",
        description: "Sorteo eliminado exitosamente",
      })
    })
    .catch(_ => {
      setIsLoading(false)
      onOpenChange(false)

      toast({
        title: "Exito",
        description: "No se pudo eliminar el sorteo",
      })
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro que deseas eliminar este sorteo?</AlertDialogTitle>
          <AlertDialogDescription>
          Esta acción no se puede deshacer. Eliminará el sorteo:
            {raffle && <span className="font-medium"> "{raffle.name}"</span>} permanentemente y los datos asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
