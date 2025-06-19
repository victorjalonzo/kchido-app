import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import PaymentProviderForm from "@/features/payment-providers/payment-provider-form"
import PermissionGuard from "@/features/auth/permission-guard"
import { PERMISSIONS } from "@/features/auth/permission-enum"

export default function PaymentProvidersPage() {
  return (
    <PermissionGuard permission={PERMISSIONS.MANAGE_PAYMENT_METHODS}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proveedor de pago</h1>
          <p className="text-muted-foreground">Configura y administra integraciones de proveedores de pagos.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Integración con PayPal</CardTitle>
              <CardDescription>Configura tus ajustes de integración de PayPal.</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentProviderForm provider="paypal" />
            </CardContent>
          </Card>
        </div>
      </div>
    </PermissionGuard>
  )
}
