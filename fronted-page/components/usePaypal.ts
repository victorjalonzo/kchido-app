import { PaymentProviderAPI } from '@/lib/payment-provider.api';
import { useEffect, useState } from 'react'

export function usePayPal() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadScript = async () => {
      try {
        const clientId = await PaymentProviderAPI.getClientId()
        if (!clientId) return;

        // Evitar volver a cargar si ya está
        if (document.getElementById('paypal-sdk')) {
          setLoaded(true)
          return
        }

        const script = document.createElement('script')
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`
        script.id = 'paypal-sdk'
        script.onload = () => setLoaded(true)
        document.body.appendChild(script)
      } catch (error) {
        console.error('Error cargando el SDK de PayPal', error)
      }
    }

    loadScript()
  }, [])

  return loaded
}
