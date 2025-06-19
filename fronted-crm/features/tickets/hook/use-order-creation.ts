import { useAuth } from "@/features/auth/auth-provider"
import { CustomerAPI } from "@/features/customers/api/customer-api"
import { Customer } from "@/features/customers/types/customer.type"
import { OrderAPI } from "@/features/orders/api/order.api"
import { CreateOrderPayload } from "@/features/orders/types/create-order.payload"
import { RaffleAPI } from "@/features/raffles/api/raffles-api"
import { Raffle } from "@/features/raffles/types/raffle.type"
import { useToast } from "@/shared/hooks/use-toast"
import { User } from "@/shared/lib/types"
import { useEffect, useMemo, useState } from "react"
import { RandomSerial } from "../util/random-number"


export function useTicketOrder() {
  const { user } = useAuth()

  /* ─────────────── Toast ─────────────── */
  const { toast } = useToast()

  /* ─────────────── Diálogo ─────────────── */
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)

  /* ─────────────── Datos remotos ─────────────── */
  const [raffles, setRaffles] = useState<Raffle[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])

  /* ─────────────── Búsqueda cliente ─────────────── */
  const [searchQuery, setSearchQuery] = useState("")

  /* ─────────────── Formulario ─────────────── */
  const [selectedRaffle, setSelectedRaffle] = useState<string>("")
  const [ticketAmount, setTicketAmount] = useState<string>("1")
  const [ticketSelectionMethod, setTicketSelectionMethod] = useState<"generate" | "manual">("generate")
  const [ticketNumbers, setTicketNumbers] = useState<string[]>([])

  const [customerTab, setCustomerTab] = useState<"existing" | "new">("existing")
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "" })

  /* ─────────────── Derivados ─────────────── */
  const selectedRaffleData = useMemo(
    () => raffles.find(r => r.id === selectedRaffle),
    [raffles, selectedRaffle],
  )

  const ticketPrice = selectedRaffleData?.pricePeerTicket ?? 0
  const totalPrice = ticketPrice * (Number.parseInt(ticketAmount || "0") || 0)

  const filteredCustomers = useMemo(
    () =>
      customers.filter(
        c =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.number?.includes(searchQuery),
      ),
    [customers, searchQuery],
  )

  /* ─────────────── Fetch inicial ─────────────── */
  useEffect(() => {
    const load = async () => {
      try {
        const [raffleData, customerData] = await Promise.all([RaffleAPI.getAll(), CustomerAPI.getAll()])
        setRaffles(raffleData)
        setCustomers(customerData)
      } catch (err) {
        console.error("Error cargando datos", err)
      }
    }
    load()
  }, [])

  /* ─────────────── Tickets manuales ─────────────── */
  useEffect(() => {
    const count = Number.parseInt(ticketAmount || "0") || 0
    if (ticketSelectionMethod === "manual") {
      setTicketNumbers(Array(count).fill(""))
    } else {
      setTicketNumbers(generateTicketNumbers(count, selectedRaffle))
    }
  }, [ticketAmount, ticketSelectionMethod, selectedRaffle])

  const handleTicketNumberChange = (idx: number, value: string) => {
    const clean = value.replace(/\D/g, "").slice(0, 8)
    setTicketNumbers(prev => {
      const next = [...prev]
      next[idx] = clean
      return next
    })
  }

  const areAllTicketNumbersValid = () =>
    ticketSelectionMethod === "generate" || ticketNumbers.every(n => n.length === 8)

  const generateTicketNumbers = (count: number, raffleId: string) =>
    Array.from({ length: count }, (_, i) => `${RandomSerial.generate(6)}`)

  /* ─────────────── Auxiliares ─────────────── */
  const resetForm = () => {
    setSelectedRaffle("")
    setTicketAmount("1")
    setTicketSelectionMethod("generate")
    setTicketNumbers([])
    setCustomerTab("existing")
    setSelectedCustomer("")
    setNewCustomer({ name: "", email: "", phone: "" })
    setStep(1)
  }

  const handleClose = () => {
    setOpen(false)
    resetForm()
  }

  const handleSubmit = async () => {
    if (!selectedRaffleData) return
    if (!areAllTicketNumbersValid()) return
    setIsLoading(true)

    const payload: CreateOrderPayload = {
      raffleId: selectedRaffleData.id,
      tickets: Array.isArray(ticketNumbers) ? ticketNumbers : [ticketNumbers],
      userId: selectedCustomer,
      status: 'completed',
      paymentMethod: 'efectivo',
      assistedBy: (user as User).id
    }

    console.log('payload', payload)

    await OrderAPI.create(payload)
    .then(order => {

      toast({
        title: "Orden creada",
        description: `Creaste ${ticketAmount} boletos para ${
          customerTab === "existing"
            ? customers.find(c => c.id === selectedCustomer)?.name
            : newCustomer.name
        }`,
      })

      console.log('order:', order)
    })

    handleClose()
    setIsLoading(false)
  }

  const handleCustomerCreated = (newCustomer: Customer) => {
    const updatedCustomers = [newCustomer, ...customers]
    setCustomers(updatedCustomers)
  }

  /* ─────────────── Export ─────────────── */
  return {
    /* Diálogo */
    open,
    setOpen,
    isLoading,
    step,
    setStep,
    handleClose,

    /* Rifa */
    raffles,
    selectedRaffle,
    setSelectedRaffle,
    ticketAmount,
    setTicketAmount,
    ticketSelectionMethod,
    setTicketSelectionMethod,
    ticketNumbers,
    setTicketNumbers,
    handleTicketNumberChange,
    generateTicketNumbers,
    areAllTicketNumbersValid,

    /* Cliente */
    customerTab,
    setCustomerTab,
    customers,
    filteredCustomers,
    searchQuery,
    setSearchQuery,
    selectedCustomer,
    setSelectedCustomer,
    newCustomer,
    setNewCustomer,

    /* Precios */
    selectedRaffleData,
    ticketPrice,
    totalPrice,

    /* Submit */
    handleSubmit,

    handleCustomerCreated,
  }
}
