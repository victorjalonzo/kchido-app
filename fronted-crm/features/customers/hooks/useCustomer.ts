import { useEffect, useState } from "react"
import { CustomerAPI } from "../api/customer-api"
import { Customer } from "../types/customer.type"

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    sort: "newest",
  })

  // Dialogs
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [banDialogOpen, setBanDialogOpen] = useState(false)
  const [ticketsDialogOpen, setTicketsDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  /* ──────────────── Filter and Orden ──────────────── */
  const applyFilters = (customersList: Customer[], currentFilters: typeof filters) => {
    let result = [...customersList]

    // Search
    if (currentFilters.search) {
      const term = currentFilters.search.toLowerCase()
      result = result.filter(
        c =>
          c.name.toLowerCase().includes(term) ||
          (c.number && c.number.toLowerCase().includes(term)) ||
          (c.email && c.email.toLowerCase().includes(term)),
      )
    }

    // Status
    if (currentFilters.status !== "all") {
      result = result.filter(c => c.status === currentFilters.status)
    }

    // Orden
    switch (currentFilters.sort) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "nameAsc":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "nameDesc":
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
    }

    setFilteredCustomers(result)
  }

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    applyFilters(customers, newFilters)
  }

  /* ──────────────── CRUD local ──────────────── */
  const handleCustomerCreated = (newCustomer: Customer) => {
    const updated = [newCustomer, ...customers]
    setCustomers(updated)
    applyFilters(updated, filters)
  }

  const handleCustomerUpdated = (updatedCustomer: Customer) => {
    const updated = customers.map(c => (c.id === updatedCustomer.id ? updatedCustomer : c))
    setCustomers(updated)
    applyFilters(updated, filters)
  }

  const handleCustomerDeleted = (customerId: string) => {
    const updated = customers.filter(c => c.id !== customerId)
    setCustomers(updated)
    applyFilters(updated, filters)
  }

  /* ──────────────── Actions / Dialogs ──────────────── */
  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setViewDialogOpen(true)
  }

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setEditDialogOpen(true)
  }

  const handleViewTickets = (customer: Customer) => {
    setSelectedCustomer(customer)
    setTicketsDialogOpen(true)
  }

  const handleBanCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setBanDialogOpen(true)
  }

  const handleDeleteCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setDeleteDialogOpen(true)
  }

  /* ──────────────── Toggle active/banned ──────────────── */
  const handleToggleStatus = (customer: Customer) => {
    const newStatus = customer.status === "active" ? "banned" : "active"
    const updatedCustomer = { ...customer, status: newStatus as "active" | "banned" }
    const updated = customers.map(c => (c.id === customer.id ? updatedCustomer : c))
    setCustomers(updated)
    applyFilters(updated, filters)
  }

  /* ──────────────── Effects ──────────────── */
  useEffect(() => {
    const fetchCustomers = async () => {
      const data = await CustomerAPI.getAll({ tickets: true })
      setCustomers(data)
      setFilteredCustomers(data)
    }
    fetchCustomers()
  }, [])

  useEffect(() => {
    applyFilters(customers, filters)
  }, [customers, filters])

  /* ──────────────── Exports ──────────────── */
  return {
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
  }
}
