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

interface BanCustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: User | null
  onCustomerStatusChanged: (customer: User) => void
}

export default function BanCustomerDialog({
  open,
  onOpenChange,
  customer,
  onCustomerStatusChanged,
}: BanCustomerDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  if (!customer) return null

  const isBanned = customer.status === "banned"
  const action = isBanned ? "unban" : "ban"

  const handleAction = () => {
    if (!customer) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Update customer status
      const updatedCustomer: User = {
        ...customer,
        status: isBanned ? "active" : "banned",
      }

      setIsLoading(false)
      onCustomerStatusChanged(updatedCustomer)
      onOpenChange(false)

      toast({
        title: "Success",
        description: `Customer ${isBanned ? "unbanned" : "banned"} successfully.`,
      })
    }, 1000)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{isBanned ? "Unban this customer?" : "Ban this customer?"}</AlertDialogTitle>
          <AlertDialogDescription>
            {isBanned ? (
              <>
                This will restore <span className="font-medium">{customer.name}'s</span> account access and allow them
                to purchase tickets again.
              </>
            ) : (
              <>
                This will prevent <span className="font-medium">{customer.name}</span> from purchasing tickets and
                accessing certain features.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleAction}
            disabled={isLoading}
            className={isBanned ? "" : "bg-destructive text-destructive-foreground hover:bg-destructive/90"}
          >
            {isBanned ? "Unban Customer" : "Ban Customer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
