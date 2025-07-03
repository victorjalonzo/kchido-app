"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import CustomerForm from "./customer-form"
import { useToast } from "@/shared/components/ui/use-toast"
import { CustomerAPI } from "./api/customer-api"
import { Customer } from "./types/customer.type"

interface CreateCustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCustomerCreated: (customer: Customer) => void
}

export default function CreateCustomerDialog({ open, onOpenChange, onCustomerCreated }: CreateCustomerDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (payload: CreateCustomerPayload) => {
    setIsLoading(true)

    console.log(payload)

    await CustomerAPI.create(payload)
    .then(customer => {
      setIsLoading(false)
      onCustomerCreated(customer)
      onOpenChange(false)

      toast({
        title: "Cliente creado",
        description: "Cliente creado exitosamente.",
      })
    })
    .catch(_ => {
      console.log(_)
      setIsLoading(false)

      toast({
        title: "Error",
        description: "No se pudo crear el cliente",
      })
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Agregar nuevo cliente</DialogTitle>
        </DialogHeader>
        <CustomerForm onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}
