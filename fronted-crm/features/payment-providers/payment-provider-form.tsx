"use client"

import type React from "react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"
import { usePaymentProvider } from "./hooks/usePaymentProvider"

interface PaymentProviderFormProps {
  provider: "paypal"
}

export default function PaymentProviderForm({ provider }: PaymentProviderFormProps) {
  const {
    isConnected,
    isLoading,
    handleSubmit,
    handleDisconnect,
    setCredentials,
    credentials
  } = usePaymentProvider()
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
                (!(credentials.clientId && credentials.clientSecret))
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
