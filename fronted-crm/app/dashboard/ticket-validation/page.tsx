import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { PlusCircle } from "lucide-react"
import OrderCreationModal from "@/features/tickets/order-creation-modal"
import PermissionGuard from "@/features/auth/permission-guard"
import { PERMISSIONS } from "@/features/auth/permission-enum"

export default function TicketValidationPage() {
  return (
    <PermissionGuard permission={PERMISSIONS.MANAGE_TICKETS}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Emision de boletos</h1>
            <p className="text-muted-foreground">Crea ordenes para los clientes.</p>
          </div>
          <OrderCreationModal>
            <Button size="sm" className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              Crear Orden
            </Button>
          </OrderCreationModal>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Crea ordenes de boletos</CardTitle>
            <CardDescription>
            Cree nuevas ordenes de boletos seleccionando un sorteo, especificando la cantidad de boletos y asignándolos a un cliente.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mx-auto flex max-w-md flex-col items-center justify-center space-y-4">
              <div className="rounded-full bg-primary/10 p-6">
                <PlusCircle className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-medium">Crear nueva orden</h3>
              <p className="text-muted-foreground">
              Crea una orden  seleccionando un sorteo e indicando la cantidad de boletos. Puedes asignar el pedido a un cliente existente o crear uno nuevo.
              </p>
              <OrderCreationModal>
                <Button size="lg" className="mt-2">
                  Crear Orden
                </Button>
              </OrderCreationModal>
            </div>
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  )
}
