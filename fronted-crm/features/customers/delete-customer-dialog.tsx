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
import { CustomerAPI } from "./api/customer-api"

interface DeleteCustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: User | null
  onCustomerDeleted: (customerId: string) => void
}

export default function DeleteCustomerDialog({
  open,
  onOpenChange,
  customer,
  onCustomerDeleted,
}: DeleteCustomerDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!customer) return

    setIsLoading(true)

    await CustomerAPI.delete(customer.id)
    .then(_ => {
      setIsLoading(false)
      onCustomerDeleted(customer.id)
      onOpenChange(false)

      toast({
        title: "Cliente delete",
        description: "Cliente eliminado exitosamente",
      })
    })
    .catch(_ => {
      setIsLoading(false)

      toast({
        title: "Error",
        description: "No se pudo eliminar al cliente",
      })
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Está seguro que desea eliminar este cliente?</AlertDialogTitle>
          <AlertDialogDescription>
          Esta acción no se puede deshacer. Eliminará permanentemente al cliente
            {customer && <span className="font-medium"> "{customer.name}"</span>} todos sus datos asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
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
