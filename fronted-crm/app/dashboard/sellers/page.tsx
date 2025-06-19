"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { SellersList } from "@/features/sellers/sellers-list"
import { SellersFilter } from "@/features/sellers/sellers-filter"
import CreateSellerDialog from "@/features/sellers/create-seller-dialog"
import EditSellerDialog from "@/features/sellers/edit-seller-dialog"
import DeleteSellerDialog from "@/features/sellers/delete-seller-dialog"
import { useSellers } from "@/features/sellers/hooks/useSeller"
import PermissionGuard from "@/features/auth/permission-guard"
import { PERMISSIONS } from "@/features/auth/permission-enum"


export default function SellersPage() {
  const {
    sellers,
    filteredSellers,

    filters,
    handleFilterChange,

    createDialogOpen,
    setCreateDialogOpen,
    handleSellerCreated,

    editDialogOpen,
    setEditDialogOpen,
    handleEditSeller,
    handleSellerUpdated,

    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDeleteSeller,
    handleSellerDeleted,

    selectedSeller,
    setSelectedSeller,
  } = useSellers()

  return (
    <PermissionGuard permission={PERMISSIONS.MANAGE_SELLERS}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vendedores</h1>
            <p className="text-muted-foreground">Gestiona todos los vendedores y sus permisos.</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>Nuevo Vendedor</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todos los vendedores</CardTitle>
            <CardDescription>Una lista de todos los vendedores con sus roles y permisos.</CardDescription>
          </CardHeader>
          <CardContent>
            <SellersFilter filters={filters} onFilterChange={handleFilterChange} />
            <SellersList sellers={filteredSellers} onEditSeller={handleEditSeller} onDeleteSeller={handleDeleteSeller} />
          </CardContent>
        </Card>

        {/* Create Seller Dialog */}
        <CreateSellerDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSellerCreated={handleSellerCreated}
        />

        {/* Edit Seller Dialog */}
        <EditSellerDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          seller={selectedSeller}
          onSellerUpdated={handleSellerUpdated}
        />

        {/* Delete Seller Dialog */}
        <DeleteSellerDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          seller={selectedSeller}
          onSellerDeleted={handleSellerDeleted}
        />
      </div>
    </PermissionGuard>
  )
}
