import { useAuth } from "@/features/auth/auth-provider"
import { useImageUpload } from "@/shared/hooks/use-image-upload"
import { useToast } from "@/shared/hooks/use-toast"
import { Base64 } from "@/shared/lib/base64"
import { useEffect, useState } from "react"

export function useAccount () {
    const { toast } = useToast()
    const { user, update } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    
    const {
      fileInputRef,
      previewUrl,
      file,
      handleImageUpload,
      handleFileChange
    } = useImageUpload()
  
    const [userData, setUserData] = useState({
      name: user?.name || "",
      email: user?.email || "",
      number: user?.number || "",
      image: undefined
    })

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
      

      if (file) userData.image = await Base64.convert(file)
  
      try {
        await update(userData)
        toast({
          title: "Perfil actualizado",
          description: "Tu información personal se ha guardado correctamente.",
        })
      } catch (error) {
        toast({
          title: "Error al actualizar",
          description: "No se pudo actualizar tu perfil. Intenta nuevamente más tarde.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  
    useEffect(() => {
      return () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
      };
    }, [previewUrl]);


    return {
        userData,
        user,
        setUserData,
        isLoading,
        fileInputRef,
        previewUrl,
        handleSubmit,
        handleImageUpload,
        handleFileChange
    }
}