"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import SellerForm from "./seller-form"
import { useToast } from "@/shared/components/ui/use-toast"
import type { User } from "@/shared/lib/types"
import { CreateSellerPayload } from "./types/create-seller.payload"
import { SellerAPI } from "./api/seller.api"

interface CreateSellerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSellerCreated: (seller: User) => void
}

export default function CreateSellerDialog({ open, onOpenChange, onSellerCreated }: CreateSellerDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (payload: CreateSellerPayload) => {
    setIsLoading(true)

    console.log(payload)

    await SellerAPI.create(payload)
    .then(user => {

      onSellerCreated(user)
      onOpenChange(false)

      toast({
        title: "Success",
        description: "Seller created successfully.",
      })
    })

    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crear nuevo vendedor</DialogTitle>
        </DialogHeader>
        <SellerForm onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}
