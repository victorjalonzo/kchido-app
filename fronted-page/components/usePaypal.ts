// hooks/usePayPalScript.ts
import { Config } from '@/shared/config';
import { useEffect, useState } from 'react';

export function usePayPal() {
  const [loaded, setLoaded] = useState(false);

  const clientId = Config.paypalClientId
  console.log('CLIENT ID: ', clientId)

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (document.getElementById('paypal-sdk')) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    script.id = 'paypal-sdk';
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, [clientId]);

  return loaded;
}
