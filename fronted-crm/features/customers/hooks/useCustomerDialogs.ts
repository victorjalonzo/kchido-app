import { useState } from "react"
import { Customer } from "../types/customer.type"

export function useCustomerDialogs() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [banDialogOpen, setBanDialogOpen] = useState(false)
  const [ticketsDialogOpen, setTicketsDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // Acciones que combinan selección + apertura de diálogos
  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setViewDialogOpen(true)
  }

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setEditDialogOpen(true)
  }

  const handleDeleteCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setDeleteDialogOpen(true)
  }

  const handleBanCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setBanDialogOpen(true)
  }

  const handleViewTickets = (customer: Customer) => {
    setSelectedCustomer(customer)
    setTicketsDialogOpen(true)
  }

  return {
    selectedCustomer,
    setSelectedCustomer,

    viewDialogOpen,
    setViewDialogOpen,
    handleViewCustomer,

    editDialogOpen,
    setEditDialogOpen,
    handleEditCustomer,

    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDeleteCustomer,

    banDialogOpen,
    setBanDialogOpen,
    handleBanCustomer,

    ticketsDialogOpen,
    setTicketsDialogOpen,
    handleViewTickets,

    createDialogOpen,
    setCreateDialogOpen,
  }
}
