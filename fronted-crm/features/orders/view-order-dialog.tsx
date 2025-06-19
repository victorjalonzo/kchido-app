"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Badge } from "@/shared/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Separator } from "@/shared/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Button } from "@/shared/components/ui/button"
import { Download } from "lucide-react"
import { Order } from "./types/order.type"
import { TicketReceiptLink } from "../tickets/ticket-receipt-link"

interface ViewOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
}

export default function ViewOrderDialog({ open, onOpenChange, order }: ViewOrderDialogProps) {
  if (!order) return null

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Format payment method
  const formatPaymentMethod = (method: string) => {
    return method
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "pending":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalles de orden - {order.id}</span>
            <Badge variant={getStatusVariant(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Fecha</h3>
              <p>{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Metodo de pago</h3>
              <p>{formatPaymentMethod(order.paymentMethod)}</p>
            </div>
            {order.transactionId && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">ID de transaccion</h3>
                <p className="font-mono text-sm">{order.transactionId}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Total</h3>
              <p className="text-lg font-bold">{formatCurrency(order.total)}</p>
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <div>
            <h3 className="font-medium mb-3">Informacion del cliente</h3>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={order.user.image || "/placeholder.svg"} alt={order.user.name} />
                <AvatarFallback>{order.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{order.user.name}</p>
                <p className="text-sm text-muted-foreground">{order.user.email}</p>
                <p className="text-sm text-muted-foreground">{order.user.number}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tickets */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Boletos ({order.tickets.length})</h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar boletos
              </Button>
            </div>
            <div className="rounded-md border max-h-[300px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numero de boleto</TableHead>
                    <TableHead>Recibo de boleto</TableHead>
                    <TableHead>Sorteo</TableHead>
                    <TableHead className="hidden md:table-cell">Fecha de compra</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.serial}</TableCell>
                      <TableCell className="font-medium">
                        <TicketReceiptLink ticketId={ticket.id} />
                      </TableCell>
                      <TableCell>
                        <div className="truncate max-w-[200px]">{order.raffle.name}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === "completed" ? "default" : "destructive"}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium mb-2">Notas</h3>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{order.notes}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
