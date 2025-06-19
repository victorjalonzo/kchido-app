"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import SellerForm from "./seller-form"
import { useToast } from "@/shared/components/ui/use-toast"
import type { User } from "@/shared/lib/types"
import { SellerAPI } from "./api/seller.api"
import { UpdateSellerPayload } from "./types/update-seller.payload"

interface EditSellerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  seller: User | null
  onSellerUpdated: (seller: User) => void
}

export default function EditSellerDialog({ open, onOpenChange, seller, onSellerUpdated }: EditSellerDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (payload: UpdateSellerPayload) => {
    if (!seller) return

    setIsLoading(true)

    await SellerAPI.update(payload)
    .then(updatedSeller => {
      setIsLoading(false)
      onSellerUpdated(updatedSeller)
      onOpenChange(false)

      toast({
        title: "Vendedor Actualizado",
        description: "El vendedor ha sido actualizado exitosamente",
      })
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Actualizar Vendedor</DialogTitle>
        </DialogHeader>
        {seller && (
          <SellerForm
            seller={seller}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
