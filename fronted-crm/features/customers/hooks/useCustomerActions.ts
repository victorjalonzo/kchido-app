import { Customer } from "../types/customer.type"

export function useCustomerActions(
  customers: Customer[],
  setCustomers: (val: Customer[]) => void,
  applyFilters: (list: Customer[], filters: any) => void,
  filters: any
) {
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

  const handleCustomerDeleted = (id: string) => {
    const updated = customers.filter(c => c.id !== id)
    setCustomers(updated)
    applyFilters(updated, filters)
  }

  const handleToggleStatus = (customer: Customer) => {
    const newStatus = customer.status === "active" ? "banned" : "active"
    const updatedCustomer = { ...customer, status: newStatus as "active" | "banned" }
    const updated = customers.map(c => (c.id === customer.id ? updatedCustomer : c))
    setCustomers(updated)
    applyFilters(updated, filters)
  }

  return {
    handleCustomerCreated,
    handleCustomerUpdated,
    handleCustomerDeleted,
    handleToggleStatus,
  }
}
