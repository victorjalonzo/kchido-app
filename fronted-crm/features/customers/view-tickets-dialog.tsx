"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Button } from "@/shared/components/ui/button"
import { Download } from "lucide-react"
import type { User } from "@/shared/lib/types"
import { Ticket } from "../tickets/types/ticket.type"
import { TicketAPI } from "../tickets/api/ticket.api"

interface ViewTicketsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: User | null
}

export default function ViewTicketsDialog({ open, onOpenChange, customer }: ViewTicketsDialogProps) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    const fetchTickets = async () => {
      if (!customer) return

      try {
        await TicketAPI.getAll(`userId=${customer.id}&include=raffle&include=order`)
        .then(tickets => setTickets(tickets))
      } catch (error) {
        console.error("Error al obtener los tickets:", error)
      }
    }

    fetchTickets()
  }, [customer])

  if (!customer) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const exportToCSV = () => {
    setIsExporting(true)
    setTimeout(() => {
      try {
        const headers = [
          "Numero de Boleto", 
          "ID de Boleto", 
          "Nombre de Sorteo", 
          "ID de Sorteo", 
          "ID de orden", 
          "Metodo de Pago", 
          "Fecha de compra"
        ]
        
        const rows = tickets.map(ticket => [
          ticket.serial,
          ticket.id,
          ticket.raffle.name,
          ticket.raffle.id,
          ticket.order.id,
          ticket.order.paymentMethod,
          formatDate((ticket.order?.createdAt as string )),
        ])
        const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n")
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `${customer.name.replace(/\s+/g, "_")}_tickets.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (error) {
        console.error("Error exporting CSV:", error)
      }

      setIsExporting(false)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[950px]">
        <DialogHeader>
          <DialogTitle>Boletos del cliente</DialogTitle>
          <DialogDescription>Todos los boletos comprados por <span className='font-bold'>{customer.name}</span></DialogDescription>
        </DialogHeader>

        <div className="flex justify-end mb-4">
          <Button onClick={exportToCSV} disabled={isExporting || tickets.length === 0} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar a CSV
          </Button>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Este cliente no ha comprado ningún boleto.</div>
        ) : (
          <div className="rounded-md border max-h-[400px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numero de Boleto</TableHead>
                  <TableHead>ID de Boleto</TableHead>
                  <TableHead>Nombre de Sorteo</TableHead>
                  <TableHead>ID de Sorteo</TableHead>
                  <TableHead>ID de orden</TableHead>
                  <TableHead>Metodo de Pago</TableHead>
                  <TableHead>Fecha de compra</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-bold">{ticket.serial}</TableCell>
                    <TableCell>{ticket.id} </TableCell>
                    <TableCell className="font-bold">{ticket.raffle.name}</TableCell>
                    <TableCell>{ticket.raffle.id}</TableCell>
                    <TableCell>{ticket.order.id}</TableCell>
                    <TableCell>{ticket.order.paymentMethod}</TableCell>
                    <TableCell>{formatDate(ticket.order?.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

