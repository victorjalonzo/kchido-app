import { useToast } from "@/shared/hooks/use-toast"
import { useEffect, useState } from "react"
import { PaymentProviderAPI } from "../api/payment-provider.api"
import { CreatePaymentProviderPayload } from "../types/create-payment-provider.payload"

export function usePaymentProvider() {
    const { toast } = useToast()

    const [isConnected, setIsConnected] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
  
    const [credentials, setCredentials] = useState({
      clientId: "",
      clientSecret: "",
    })
  
    useEffect(() => {
      const fetchData = async () => {
        await PaymentProviderAPI.getPaypal()
        .then(provider => {
          setCredentials({
            clientId: provider.clientId,
            clientSecret: provider.clientSecret
          })
  
          setIsConnected(true)
        })
        .catch(e => {
          console.log(e)
          setIsConnected(false)
        })
  
        setIsLoading(false)
      }
  
      fetchData()
    }, [])
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
    
      try {
        const payload: CreatePaymentProviderPayload = {
          name: 'paypal',
          clientId: credentials.clientId,
          clientSecret: credentials.clientSecret
        }
  
        await PaymentProviderAPI.create(payload)
    
        setIsConnected(true)
        toast({
          title: "Proveedor conectado",
          description: `El proveedor de pago ha sido conectado exitosamente.`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo conectar el proveedor de pago.",
        })
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
  
    const handleDisconnect = async () => {
      setIsLoading(true)
  
      try {
        await PaymentProviderAPI.delete()
        setIsConnected(false)
  
        setCredentials({
          ...credentials,
          clientId: "",
          clientSecret: "",
        })
  
        toast({
          title: "Proveedor desconectado",
          description: `El proveedor de pago ha sido desconectado`,
        })
      }
      catch(error) {
        toast({
          title: "Error",
          description: "No se pudo conectar el proveedor de pago.",
        })
        console.error(error)
      }
      finally {
        setIsLoading(false)
      }
    }

    return {
        isConnected,
        isLoading,
        handleSubmit,
        handleDisconnect,
        setCredentials,
        credentials
    }
  
}