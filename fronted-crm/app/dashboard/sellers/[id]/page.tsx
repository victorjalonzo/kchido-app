"use client"

import { useEffect, useState } from "react"
import {
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  CreditCard,
  DollarSign,
  ShoppingCart,
  Users,
  CalendarIcon,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  subWeeks,
  subMonths,
} from "date-fns"
import type { DateRange } from "react-day-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Button } from "@/shared/components/ui/button"
import { Calendar } from "@/shared/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Raffle, RaffleStatus } from "@/features/raffles/types/raffle.type"
import { RaffleAPI } from "@/features/raffles/api/raffles-api"
import { Order, OrderStatus } from "@/features/orders/types/order.type"
import { OrderAPI } from "@/features/orders/api/order.api"
import { CustomerAPI } from "@/features/customers/api/customer-api"
import { Customer } from "@/features/customers/types/customer.type"
import { useParams } from "next/navigation"
import { SellerAPI } from "@/features/sellers/api/seller.api"
import { Seller } from "@/features/sellers/types/seller.type"
import { User } from "@/features/auth/user.type"


type DateFilter = {
  type: "today" | "yesterday" | "this-week" | "this-month" | "last-month" | "all-time" | "custom"
  startDate?: Date
  endDate?: Date
  label: string
}

export default function Dashboard() {
  const { id } = useParams()
  
  const [selectedFilter, setSelectedFilter] = useState<DateFilter>({
    type: "all-time",
    label: "Todo el tiempo",
  })
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const [user, setSeller] = useState<User | null>(null)
  const [allOrders, setOrders] = useState<Order[]>([])
  const [allCustomers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    async function fetchData(){
      const user = await SellerAPI.get(id as string)

      const customers = await CustomerAPI.getAll({
        creatorId: id,
        tickets: true
      })
      
      const orders = await OrderAPI.getAll({
        user: true, 
        raffle: true, 
        tickets: true,
        assistedBy: id
      })

      setOrders(orders)
      setCustomers(customers)
      setSeller(user)
    }

    fetchData()
  }, [])


  // Get date range based on filter type
  const getDateRange = (filter: DateFilter): { startDate: Date | null; endDate: Date | null } => {
    const now = new Date()

    switch (filter.type) {
      case "today":
        return { startDate: startOfDay(now), endDate: endOfDay(now) }
      case "yesterday":
        const yesterday = subDays(now, 1)
        return { startDate: startOfDay(yesterday), endDate: endOfDay(yesterday) }
      case "this-week":
        return { startDate: startOfWeek(now), endDate: endOfWeek(now) }
      case "this-month":
        return { startDate: startOfMonth(now), endDate: endOfMonth(now) }
      case "last-month":
        const lastMonth = subMonths(now, 1)
        return { startDate: startOfMonth(lastMonth), endDate: endOfMonth(lastMonth) }
      case "custom":
        return { startDate: filter.startDate || null, endDate: filter.endDate || null }
      case "all-time":
      default:
        return { startDate: null, endDate: null }
    }
  }

  // Get previous period for comparison
  const getPreviousPeriodRange = (filter: DateFilter): { startDate: Date | null; endDate: Date | null } => {
    const now = new Date()

    switch (filter.type) {
      case "today":
        const yesterday = subDays(now, 1)
        return { startDate: startOfDay(yesterday), endDate: endOfDay(yesterday) }
      case "yesterday":
        const dayBefore = subDays(now, 2)
        return { startDate: startOfDay(dayBefore), endDate: endOfDay(dayBefore) }
      case "this-week":
        const lastWeek = subWeeks(now, 1)
        return { startDate: startOfWeek(lastWeek), endDate: endOfWeek(lastWeek) }
      case "this-month":
        const lastMonth = subMonths(now, 1)
        return { startDate: startOfMonth(lastMonth), endDate: endOfMonth(lastMonth) }
      case "last-month":
        const twoMonthsAgo = subMonths(now, 2)
        return { startDate: startOfMonth(twoMonthsAgo), endDate: endOfMonth(twoMonthsAgo) }
      default:
        return { startDate: null, endDate: null }
    }
  }

  // Filter data based on date range
  const filterByDateRange = (items: any[], dateField: string, startDate: Date | null, endDate: Date | null) => {
    if (!startDate || !endDate) return items

    return items.filter((item) => {
      const itemDate = new Date(item[dateField])
      return itemDate >= startDate && itemDate <= endDate
    })
  }

  // Apply current period filters
  const currentRange = getDateRange(selectedFilter)
  const filteredOrders = filterByDateRange(allOrders, "createdAt", currentRange.startDate, currentRange.endDate) as Order[]
  const filteredCustomers = filterByDateRange(allCustomers, "createdAt", currentRange.startDate, currentRange.endDate) as Customer[]

  // Apply previous period filters for comparison
  const previousRange = getPreviousPeriodRange(selectedFilter)
  const previousOrders = filterByDateRange(allOrders, "createdAt", previousRange.startDate, previousRange.endDate)
  const previousCustomers = filterByDateRange(allCustomers, "createdAt", previousRange.startDate, previousRange.endDate)

  // Calculate current period statistics
  const totalOrders = filteredOrders.length
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0)
  const newCustomers = filteredCustomers.length

  // Calculate previous period statistics
  const previousTotalOrders = previousOrders.length
  const previousTotalRevenue = previousOrders.reduce((sum, order) => sum + order.amount, 0)
  const previousNewCustomers = previousCustomers.length

  // Calculate percentage changes
  const calculateChange = (
    current: number,
    previous: number,
  ): { change: string; changeType: "positive" | "negative" | "neutral" } => {
    if (previous === 0) {
      if (current > 0) return { change: "+100%", changeType: "positive" }
      return { change: "0%", changeType: "neutral" }
    }

    const percentChange = ((current - previous) / previous) * 100
    const changeType = percentChange > 0 ? "positive" : percentChange < 0 ? "negative" : "neutral"
    const changeStr = percentChange > 0 ? `+${percentChange.toFixed(1)}%` : `${percentChange.toFixed(1)}%`

    return { change: changeStr, changeType }
  }

  const ordersChange = calculateChange(totalOrders, previousTotalOrders)
  const revenueChange = calculateChange(totalRevenue, previousTotalRevenue)
  const customersChange = calculateChange(newCustomers, previousNewCustomers)

  // Get recent orders (limit to 5 most recent from filtered data)
  const recentOrders = filteredOrders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2)
    .map((order) => ({
      ...order,
      amount: `$${order.total.toFixed(2)}`,
    }))

    const recentCustomers = filteredCustomers
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2)

  // Preset filter options
  const presetFilters: DateFilter[] = [
    { type: "all-time", label: "Todo el tiempo" },
    { type: "today", label: "Hoy" },
    { type: "yesterday", label: "Ayer" },
    { type: "this-week", label: "Esta Semana" },
    { type: "this-month", label: "Este Mes" },
    { type: "last-month", label: "Ultimo Mes" },
  ]

  // Handle preset filter selection
  const handlePresetFilter = (filter: DateFilter) => {
    setSelectedFilter(filter)
    setDateRange(undefined) // Clear custom date range when using preset
  }

  // Handle custom date range selection
  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range)
    if (range?.from && range?.to) {
      setSelectedFilter({
        type: "custom",
        startDate: startOfDay(range.from),
        endDate: endOfDay(range.to),
        label: `${format(range.from, "MMM dd")} - ${format(range.to, "MMM dd, yyyy")}`,
      })
    } else if (range?.from && !range?.to) {
      // Single date selected
      setSelectedFilter({
        type: "custom",
        startDate: startOfDay(range.from),
        endDate: endOfDay(range.from),
        label: format(range.from, "MMM dd, yyyy"),
      })
    }
  }

  // Get display text for the calendar button
  const getCalendarButtonText = () => {
    if (selectedFilter.type === "custom") {
      return selectedFilter.label
    }
    return selectedFilter.label
  }

  // Statistics with dynamic changes
  const stats = [

    {
      title: "Ordenes",
      value: totalOrders.toString(),
      description: selectedFilter.type === "all-time" ? "Todo el tiempo" : selectedFilter.label,
      icon: ShoppingCart,
      change: ordersChange.change,
      changeType: ordersChange.changeType,
    },
    {
      title: "Ganancias",
      value: `$${totalRevenue.toLocaleString()}`,
      description: selectedFilter.type === "all-time" ? "Todo el tiempo" : selectedFilter.label,
      icon: DollarSign,
      change: revenueChange.change,
      changeType: revenueChange.changeType,
    },
    {
      title: "Nuevos clientes",
      value: newCustomers.toString(),
      description: selectedFilter.type === "all-time" ? "Todo el tiempo" : selectedFilter.label,
      icon: Users,
      change: customersChange.change,
      changeType: customersChange.changeType,
    },
  ]

  // Generate dynamic chart data based on filtered data
  const generateChartData = () => {
    if (selectedFilter.type === "all-time") {
      // For all-time view, show monthly aggregated data
    // 1. Agrupar por año-mes (YYYY-MM)
    type Agg = { orders: number; revenue: number; customers: number }
    const byMonth: Record<string, Agg> = {}

    allOrders.forEach((o) => {
      const key = format(new Date(o.createdAt), "yyyy-MM")
      byMonth[key] ??= { orders: 0, revenue: 0, customers: 0 }
      byMonth[key].orders += 1
      byMonth[key].revenue += o.total
    })

    allCustomers.forEach((c) => {
      const key = format(new Date(c.createdAt), "yyyy-MM")
      byMonth[key] ??= { orders: 0, revenue: 0, customers: 0 }
      byMonth[key].customers += 1
    })

    // 2. Convertir a array ordenado
    return Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b)) // YYYY-MM ya se ordena alfabéticamente
      .map(([key, value]) => ({
        month: format(new Date(`${key}-01`), "MMM yyyy"),
        ...value,
      }))
    }

    // For filtered views, create chart data based on the selected period
    const currentRange = getDateRange(selectedFilter)

    if (!currentRange.startDate || !currentRange.endDate) {
      return []
    }

    // Calculate the number of days in the selected range
    const daysDiff = Math.ceil(
      (currentRange.endDate.getTime() - currentRange.startDate.getTime()) / (1000 * 60 * 60 * 24),
    )

    if (daysDiff <= 7) {
      // For week or less, show daily data
      const dailyData = []
      for (let i = 0; i <= daysDiff; i++) {
        const currentDate = new Date(currentRange.startDate.getTime() + i * 24 * 60 * 60 * 1000)
        const dayOrders = filterByDateRange(allOrders, "createdAt", startOfDay(currentDate), endOfDay(currentDate))
        const dayCustomers = filterByDateRange(allCustomers, "createdAt", startOfDay(currentDate), endOfDay(currentDate))

        dailyData.push({
          month: format(currentDate, "MMM dd"),
          orders: dayOrders.length,
          revenue: dayOrders.reduce((sum, order) => sum + order.amount, 0),
          customers: dayCustomers.length,
        })
      }
      return dailyData
    } else if (daysDiff <= 31) {
      // For month or less, show weekly data
      const weeklyData = []
      let currentWeekStart = startOfWeek(currentRange.startDate)

      while (currentWeekStart <= currentRange.endDate) {
        const currentWeekEnd = endOfWeek(currentWeekStart)
        const weekOrders = filterByDateRange(allOrders, "createdAt", currentWeekStart, currentWeekEnd)
        const weekCustomers = filterByDateRange(allCustomers, "createdAt", currentWeekStart, currentWeekEnd)

        weeklyData.push({
          month: `Week ${format(currentWeekStart, "MMM dd")}`,
          orders: weekOrders.length,
          revenue: weekOrders.reduce((sum, order) => sum + order.amount, 0),
          customers: weekCustomers.length,
        })

        currentWeekStart = new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
      }
      return weeklyData
    } else {
      // For longer periods, show monthly data
      const monthlyData = []
      let currentMonthStart = startOfMonth(currentRange.startDate)

      while (currentMonthStart <= currentRange.endDate) {
        const currentMonthEnd = endOfMonth(currentMonthStart)
        const monthOrders = filterByDateRange(allOrders, "createdAt", currentMonthStart, currentMonthEnd)
        const monthCustomers = filterByDateRange(allCustomers, "createdAt", currentMonthStart, currentMonthEnd)

        monthlyData.push({
          month: format(currentMonthStart, "MMM yyyy"),
          orders: monthOrders.length,
          revenue: monthOrders.reduce((sum, order) => sum + order.amount, 0),
          customers: monthCustomers.length,
        })

        currentMonthStart = new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() + 1, 1)
      }
      return monthlyData
    }
  }

  const chartData = generateChartData()

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "pending":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  // Calculate max values for chart scaling
  const maxOrders = Math.max(...chartData.map((d) => d.orders))
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue))
  const maxCustomers = Math.max(...chartData.map((d) => d.customers))

  // Scale values for visualization (percentage of max height)
  const scaleValue = (value: number, max: number) => {
    return (value / max) * 100
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" className="px-2">
          <Link href="/dashboard/sellers" className="flex items-center gap-1 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Atras
          </Link>
        </Button>
        
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Vendedor: {user?.name}</h1>
        <div className="flex gap-2">
          {/* Date Filter Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal min-w-[200px]">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {getCalendarButtonText()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex">
                {/* Left Side - Preset Filters */}
                <div className="p-3 border-r  min-w-[120px] max-w-[100px]">
                  <p className="text-sm font-medium mb-3 text-muted-foreground">Filtros rápidos</p>
                  <div className="space-y-2">
                    {presetFilters.map((filter) => (
                      <Button
                        key={filter.type}
                        variant={selectedFilter.type === filter.type ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handlePresetFilter(filter)}
                        className="w-full justify-start text-xs h-7"
                      >
                        {filter.label}
                      </Button>
                    ))}
                  </div>

                  {/* Clear Filter Button */}
                  <div className="mt-4 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs h-7"
                      onClick={() => {
                        handlePresetFilter({ type: "all-time", label: "Todo el tiempo" })
                        setDateRange(undefined)
                      }}
                    >
                      Clear Filter
                    </Button>
                  </div>
                </div>

                {/* Right Side - Calendar */}
                <div className="p-4">
                  <p className="text-sm font-medium mb-3 text-muted-foreground">Rango de fechas personalizado</p>
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={handleDateRangeSelect}
                    numberOfMonths={1}
                    initialFocus
                    className="rounded-md"
                  />

                  {/* Selected Range Display */}
                  {dateRange?.from && (
                    <div className="mt-3 p-2 bg-muted/50 rounded-md border border-border">
                      <p className="text-xs text-primary font-medium">
                        Seleccionado: {format(dateRange.from, "MMM dd, yyyy")}
                        {dateRange.to && ` - ${format(dateRange.to, "MMM dd, yyyy")}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/*
          <Button asChild variant="outline">
            <Link href="/orders">Ver todas las ordenes</Link>
          </Button>
          */}
        </div>
      </div>

      {/* Show filter status */}
      {selectedFilter.type !== "all-time" && (
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Mostrando datos para: {selectedFilter.label}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                handlePresetFilter({ type: "all-time", label: "Todo el tiempo" })
                setDateRange(undefined)
              }}
              className="text-primary hover:text-primary/80"
            >
              Limpiar Filtros
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Seller information card */}
        <div className="col-span-full max-w-3xl w-full m-auto">
          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="h-16 w-16 rounded-full overflow-hidden border shrink-0">
                  {user?.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-muted text-muted-foreground text-xs">
                      Sin imagen
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-1 space-y-2 text-sm text-muted-foreground min-w-0">
                  <div className="flex justify-between gap-4">
                    <p className="flex items-center space-x-2 text-foreground font-medium truncate flex-1 min-w-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1118.879 6.196 9 9 0 015.12 17.804z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{user?.name || "—"}</span>
                    </p>

                    <p className="flex items-center space-x-2 truncate flex-1 min-w-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 0v8a2 2 0 002 2h14a2 2 0 002-2V8m-18 0l7.89-5.26a2 2 0 012.22 0L21 8" />
                      </svg>
                      <span className="truncate">{user?.email || "—"}</span>
                    </p>
                  </div>

                  <div className="flex justify-between gap-4">
                    <p className="flex items-center space-x-2 truncate flex-1 min-w-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h2l3.6 7.59-1.35 2.44a11.042 11.042 0 005.1 5.1l2.44-1.35L19 19v2a2 2 0 01-2 2 16 16 0 01-14-14 2 2 0 012-2z" />
                      </svg>
                      <span className="truncate">{user?.number || "—"}</span>
                    </p>

                    <p className="flex items-center space-x-2 text-xs truncate flex-1 min-w-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10M7 12h10m-7 5h7" />
                      </svg>
                      <span className="truncate">ID: {user?.shortId || "—"}</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        
        <div className="col-span-full flex flex-wrap justify-center gap-12">
          {stats.map((stat, i) => (
            <Card key={i} className="w-full sm:w-[250px]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                  {selectedFilter.type !== "all-time" && (
                    <p
                      className={`text-xs flex items-center ${
                        stat.changeType === "positive"
                          ? "text-green-500"
                          : stat.changeType === "negative"
                            ? "text-red-500"
                            : "text-gray-500"
                      }`}
                    >
                      {stat.change}
                      {stat.changeType === "positive" && <ArrowUpRight className="ml-1 h-3 w-3" />}
                      {stat.changeType === "negative" && <ArrowDownRight className="ml-1 h-3 w-3" />}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 items-stretch">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Rendimiento empresarial</CardTitle>
            <CardDescription>
              {selectedFilter.type !== "all-time"
                ? `Desglose de rendimiento para ${selectedFilter.label}`
                : "Órdenes, ingresos y crecimiento de clientes a lo largo del tiempo"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] relative">
              {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No hay datos disponibles para el período seleccionado</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Chart Legend */}
                  <div className="flex items-center justify-end gap-4 mb-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-xs">Ordenes</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-xs">Ganancias</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span className="text-xs">Clientes</span>
                    </div>
                  </div>

                  {/* Chart Grid */}
                  <div className="absolute inset-0 mt-8">
                    {[0, 25, 50, 75, 100].map((tick) => (
                      <div
                        key={tick}
                        className="absolute w-full border-t border-dashed border-border"
                        style={{ bottom: `${tick}%`, height: "1px" }}
                      >
                        <span className="absolute -left-6 -top-2 text-xs text-muted-foreground">{100 - tick}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Chart Bars */}
                  <div className="flex justify-between items-end h-[220px] mt-8 relative">
                    {chartData.map((data, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center gap-1"
                        style={{ width: `${100 / chartData.length}%` }}
                      >
                        <div className="flex items-end h-[200px] gap-1">
                          {/* Orders Bar */}
                          <div
                            className="w-4 bg-blue-500 rounded-t-sm"
                            style={{ height: `${scaleValue(data.orders, maxOrders)}%` }}
                            title={`Orders: ${data.orders}`}
                          ></div>

                          {/* Revenue Bar */}
                          <div
                            className="w-4 bg-green-500 rounded-t-sm"
                            style={{ height: `${scaleValue(data.revenue / 100, maxRevenue / 100)}%` }}
                            title={`Revenue: $${data.revenue}`}
                          ></div>

                          {/* Customers Bar */}
                          <div
                            className="w-4 bg-purple-500 rounded-t-sm"
                            style={{ height: `${scaleValue(data.customers, maxCustomers)}%` }}
                            title={`Customers: ${data.customers}`}
                          ></div>
                        </div>
                        <span
                          className="text-xs font-medium mt-2 text-center"
                          style={{ fontSize: chartData.length > 6 ? "10px" : "12px" }}
                        >
                          {data.month}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        { /*Recent Orders*/ }
        <div className="col-span-3 flex flex-col gap-4 h-full">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Ordenes Recientes</CardTitle>
                <CardDescription>
                  {selectedFilter.type !== "all-time" ? `Orders from ${selectedFilter.label}` : "Última actividad de ordenes"}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/orders">Ver todo</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {selectedFilter.type !== "all-time"
                      ? `No se encontraron ordenes para ${selectedFilter.label}`
                      : "No se encontraron ordenes recientes"}
                  </div>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center space-x-4">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium truncate">{order.user?.name}</p>
                          <p className="text-sm font-medium">{order.amount}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">
                            {order.shortId} • {order.tickets.length} boletos
                          </p>
                          <Badge variant={getStatusVariant(order.status)}>
                            {
                            order.status === OrderStatus.COMPLETED
                              ? "Completado"
                              : order.status === OrderStatus.PENDING
                              ? "Pendiente"
                              : "Cancelado"
                            }
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          { /*Recent Customers*/ }
          <Card className="flex-1 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Clientes Recientes</CardTitle>
                <CardDescription>
                  {selectedFilter.type !== "all-time" ? `Orders from ${selectedFilter.label}` : "Última actividad de ordenes"}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/orders">Ver todo</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCustomers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {selectedFilter.type !== "all-time"
                      ? `No se encontraron ordenes para ${selectedFilter.label}`
                      : "No se encontraron ordenes recientes"}
                  </div>
                ) : (
                  recentCustomers.map((customer) => (
                    <div key={customer.shortId} className="flex items-center space-x-4">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium truncate">{customer.name}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">
                            {customer.shortId} • {customer.tickets?.length} boletos
                          </p>

                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        
      </div>
    </div>
  )
}