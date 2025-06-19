"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { RafflesList } from "@/features/raffles/raffles-list"
import { RafflesFilter } from "@/features/raffles/raffles-filter"
import CreateRaffleDialog from "@/features/raffles/create-raffle-dialog"
import EditRaffleDialog from "@/features/raffles/edit-raffle-dialog"
import DeleteRaffleDialog from "@/features/raffles/delete-raffle-dialog"
import FinalizeRaffleDialog from "@/features/raffles/finalize-raffle-dialog"
import { useRaffles } from "@/features/raffles/hooks/useRaffles"
import PermissionGuard from "@/features/auth/permission-guard"
import { PERMISSIONS } from "@/features/auth/permission-enum"

export default function RafflesPage() {
  const {
    filteredRaffles,
    filters,
    handleFilterChange,

    createDialogOpen, 
    setCreateDialogOpen,
    handleRaffleCreated,

    editDialogOpen, 
    setEditDialogOpen,
    handleEditingRaffle,
    handleRaffleUpdated,

    deleteDialogOpen, 
    setDeleteDialogOpen,
    handleDeletingRaffle,
    handleRaffleDeleted,

    finalizeDialogOpen, 
    setFinalizeDialogOpen,
    handleFinalizingRaffle,
    handleRaffleFinalized,

    handleToggleStatus,

    selectedRaffle
  } = useRaffles()

  return (
    <PermissionGuard permission={PERMISSIONS.MANAGE_RAFFLES}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sorteos</h1>
            <p className="text-muted-foreground">Gestiona todas tus campañas de sorteos.</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>Crear sorteo</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todos los sorteos</CardTitle>
            <CardDescription>Lista de todos los sorteos con información clave y opciones de gestión.</CardDescription>
          </CardHeader>
          <CardContent>
            <RafflesFilter filters={filters} onFilterChange={handleFilterChange} />
            <RafflesList
              raffles={filteredRaffles}
              onEditRaffle={handleEditingRaffle}
              onDeleteRaffle={handleDeletingRaffle}
              onFinalizeRaffle={handleFinalizingRaffle}
              onToggleStatus={handleToggleStatus}
            />
          </CardContent>
        </Card>

        {/* Create Raffle Dialog */}
        <CreateRaffleDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onRaffleCreated={handleRaffleCreated}
        />

        {/* Edit Raffle Dialog */}
        <EditRaffleDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          raffle={selectedRaffle}
          onRaffleUpdated={handleRaffleUpdated}
        />

        {/* Delete Raffle Dialog */}
        <DeleteRaffleDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          raffle={selectedRaffle}
          onRaffleDeleted={handleRaffleDeleted}
        />

        {/* Finalize Raffle Dialog */}
        <FinalizeRaffleDialog
          open={finalizeDialogOpen}
          onOpenChange={setFinalizeDialogOpen}
          raffle={selectedRaffle}
          onRaffleFinalized={handleRaffleFinalized}
        />
      </div>
    </PermissionGuard>
  )
}
