// components/PayPalButton.tsx
import { useEffect, useRef } from 'react';
import { usePayPal } from './usePaypal';
import { Order } from '@/lib/order.type';

interface PaypalButtonProps {
    order: Order
}

export default function PayPalButton({ order }: PaypalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const loaded = usePayPal();

  useEffect(() => {
    if (!loaded || !paypalRef.current || !window.paypal) return;

    // Evita renderizar múltiples veces
    paypalRef.current.innerHTML = '';

    window.paypal.Buttons({
      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [
            {
              amount: {value: order.total},
              custom_id: order.id 
            },
          ],
        });
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
          window.location.href = `/success/${order.id}`
          //return SuccessPage({ order })
        });
      },
      onError: function (err) {
        console.error('❌ Error en el pago', err);
      },
    }).render(paypalRef.current);
  }, [loaded]);

  return <div ref={paypalRef} />;
}

