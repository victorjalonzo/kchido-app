"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { MessageSquare } from "lucide-react"

export default function ChatbotPreview() {
  const [isOpen, setIsOpen] = useState(true)
  const [message, setMessage] = useState("")

  // Mock chat messages
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm here to help you with any questions about our raffles." },
  ])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    // Add user message
    setMessages([...messages, { sender: "user", text: message }])
    setMessage("")

    // Simulate bot response after a delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Thanks for your message! One of our team members will get back to you shortly.",
        },
      ])
    }, 1000)
  }

  return (
    <div className="border rounded-lg overflow-hidden h-[400px] flex flex-col bg-background">
      <div className="bg-primary p-3 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Chatbot" />
            <AvatarFallback>RA</AvatarFallback>
          </Avatar>
          <span className="font-medium">Raffle Assistant</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-primary/90"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✕" : <MessageSquare className="h-5 w-5" />}
        </Button>
      </div>

      {isOpen && (
        <>
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit">Send</Button>
          </form>
        </>
      )}
    </div>
  )
}
