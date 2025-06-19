import { useEffect, useState } from "react"
import { User } from "@/shared/lib/types"
import { SellerAPI } from "../api/seller.api"

export function useSellers(initialSellers: User[] = []) {
  /* ──────────────── State principal ──────────────── */
  const [sellers, setSellers] = useState<User[]>(initialSellers)
  const [filteredSellers, setFilteredSellers] = useState<User[]>(initialSellers)

  /* ──────────────── Filtros ──────────────── */
  const [filters, setFilters] = useState({
    search: "",
    permission: "all",
    sort: "newest",
  })

  /* ──────────────── Diálogos ──────────────── */
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [selectedSeller, setSelectedSeller] = useState<User | null>(null)

  /* ──────────────── Filtro + Orden ──────────────── */
  const applyFilters = (list: User[], current: typeof filters) => {
    let result = [...list]

    // Búsqueda
    if (current.search) {
      const term = current.search.toLowerCase()
      result = result.filter(
        s =>
          s.name.toLowerCase().includes(term) ||
          (s.email && s.email.toLowerCase().includes(term)),
      )
    }

    // Permisos
    if (current.permission !== "all") {
      result = result.filter(s => s.permissions?.includes(current.permission))
    }

    // Orden
    switch (current.sort) {
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

    setFilteredSellers(result)
  }

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    applyFilters(sellers, newFilters)
  }

  /* ──────────────── CRUD local ──────────────── */
  const handleSellerCreated = (newSeller: User) => {
    const updated = [newSeller, ...sellers]
    setSellers(updated)
    applyFilters(updated, filters)
  }

  const handleSellerUpdated = (updatedSeller: User) => {
    const updated = sellers.map(s => (s.id === updatedSeller.id ? updatedSeller : s))
    setSellers(updated)
    applyFilters(updated, filters)
  }

  const handleSellerDeleted = (sellerId: string) => {
    const updated = sellers.filter(s => s.id !== sellerId)
    setSellers(updated)
    applyFilters(updated, filters)
  }

  /* ──────────────── Acciones / Diálogos ──────────────── */
  const handleEditSeller = (seller: User) => {
    setSelectedSeller(seller)
    setEditDialogOpen(true)
  }

  const handleDeleteSeller = (seller: User) => {
    setSelectedSeller(seller)
    setDeleteDialogOpen(true)
  }

  /* ──────────────── Effects ──────────────── */
  useEffect(() => {
    if (initialSellers.length === 0) {
      const fetchSellers = async () => {
        const data = await SellerAPI.getAll()
        setSellers(data)
        setFilteredSellers(data)
      }
      fetchSellers()
    }

  }, [])

  useEffect(() => {
    applyFilters(sellers, filters)
  }, [sellers, filters])

  /* ──────────────── Export ──────────────── */
  return {
    /* Datos */
    sellers,
    filteredSellers,

    /* Filtros */
    filters,
    handleFilterChange,

    /* Crear */
    createDialogOpen,
    setCreateDialogOpen,
    handleSellerCreated,

    /* Editar */
    editDialogOpen,
    setEditDialogOpen,
    handleEditSeller,
    handleSellerUpdated,

    /* Eliminar */
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDeleteSeller,
    handleSellerDeleted,

    /* Selección */
    selectedSeller,
    setSelectedSeller,
  }
}
