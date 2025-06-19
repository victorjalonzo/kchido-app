"use client"

import { useEffect, useState } from "react"
import { TicketAPI } from "../tickets/api/ticket.api"

interface Props {
  ticketId: string
}

export function TicketReceiptLink({ ticketId }: Props) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    TicketAPI.getReceipt(ticketId).then(setUrl).catch(() => setUrl(null))
  }, [ticketId])

  if (!url) return <span className="text-muted-foreground text-sm">No disponible</span>

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
      Ver recibo
    </a>
  )
}
