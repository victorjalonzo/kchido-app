"use client"

import { Button } from "@/shared/components/ui/button"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Badge } from "@/shared/components/ui/badge"
import { MoreHorizontal, Edit, Trash, Ban, Ticket, Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
//import type { User } from "@/shared/lib/types"
import { Asset } from "@/shared/lib/asset"
import { Customer } from "./types/customer.type"

interface CustomersListProps {
  customers: Customer[]
  onViewCustomer: (customer: Customer) => void
  onEditCustomer: (customer: Customer) => void
  onViewTickets: (customer: Customer) => void
  onBanCustomer: (customer: Customer) => void
  onDeleteCustomer: (customer: Customer) => void
}

export function CustomersList({
  customers,
  onViewCustomer,
  onEditCustomer,
  onViewTickets,
  onBanCustomer,
  onDeleteCustomer,
}: CustomersListProps) {
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead className="hidden md:table-cell">Numero</TableHead>
            <TableHead className="hidden lg:table-cell">Creado</TableHead>
            <TableHead className="hidden sm:table-cell">Boletos</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No hay clientes encontrados.
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      <Image src={customer.image || Asset.defaultProfileImage} alt={customer.name} width={40} height={40} />
                    </div>
                    <div>{customer.name}</div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{customer.number}</TableCell>
                <TableCell className="hidden lg:table-cell">{formatDate(customer.createdAt)}</TableCell>
                <TableCell className="hidden sm:table-cell">{customer.tickets?.length}</TableCell>
                <TableCell>           
                  <Badge variant={customer.status === "active" ? "default" : "destructive"}>
                    {customer.status == 'active' ? 'Activo' : 'Baneado'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewCustomer(customer)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditCustomer(customer)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar cliente
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onViewTickets(customer)}>
                          <Ticket className="h-4 w-4 mr-2" />
                          Ver boletos
                        </DropdownMenuItem>

                        {/*
                        <DropdownMenuItem onClick={() => onBanCustomer(customer)}>
                          <Ban className="h-4 w-4 mr-2" />
                          {customer.status === "active" ? "Ban customer" : "Unban customer"}
                        </DropdownMenuItem>
                        */}

                        <DropdownMenuItem onClick={() => onDeleteCustomer(customer)} className="text-destructive">
                          <Trash className="h-4 w-4 mr-2" />
                          Eliminar cliente
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
