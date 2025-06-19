"use client"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"

interface RafflesFilterProps {
  filters: {
    search: string
    status: string
    sort: string
  }
  onFilterChange: (filters: {
    search: string
    status: string
    sort: string
  }) => void
}

export function RafflesFilter({ filters, onFilterChange }: RafflesFilterProps) {
  const [search, setSearch] = useState(filters.search)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        ...filters,
        search,
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...filters,
      status: value,
    })
  }

  const handleSortChange = (value: string) => {
    onFilterChange({
      ...filters,
      sort: value,
    })
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 gap-3 mb-6">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="buscar"
            placeholder="Buscar sorteos..."
            className="pl-8 w-full sm:w-[300px] md:w-[250px] lg:w-[300px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="public">Publicos</SelectItem>
            <SelectItem value="private">Privados</SelectItem>
            <SelectItem value="finalized">Finalizados</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.sort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Nuevos Primero</SelectItem>
            <SelectItem value="oldest">Viejos Primero</SelectItem>
            <SelectItem value="amount">Monto (Alto a Bajo)</SelectItem>
            <SelectItem value="users">Usuarios (Mayor a Menor)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
