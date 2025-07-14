"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { CustomersList } from "@/features/customers/customers-list"
import { CustomersFilter } from "@/features/customers/customers-filter"
import ViewCustomerDialog from "@/features/customers/view-customer-dialog"
import EditCustomerDialog from "@/features/customers/edit-customer-dialog"
import DeleteCustomerDialog from "@/features/customers/delete-customer-dialog"
import BanCustomerDialog from "@/features/customers/ban-customer-dialog"
import ViewTicketsDialog from "@/features/customers/view-tickets-dialog"
import CreateCustomerDialog from "@/features/customers/create-customer-dialog"
import { useCustomers } from "@/features/customers/hooks/useCustomer"
import PermissionGuard from "@/features/auth/permission-guard"
import { PERMISSIONS } from "@/features/auth/permission-enum"
import { useCustomerPage } from "@/features/customers/hooks/useCustomerPage"

export default function CustomersPage() {
  
  const {
    /* Data */
    customers,
    filteredCustomers,

    /* Filters */
    filters,
    handleFilterChange,

    /* Create */
    createDialogOpen,
    setCreateDialogOpen,
    handleCustomerCreated,

    /* View */
    viewDialogOpen,
    setViewDialogOpen,
    handleViewCustomer,

    /* Tickets */
    ticketsDialogOpen,
    setTicketsDialogOpen,
    handleViewTickets,

    /* Edit */
    editDialogOpen,
    setEditDialogOpen,
    handleEditCustomer,
    handleCustomerUpdated,

    /* Ban / unban */
    banDialogOpen,
    setBanDialogOpen,
    handleBanCustomer,
    handleToggleStatus,

    /* Delete */
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDeleteCustomer,
    handleCustomerDeleted,

    /* Selection */
    selectedCustomer,
    setSelectedCustomer,
  } = useCustomerPage()

  return (
    <PermissionGuard permission={PERMISSIONS.MANAGE_CUSTOMERS}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
            <p className="text-muted-foreground">Ver y administrar todas las cuentas de clientes.</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>Agregar nuevo cliente</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todos los clientes</CardTitle>
            <CardDescription>Una lista de todos los clientes en el sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <CustomersFilter filters={filters} onFilterChange={handleFilterChange} />
            <CustomersList
              customers={filteredCustomers}
              onViewCustomer={handleViewCustomer}
              onEditCustomer={handleEditCustomer}
              onViewTickets={handleViewTickets}
              onBanCustomer={handleBanCustomer}
              onDeleteCustomer={handleDeleteCustomer}
            />
          </CardContent>
        </Card>

        {/* View Customer Dialog */}
        <ViewCustomerDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} customer={selectedCustomer} />

        {/* Edit Customer Dialog */}
        <EditCustomerDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          customer={selectedCustomer}
          onCustomerUpdated={handleCustomerUpdated}
        />

        {/* View Tickets Dialog */}
        <ViewTicketsDialog open={ticketsDialogOpen} onOpenChange={setTicketsDialogOpen} customer={selectedCustomer} />

        {/* Ban Customer Dialog */}
        <BanCustomerDialog
          open={banDialogOpen}
          onOpenChange={setBanDialogOpen}
          customer={selectedCustomer}
          onCustomerStatusChanged={handleCustomerUpdated}
        />

        {/* Delete Customer Dialog */}
        <DeleteCustomerDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          customer={selectedCustomer}
          onCustomerDeleted={handleCustomerDeleted}
        />

        {/* Create Customer Dialog */}
        <CreateCustomerDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onCustomerCreated={handleCustomerCreated}
        />
      </div>
    </PermissionGuard>
  )
}
