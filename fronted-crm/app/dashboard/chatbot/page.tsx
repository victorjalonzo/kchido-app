//"use client"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import ChatbotForm from "@/features/chatbot/chatbot-form"
import { useAuth } from "@/features/auth/auth-provider"
import PermissionGuard from "@/features/auth/permission-guard"
import { PERMISSIONS } from "@/features/auth/permission-enum"

export default function ChatbotPage() {
  //const { user } = useAuth()
  //if (!user?.permissions.manageChatbot) window.location.href = '/dashboard'

  return (
    <PermissionGuard permission={PERMISSIONS.MANAGE_CHATBOTS}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chatbot</h1>
          <p className="text-muted-foreground">Configurar y administrar la configuración del chatbot</p>
        </div>

        <div className="grid gap-6 md:grid-cols-1">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Chatbot Configuración</CardTitle>
              <CardDescription>Personaliza la configuración y la apariencia de tu chatbot.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChatbotForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </PermissionGuard>
  )
}
