import { useAuth } from "@/features/auth/auth-provider"
import { useToast } from "@/shared/hooks/use-toast"
import { useState } from "react"

export function useSecurity () {
  const authProvider = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (security.newPassword !== security.confirmPassword) {
      return toast({
        title: "Error",
        description: "La nueva contraseña no coincide con la confirmación.",
        variant: "destructive",
      })
    }

    if (!security.currentPassword || !security.newPassword) {
      return toast({
        title: "Error",
        description: "Por favor, completa todos los campos de la contraseña.",
        variant: "destructive",
      })
    } 

    try {
      setIsLoading(true)

      const payload = {
        password: security.currentPassword,
        newPassword: security.newPassword
      }

      await authProvider.update(payload)

      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña se ha actualizado correctamente.",
      })

      setSecurity({
        ...security,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (e) {
      toast({
        title: "Error al actualizar la contraseña",
        description: "Hubo un problema al intentar actualizar tu contraseña. Inténtalo nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    security,
    setSecurity,
    isLoading,
    handleSubmit
  }
}
