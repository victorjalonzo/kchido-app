"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Asset } from "@/shared/lib/asset"
import { Customer } from "./types/customer.type"

interface ViewCustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer | null
}

export default function ViewCustomerDialog({ open, onOpenChange, customer }: ViewCustomerDialogProps) {
  if (!customer) return null

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Perfil de cliente</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={customer.image || Asset.defaultProfileImage} alt={customer.name} />
              <AvatarFallback>{customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{customer.name}</h3>
              <div className="flex items-center mt-1">
                <Badge variant={customer.status === "active" ? "default" : "destructive"}>
                  {customer.status == 'active' ? 'Activo' : 'Baneado'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{customer.email || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Numero</p>
              <p className="font-medium">{customer.number || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Creado</p>
              <p className="font-medium">{formatDate(customer.createdAt)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Boletos comprados</p>
              <p className="font-medium">{customer.tickets?.length || 0}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">ID de cliente</p>
            <p className="font-mono text-sm">{customer.shortId}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
