"use client"

import type React from "react"
import { useState } from "react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group"
import { Loader2, Search, User, Users } from "lucide-react"
import CreateCustomerDialog from "@/features/customers/create-customer-dialog"
import { useTicketOrder } from "./hook/use-order-creation"

export default function OrderCreationModal({ children }: { children: React.ReactNode }) {
  const {
    /* Diálogo */
    open,
    setOpen,
    isLoading,
    step,
    setStep,
    handleClose,
    handleCustomerCreated,

    /* Rifa */
    raffles,
    selectedRaffle,
    setSelectedRaffle,
    ticketAmount,
    setTicketAmount,
    ticketSelectionMethod,
    setTicketSelectionMethod,
    ticketNumbers,
    handleTicketNumberChange,
    areAllTicketNumbersValid,

    /* Cliente */
    filteredCustomers,
    searchQuery,
    setSearchQuery,
    selectedCustomer,
    setSelectedCustomer,

    /* Precios */
    selectedRaffleData,
    ticketPrice,
    totalPrice,

    /* Submit */
    handleSubmit,
  } = useTicketOrder()

  const [createCustomerDialogOpen, setCreateCustomerDialogOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Creando Orden</DialogTitle>
          <DialogDescription>
            {step === 1 && "Seleccione un sorteo y especifique el número de boletos."}
            {step === 2 && "Elija cómo seleccionar los números de boletos."}
            {step === 3 && "Asigna los tickets a un cliente."}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Select Raffle and Ticket Amount */}
        {step === 1 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="raffle">Selecciona un sorteo</Label>
              <Select value={selectedRaffle} onValueChange={setSelectedRaffle}>
                <SelectTrigger id="raffle">
                  <SelectValue placeholder="Seleccionar sorteo" />
                </SelectTrigger>
                <SelectContent>
                  {raffles.map((raffle) => (
                    <SelectItem key={raffle.id} value={raffle.id}>
                      {raffle.name} (${raffle.pricePeerTicket}/boleto)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRaffle && (
              <div className="space-y-2">
                <Label htmlFor="ticketAmount">Cantidad de boletos</Label>
                <Input
                  id="ticketAmount"
                  type="number"
                  min="1"
                  max="100"
                  value={ticketAmount}
                  onChange={(e) => {
                    setTicketAmount(e.target.value)
                  }}
                />

              </div>
            )}

            {selectedRaffle && ticketAmount && Number.parseInt(ticketAmount) > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Resumen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <span>Sorteo:</span>
                    <span className="font-medium">{selectedRaffleData?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Boletos:</span>
                    <span className="font-medium">{ticketAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Precio por boleto:</span>
                    <span className="font-medium">${ticketPrice}</span>
                  </div>
                  <div className="mt-2 flex justify-between border-t pt-2 text-base font-medium">
                    <span>Total:</span>
                    <span>${totalPrice}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 2: Ticket Selection Method */}
        {step === 2 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Metodo de seleccion</Label>
              <RadioGroup value={ticketSelectionMethod} onValueChange={setTicketSelectionMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="generate" id="generate" />
                  <Label htmlFor="generate">Generar números de tickets aleatorios</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manual" id="select" />
                  <Label htmlFor="select">Introducir números de boletos específicos</Label>
                </div>
              </RadioGroup>
            </div>

            {ticketSelectionMethod === "manual" && (
              <div className="space-y-2">
                <Label>Introduzca números de boletos de 8 dígitos</Label>
                <div className="max-h-[250px] space-y-2 overflow-y-auto rounded-md border p-4">
                  {Array.from({ length: Number.parseInt(ticketAmount) }, (_, index) => (
                    <div key={index} className="mb-2">
                      <Label htmlFor={`ticket-${index}`} className="mb-1 block text-sm">
                        Boleto #{index + 1}
                      </Label>
                      <Input
                        id={`ticket-${index}`}
                        value={ticketNumbers[index] || ""}
                        onChange={(e) => handleTicketNumberChange(index, e.target.value)}
                        placeholder="Enter 8-digit number"
                        maxLength={8}
                        className="font-mono"
                      />
                      {ticketNumbers[index] && ticketNumbers[index].length !== 8 && (
                        <p className="mt-1 text-xs text-destructive">Debe tener exactamente 8 dígitos</p>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Cada número de boleto debe tener exactamente 8 dígitos</p>
              </div>
            )}

            {ticketSelectionMethod === "generate" && (
              <div className="space-y-2">
                <Label>Vista previa de los tickets generados</Label>
                <div className="max-h-[250px] overflow-y-auto rounded-md border p-4">
                  <ul className="grid grid-cols-2 gap-2">
                    {ticketNumbers.map((ticket, index) => (
                      <li key={`${ticket}-${index}`} className="font-mono text-sm">
                        {ticket}
                      </li>
                    ))}
                  </ul>
                </div>
                {/*<p className="text-sm text-muted-foreground">{ticketAmount} tickets will be generated automatically</p>*/}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Customer Selection */}
        {step === 3 && (
          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="max-h-[250px] space-y-2 overflow-y-auto rounded-md border p-2">
              {filteredCustomers.length === 0 ? (
                <p className="p-2 text-center text-sm text-muted-foreground">No customers found</p>
              ) : (
                filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className={`cursor-pointer rounded-md p-2 hover:bg-accent ${
                      selectedCustomer === customer.id ? "bg-accent" : ""
                    }`}
                    onClick={() => setSelectedCustomer(customer.id)}
                  >
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {customer.email} • {customer.number}
                    </div>
                  </div>
                ))
              )}
            </div>

            <Button onClick={() => setCreateCustomerDialogOpen(true)}>Create Customer</Button>
          </div>
        )}

        <CreateCustomerDialog
          open={createCustomerDialogOpen}
          onOpenChange={setCreateCustomerDialogOpen}
          onCustomerCreated={handleCustomerCreated}
        />

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : (
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          )}

          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && (!selectedRaffle || !ticketAmount || Number.parseInt(ticketAmount) <= 0)) ||
                (step === 2 && !areAllTicketNumbersValid())
              }
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={
                isLoading || !selectedCustomer
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Order"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
