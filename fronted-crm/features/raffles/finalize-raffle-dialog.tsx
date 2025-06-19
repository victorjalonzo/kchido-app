"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Switch } from "@/shared/components/ui/switch"
import { useToast } from "@/shared/components/ui/use-toast"
import { AlertCircle, Trophy } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import type { Raffle } from "@/shared/lib/types"
import { UpdateRafflePayload } from "./types/update-raffle-payload"
import { RaffleAPI } from "./api/raffles-api"

interface FinalizeRaffleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  raffle: Raffle | null
  onRaffleFinalized: (raffle: Raffle, winnerNumbers: string[], notifySubscribers: boolean) => void
}

export default function FinalizeRaffleDialog({
  open,
  onOpenChange,
  raffle,
  onRaffleFinalized,
}: FinalizeRaffleDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [winnerNumbersText, setWinnerNumbersText] = useState("")
  const [notifySubscribers, setNotifySubscribers] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!raffle) return

    // Validate winner numbers
    if (!winnerNumbersText.trim()) {
      setError("Por favor ingrese al menos un numero ganador")
      return
    }

    // Parse winner numbers (split by commas, newlines, or spaces)
    const winnerNumbers = winnerNumbersText
      .split(/[\n,\s]+/)
      .map((num) => num.trim())
      .filter((num) => num !== "")

    if (winnerNumbers.length === 0) {
      setError("Por favor ingrese al menos un numero ganador")
      return
    }

    setError(null)
    setIsLoading(true)

    const payload: UpdateRafflePayload = {
      id: raffle.id,
      winnerNumbers: winnerNumbers,
      status: 'finalized'
    }

    await RaffleAPI.update(payload)
    .then(_ => {
      onRaffleFinalized(raffle, winnerNumbers, notifySubscribers)
      setIsLoading(false)
      onOpenChange(false)

      toast({
        title: "Sorteo finalizado",
        description: `${raffle.name} se ha finalizado con éxito con ${winnerNumbers.length} ganadores.`,
      })

      // Reset form
      setWinnerNumbersText("")
      setNotifySubscribers(true)

    })
    .catch(_ => {
      setIsLoading(false)
      onOpenChange(false)

      toast({
        title: "Error",
        description: `No se pudo finalizar el sorteo`,
      })

      // Reset form
      setWinnerNumbersText("")
      setNotifySubscribers(true)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Finalizar sorteo
          </DialogTitle>
          <DialogDescription>
          Ingrese los números ganadores y finaliza este sorteo. Esta acción no se puede deshacer..
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="winnerNumbers" className="text-base font-medium">
              Numeros Ganadores
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
            Ingrese el número o identificador de cada ganador. Separe los ganadores con comas, espacios o líneas nuevas.
            </p>
            <Textarea
              id="winnerNumbers"
              value={winnerNumbersText}
              onChange={(e) => setWinnerNumbersText(e.target.value)}
              placeholder="e.g. 12345, 67890, 54321"
              rows={5}
              className="font-mono"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="notifySubscribers"
              checked={notifySubscribers}
              onCheckedChange={setNotifySubscribers}
              disabled={true}
            />
            <Label htmlFor="notifySubscribers" className="text-sm">
            Notificar a todos los suscriptores que participaron en el sorteo vía Chatbot
            </Label>
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <h4 className="font-medium text-sm">Informacion importante</h4>
            <p className="text-sm text-muted-foreground mt-1">
            Al finalizar un sorteo, este se marcará permanentemente como completado. No podrás añadir más suscriptores ni modificar sus detalles principales después de esta acción.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              Finalizar sorteo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
