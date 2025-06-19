"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { OrdersList } from "@/features/orders/orders-list"
import { OrdersFilter } from "@/features/orders/orders-filter"
import ViewOrderDialog from "@/features/orders/view-order-dialog"
import { OrderAPI } from "@/features/orders/api/order.api"
import { Order } from "@/features/orders/types/order.type"
import PermissionGuard from "@/features/auth/permission-guard"
import { PERMISSIONS } from "@/features/auth/permission-enum"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [viewOrderDialogOpen, setViewOrderDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Filter state
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    paymentMethod: "all",
    sort: "newest",
  })

  // Handle filter changes
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    applyFilters(orders, newFilters)
  }

  // Apply filters to orders
  const applyFilters = (ordersList: Order[], currentFilters: typeof filters) => {
    let result = [...ordersList]

    // Apply search filter
    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase()
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm) ||
          order.user.name.toLowerCase().includes(searchTerm) ||
          (order.user.number && order.user.number.toLowerCase().includes(searchTerm)),
      )
    }

    // Apply status filter
    if (currentFilters.status !== "all") {
      result = result.filter((order) => order.status === currentFilters.status)
    }

    // Apply payment method filter
    if (currentFilters.paymentMethod !== "all") {
      result = result.filter((order) => order.paymentMethod === currentFilters.paymentMethod)
    }

    // Apply sorting
    switch (currentFilters.sort) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "price-high":
        result.sort((a, b) => b.total - a.total)
        break
      case "price-low":
        result.sort((a, b) => a.total - b.total)
        break
    }

    setFilteredOrders(result)
  }

  // Handle view order
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setViewOrderDialogOpen(true)
  }

  useEffect(() => {
    const fetchOrders = async () => {
      await OrderAPI.getAll({ 
        user: true, 
        raffle: true, 
        tickets: true
      })
      .then(orders => setOrders(orders))
    }

    fetchOrders()
  }, [])


  useEffect(() => {
    applyFilters(orders, filters)
  }, [orders, filters])

  return (
    <PermissionGuard permission={PERMISSIONS.MANAGE_ORDERS}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Ver y administrar todas las ordenes en el sistema.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todas las ordenes</CardTitle>
            <CardDescription>Una lista de todas las ordenes con opciones de filtrado y gestión.</CardDescription>
          </CardHeader>
          <CardContent>
            <OrdersFilter filters={filters} onFilterChange={handleFilterChange} />
            <OrdersList orders={filteredOrders} onViewOrder={handleViewOrder} />
          </CardContent>
        </Card>

        {/* View Order Dialog */}
        <ViewOrderDialog open={viewOrderDialogOpen} onOpenChange={setViewOrderDialogOpen} order={selectedOrder} />
      </div>
    </PermissionGuard>
  )
}
