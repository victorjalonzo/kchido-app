import { useEffect, useState } from "react"
import { RaffleAPI } from "../api/raffles-api"
import { Raffle, RaffleStatus, RaffleVisibility } from "../types/raffle.type"

export function useRaffles() {
  const [raffles, setRaffles] = useState<Raffle[]>([])
  const [filteredRaffles, setFilteredRaffles] = useState<Raffle[]>([])

  //filters state
  const [filters, setFilters] = useState({search: "", status: "all", sort: "newest"})

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [finalizeDialogOpen, setFinalizeDialogOpen] = useState(false)
  
  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null)

  const applyFilters = (rafflesList: Raffle[], currentFilters: typeof filters) => {
    let result = [...rafflesList]

    // Apply search filter
    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase()
      result = result.filter((raffle) => raffle.name.toLowerCase().includes(searchTerm))
    }

    // Apply status filter
    if (currentFilters.status !== "all") {
      result = result.filter((raffle) => raffle.status === currentFilters.status)
    }

    // Apply sorting
    switch (currentFilters.sort) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "amount":
        result.sort((a, b) => b.accumulated - a.accumulated)
        break
      case "users":
        result.sort((a, b) => b.subscribers - a.subscribers)
        break
    }

    setFilteredRaffles(result)
  }

  // Handle filter changes
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    applyFilters(raffles, newFilters)
  }

  // Handle raffle creation
  const handleRaffleCreated = (newRaffle: Raffle) => {
    const updatedRaffles = [newRaffle, ...raffles]
    setRaffles(updatedRaffles)
    applyFilters(updatedRaffles, filters)
  }

  // Handle raffle update
  const handleRaffleUpdated = (updatedRaffle: Raffle) => {
    const updatedRaffles = raffles.map((raffle) => (raffle.id === updatedRaffle.id ? updatedRaffle : raffle))
    setRaffles(updatedRaffles)
    applyFilters(updatedRaffles, filters)
  }

  // Handle raffle deletion
  const handleRaffleDeleted = (raffleId: string) => {
    const updatedRaffles = raffles.filter((raffle) => raffle.id !== raffleId)
    setRaffles(updatedRaffles)
    applyFilters(updatedRaffles, filters)
  }

  // Handle raffle finalization
  const handleRaffleFinalized = (raffle: Raffle, winnerNumbers: string[], notifySubscribers: boolean) => {
    // Update the raffle with winner numbers and change status to finalized
    const updatedRaffle = {
      ...raffle,
      status: "finalized" as const,
      winnerNumbers,
    }

    // If notification is enabled, we would trigger notifications here in a real app
    if (notifySubscribers) {
      // In a real app, this would call an API to send notifications
      console.log(`Notifying ${raffle.subscribers} subscribers about raffle results`)
    }

    const updatedRaffles = raffles.map((r) => (r.id === raffle.id ? updatedRaffle : r))
    setRaffles(updatedRaffles)
    applyFilters(updatedRaffles, filters)
  }

  // Handle toggle raffle status (active/inactive)
  const handleToggleStatus = (raffle: Raffle) => {
    const newStatus = raffle.visibility === RaffleVisibility.PUBLIC ? RaffleVisibility.PRIVATE : RaffleVisibility.PUBLIC
    const updatedRaffle = {
      ...raffle,
      visibility: newStatus as "public" | "private",
    }

    const updatedRaffles = raffles.map((r) => (r.id === raffle.id ? updatedRaffle : r))
    setRaffles(updatedRaffles)
    //applyFilters(updatedRaffles, filters)
  }

  // Handle editing raffle
  const handleEditingRaffle = (raffle: Raffle) => {
    setSelectedRaffle(raffle)
    setEditDialogOpen(true)
  }

  // Handle deleting raffle
  const handleDeletingRaffle = (raffle: Raffle) => {
    setSelectedRaffle(raffle)
    setDeleteDialogOpen(true)
  }

  // Handle finalizing raffle
  const handleFinalizingRaffle = (raffle: Raffle) => {
    setSelectedRaffle(raffle)
    setFinalizeDialogOpen(true)
  }

  useEffect(() => {
    const fetchData = async () => {
      await RaffleAPI.getAll().then(raffles => {
        setFilteredRaffles(raffles)
        setRaffles(raffles)
      })
    }

    fetchData()
  }, [])

  useEffect(() => {
    applyFilters(raffles, filters)
  }, [raffles, filters])

  return {
    raffles,
    filteredRaffles,

    filters,
    handleFilterChange,

    createDialogOpen, 
    setCreateDialogOpen,
    handleRaffleCreated,

    editDialogOpen, 
    setEditDialogOpen,
    handleEditingRaffle,
    handleRaffleUpdated,

    deleteDialogOpen, 
    setDeleteDialogOpen,
    handleDeletingRaffle,
    handleRaffleDeleted,

    finalizeDialogOpen, 
    setFinalizeDialogOpen,
    handleFinalizingRaffle,
    handleRaffleFinalized,

    handleToggleStatus,

    selectedRaffle, 
    setSelectedRaffle


  }
}

