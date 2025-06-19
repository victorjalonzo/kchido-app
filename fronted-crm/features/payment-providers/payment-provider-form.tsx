"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"
import { useToast } from "@/shared/components/ui/use-toast"

interface PaymentProviderFormProps {
  provider: "paypal" | "stripe"
}

export default function PaymentProviderForm({ provider }: PaymentProviderFormProps) {
  const { toast } = useToast()
  // Mock state for if the provider is connected
  const [isConnected, setIsConnected] = useState(provider === "stripe")
  const [isLoading, setIsLoading] = useState(false)

  // Mock credentials
  const [credentials, setCredentials] = useState({
    apiKey: provider === "stripe" ? "sk_test_123456789" : "",
    clientId: provider === "paypal" ? "" : "",
    clientSecret: provider === "paypal" ? "" : "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsConnected(true)
      setIsLoading(false)
      toast({
        title: "Success",
        description: `${provider === "paypal" ? "PayPal" : "Stripe"} settings updated successfully.`,
      })
    }, 1000)
  }

  const handleDisconnect = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsConnected(false)
      setCredentials({
        ...credentials,
        apiKey: "",
        clientId: "",
        clientSecret: "",
      })
      setIsLoading(false)
      toast({
        title: "Success",
        description: `${provider === "paypal" ? "PayPal" : "Stripe"} disconnected successfully.`,
      })
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-lg font-medium">{provider === "paypal" ? "PayPal" : "Stripe"} Status</h3>
          <p className="text-sm text-muted-foreground">
            {isConnected
              ? `Tu cuenta de ${provider === "paypal" ? "PayPal" : "Stripe"} esta connectada`
              : `Conecta tu cuenta de ${provider === "paypal" ? "PayPal" : "Stripe"}`}
          </p>
        </div>
        <Switch
          checked={isConnected}
          onCheckedChange={(checked) => {
            if (!checked) {
              handleDisconnect()
            }
          }}
          disabled={isLoading}
        />
      </div>

      {provider === "paypal" ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="clientId">ID de Cliente</Label>
            <Input
              id="clientId"
              value={credentials.clientId}
              onChange={(e) => setCredentials({ ...credentials, clientId: e.target.value })}
              disabled={isConnected || isLoading}
              placeholder="ID de cliente de PayPal"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientSecret">Token del Cliente</Label>
            <Input
              id="clientSecret"
              type="password"
              value={credentials.clientSecret}
              onChange={(e) => setCredentials({ ...credentials, clientSecret: e.target.value })}
              disabled={isConnected || isLoading}
              placeholder="Token Secreto del Cliente de PayPal"
            />
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            type="password"
            value={credentials.apiKey}
            onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
            disabled={isConnected || isLoading}
            placeholder="Stripe API Key"
          />
        </div>
      )}

      <div className="flex justify-end gap-3">
        {isConnected ? (
          <Button type="button" variant="destructive" onClick={handleDisconnect} disabled={isLoading}>
            Desconectar
          </Button>
        ) : (
          <>
            <Button
              type="submit"
              disabled={
                isLoading ||
                (provider === "paypal" ? !(credentials.clientId && credentials.clientSecret) : !credentials.apiKey)
              }
            >
              Connectar
            </Button>
          </>
        )}
      </div>
    </form>
  )
}
