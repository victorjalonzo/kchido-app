"use client"

import { useEffect, useRef } from "react"

interface ConfettiProps {
  duration?: number
  onComplete?: () => void
}

export default function Confetti({ duration = 3000, onComplete }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const confettiPieces: {
      x: number
      y: number
      size: number
      color: string
      speed: number
      angle: number
      rotation: number
      rotationSpeed: number
    }[] = []

    const colors = ["#00d65e", "#00c2c7", "#ff3a8c", "#ffcc00"]

    // Create confetti pieces
    for (let i = 0; i < 200; i++) {
      confettiPieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 3 + 2,
        angle: Math.random() * 2 * Math.PI,
        rotation: Math.random() * 2 * Math.PI,
        rotationSpeed: Math.random() * 0.2 - 0.1,
      })
    }

    let animationFrame: number
    const startTime = Date.now()

    const animate = () => {
      if (Date.now() - startTime > duration) {
        cancelAnimationFrame(animationFrame)
        if (onComplete) onComplete()
        return
      }

      context.clearRect(0, 0, canvas.width, canvas.height)

      confettiPieces.forEach((piece) => {
        context.save()
        context.translate(piece.x, piece.y)
        context.rotate(piece.rotation)
        context.fillStyle = piece.color
        context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size)
        context.restore()

        piece.y += piece.speed
        piece.x += Math.sin(piece.angle) * 2
        piece.rotation += piece.rotationSpeed

        // Reset if it goes off screen
        if (piece.y > canvas.height) {
          piece.y = -piece.size
          piece.x = Math.random() * canvas.width
        }
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [duration, onComplete])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: "100vw", height: "100vh" }}
    />
  )
}
