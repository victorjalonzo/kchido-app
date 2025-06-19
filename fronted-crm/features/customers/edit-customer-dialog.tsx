"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import CustomerForm from "./customer-form"
import { useToast } from "@/shared/components/ui/use-toast"
import type { User } from "@/shared/lib/types"
import { CustomerAPI } from "./api/customer-api"

interface EditCustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: User | null
  onCustomerUpdated: (customer: User) => void
}

export default function EditCustomerDialog({
  open,
  onOpenChange,
  customer,
  onCustomerUpdated,
}: EditCustomerDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (payload: UpdateCustomerPayload) => {
    if (!customer) return

    payload.id = customer.id

    console.log(payload)

    setIsLoading(true)

    await CustomerAPI.update(payload)
    .then(updatedCustomer => {
      setIsLoading(false)
      onCustomerUpdated(updatedCustomer)
      onOpenChange(false)

      toast({
        title: "Cliente actualizado",
        description: "Cliente actualizado exitosamente",
      })
    })
    .catch(_ => {
      setIsLoading(false)

      toast({
        title: "Error",
        description: "No se pudo actualizar el cliente",
      })
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar cliente</DialogTitle>
        </DialogHeader>
        {customer && (
          <CustomerForm
            customer={customer}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
