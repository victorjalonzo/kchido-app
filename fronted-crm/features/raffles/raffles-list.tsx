"use client"

import { Button } from "@/shared/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Badge } from "@/shared/components/ui/badge"
import { MoreHorizontal, ExternalLink, Edit, Trash, CheckCircle, Trophy } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Raffle, RaffleStatus, RaffleVisibility } from "./types/raffle.type"
import { Asset } from "@/shared/lib/asset"
import { ImageFormat } from "@/shared/lib/formatImage"

interface RafflesListProps {
  raffles: Raffle[]
  onEditRaffle: (raffle: Raffle) => void
  onDeleteRaffle: (raffle: Raffle) => void
  onFinalizeRaffle: (raffle: Raffle) => void
  onToggleStatus: (raffle: Raffle) => void
}

export function RafflesList({
  raffles,
  onEditRaffle,
  onDeleteRaffle,
  onFinalizeRaffle,
  onToggleStatus,
}: RafflesListProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

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
            <TableHead>Sorteo</TableHead>
            <TableHead className="hidden md:table-cell">Monto inicial</TableHead>
            <TableHead className="hidden sm:table-cell">Acumulado</TableHead>
            <TableHead className="hidden lg:table-cell">Concursantes</TableHead>
            <TableHead className="hidden xl:table-cell">Creado</TableHead>
            <TableHead className="hidden xl:table-cell">Termina</TableHead>
            <TableHead>Visibilidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {raffles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No hay sorteos encontrados.
              </TableCell>
            </TableRow>
          ) : (
            raffles.map((raffle) => (
              <TableRow key={raffle.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                      <Image src={raffle.image ?? Asset.defaultRaffleImage} alt={raffle.name} width={40} height={40} />
                    </div>
                    <div className="truncate max-w-[150px] sm:max-w-[200px]">{raffle.name}</div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{formatCurrency(raffle.initialAmount)}</TableCell>
                <TableCell className="hidden sm:table-cell">{formatCurrency(raffle.accumulated)}</TableCell>
                <TableCell className="hidden lg:table-cell">{raffle.subscribers}</TableCell>
                <TableCell className="hidden xl:table-cell">{formatDate(raffle.createdAt)}</TableCell>
                <TableCell className="hidden xl:table-cell">{formatDate(raffle.endsAt)}</TableCell>
                <TableCell>
                  <Badge variant={raffle.visibility == RaffleVisibility.PUBLIC ? 'default' : 'secondary'}>
                  {raffle.visibility == 'public'? 'Publico' : 'Privado'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge  variant={raffle.status == RaffleStatus.ONGOING ? "default" : "secondary"}>
                    {raffle.status == RaffleStatus.ONGOING ? "Activo" : "Finalizado"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost" asChild>
                      <Link href={raffle.id} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Ver pagina</span>
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditRaffle(raffle)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar sorteo
                        </DropdownMenuItem>
                        {raffle.status !== RaffleStatus.ENDED && (
                          <DropdownMenuItem onClick={() => onToggleStatus(raffle)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {raffle.visibility === RaffleVisibility.PUBLIC ? "Privatizar" : "Publicar"}
                          </DropdownMenuItem>
                        )}
                        {raffle.status !== RaffleStatus.ENDED && (
                          <DropdownMenuItem onClick={() => onFinalizeRaffle(raffle)}>
                            <Trophy className="h-4 w-4 mr-2" />
                            Finalizar sorteo
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onDeleteRaffle(raffle)} className="text-destructive">
                          <Trash className="h-4 w-4 mr-2" />
                          Eliminar sorteo
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
