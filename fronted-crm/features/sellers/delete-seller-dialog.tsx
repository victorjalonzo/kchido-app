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
import type { User } from "@/shared/lib/types"
import { SellerAPI } from "./api/seller.api"

interface DeleteSellerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  seller: User | null
  onSellerDeleted: (sellerId: string) => void
}

export default function DeleteSellerDialog({ open, onOpenChange, seller, onSellerDeleted }: DeleteSellerDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!seller) return

    setIsLoading(true)

    await SellerAPI.delete(seller.id)
    .then(_ => {
      setIsLoading(false)
      onSellerDeleted(seller.id)
      onOpenChange(false)

      toast({
        title: "Vendedor Eliminado",
        description: "El vendedor ha sido eliminado exitosamente",
      })
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro de que deseas eliminar este vendedor?</AlertDialogTitle>
          <AlertDialogDescription>
          Esta acción no se puede deshacer. Eliminará permanentemente al vendedor 
            {seller && <span className="font-medium"> "{seller.name}"</span>} y su acceso al sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
