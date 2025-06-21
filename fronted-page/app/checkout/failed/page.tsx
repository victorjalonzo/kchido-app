import { getRaffleById } from "@/lib/data"
import { notFound } from "next/navigation"
import FailureMessage from "@/components/failure-message"

interface FailurePageProps {
  params: { id: string }
  searchParams: { tickets?: string; numbers?: string; error?: string }
}

export default function FailurePage({ params, searchParams }: FailurePageProps) {
  const raffle = getRaffleById(params.id)
  const ticketCount = Number.parseInt(searchParams.tickets || "1")
  const ticketNumbers = searchParams.numbers ? searchParams.numbers.split(",") : []
  const errorReason = searchParams.error || "payment_failed"

  if (!raffle) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <FailureMessage
          raffle={raffle}
          ticketCount={ticketCount}
          ticketNumbers={ticketNumbers}
          errorReason={errorReason}
        />
      </div>
    </div>
  )
}
