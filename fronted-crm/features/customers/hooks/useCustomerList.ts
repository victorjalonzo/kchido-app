import { useEffect, useState } from "react"
import { CustomerAPI } from "../api/customer-api"
import { Customer } from "../types/customer.type"

interface Filters {
  search: string
  status: "all" | "active" | "banned"
  sort: "newest" | "oldest" | "nameAsc" | "nameDesc"
}

export function useCustomerList(initialData?: Customer[]) {
  const [customers, setCustomers] = useState<Customer[]>(initialData ?? [])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "all",
    sort: "newest",
  })

  const applyFilters = (customersList: Customer[], currentFilters: Filters) => {
    let result = [...customersList]
    const term = currentFilters.search.toLowerCase()

    if (term) {
      result = result.filter(
        c =>
          c.name.toLowerCase().includes(term) ||
          c.number?.toLowerCase().includes(term) ||
          c.email?.toLowerCase().includes(term)
      )
    }

    if (currentFilters.status !== "all") {
      result = result.filter(c => c.status === currentFilters.status)
    }

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

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters)
    applyFilters(customers, newFilters)
  }

  useEffect(() => {
    if (initialData) {
      setFilteredCustomers(initialData)
      applyFilters(initialData, filters)
      return
    }

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

  return {
    customers,
    filteredCustomers,
    filters,
    handleFilterChange,
    setCustomers,
    applyFilters,
  }
}
