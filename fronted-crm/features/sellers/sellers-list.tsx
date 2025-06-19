"use client"

import { Button } from "@/shared/components/ui/button"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Badge } from "@/shared/components/ui/badge"
import { MoreHorizontal, Edit, Trash, ShieldAlert } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import type { User } from "@/shared/lib/types"

interface SellersListProps {
  sellers: User[]
  onEditSeller: (seller: User) => void
  onDeleteSeller: (seller: User) => void
}

export function SellersList({ sellers, onEditSeller, onDeleteSeller }: SellersListProps) {
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get human-readable permission name
  const getPermissionName = (permission: string) => {
    switch (permission) {
      case "manageRaffles":
        return "Sorteos"
      case "manageSellers":
        return "Vendedores"
      case "manageTickets":
        return "Boletos"
      case "manageChatbot":
        return "Chatbot"
      case "manageCustomers":
        return "Clientes"
      default:
        return permission
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden lg:table-cell">Created</TableHead>
            <TableHead>Permisos</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sellers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
              No se encontraron vendedores.
              </TableCell>
            </TableRow>
          ) : (
            sellers.map((seller) => (
              <TableRow key={seller.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      <Image src={seller.image || "/placeholder.svg"} alt={seller.name} width={40} height={40} />
                    </div>
                    <div>{seller.name}</div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{seller.email}</TableCell>
                <TableCell className="hidden lg:table-cell">{formatDate(seller.createdAt)}</TableCell>
                <TableCell>
                <div className="flex flex-wrap gap-1">
                  {seller.permissions &&
                  Object.entries(seller.permissions).some(
                    ([key, value]) => value && key !== "id" && key !== "userId"
                  ) ? (
                    <>
                      {Object.entries(seller.permissions)
                        .filter(([key, value]) => value && key !== "id" && key !== "userId")
                        .slice(0, 2)
                        .map(([permissionId]) => (
                          <Badge key={permissionId} variant="outline" className="whitespace-nowrap">
                            {getPermissionName(permissionId)}
                          </Badge>
                        ))}
                      {Object.entries(seller.permissions).filter(
                        ([key, value]) => value && key !== "id" && key !== "userId"
                      ).length > 2 && (
                        <Badge variant="outline">
                          +
                          {
                            Object.entries(seller.permissions).filter(
                              ([key, value]) => value && key !== "id" && key !== "userId"
                            ).length - 2
                          }{" "}
                          más
                        </Badge>
                      )}
                    </>
                  ) : (
                    <span className="text-muted-foreground text-sm">Sin permisos</span>
                  )}
                </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Mostrar menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditSeller(seller)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Actualizar vendedor
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditSeller(seller)}>
                          <ShieldAlert className="h-4 w-4 mr-2" />
                          Administrar permisos
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteSeller(seller)} className="text-destructive">
                          <Trash className="h-4 w-4 mr-2" />
                          Eliminar vendedor
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
