"use client"

import { useState, useEffect } from "react"

export default function CountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime()

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  return (
    <div className="flex justify-center gap-4 text-center">
      {timeLeft.days > 0 && (
        <div className="bg-black text-white rounded-lg p-3 min-w-20">
          <div className="text-2xl md:text-3xl font-bold">{timeLeft.days}</div>
          <div className="text-xs uppercase opacity-80">Días</div>
        </div>
      )}
      <div className="bg-black text-white rounded-lg p-3 min-w-20">
        <div className="text-2xl md:text-3xl font-bold">{timeLeft.hours.toString().padStart(2, "0")}</div>
        <div className="text-xs uppercase opacity-80">Horas</div>
      </div>
      <div className="bg-black text-white rounded-lg p-3 min-w-20">
        <div className="text-2xl md:text-3xl font-bold">{timeLeft.minutes.toString().padStart(2, "0")}</div>
        <div className="text-xs uppercase opacity-80">Minutos</div>
      </div>
      <div className="bg-black text-white rounded-lg p-3 min-w-20">
        <div className="text-2xl md:text-3xl font-bold">{timeLeft.seconds.toString().padStart(2, "0")}</div>
        <div className="text-xs uppercase opacity-80">Segundos</div>
      </div>
    </div>
  )
}
