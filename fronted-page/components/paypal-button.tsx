import { useEffect, useRef, useState } from 'react';
import { Order, OrderStatus } from '@/lib/order.type';
import { usePayPal } from './usePaypal';
import { OrderAPI } from '@/lib/order.api';

interface PaypalButtonProps {
  order: Order;
}

export default function PayPalButton({ order }: PaypalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const loaded = usePayPal();

  const checkOrderStatus = async () => {
    try {
      const currentOrder = await OrderAPI.getById(order.id)

      if (currentOrder.status === OrderStatus.COMPLETED) {
        window.location.href = `/success/${order.id}`;
      }
    } catch (e) {
      console.error("Error checking order status", e);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (loading) {
      interval = setInterval(checkOrderStatus, 3000); // cada 3 segundos
    }

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (!loaded || !paypalRef.current || !window.paypal) return;

    paypalRef.current.innerHTML = '';

    window.paypal.Buttons({
      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [
            {
              amount: { value: order.total },
              custom_id: order.id
            },
          ],
        });
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function () {
          setModalVisible(true);
          setLoading(true);
        });
      },
      onError: function (err) {
        console.error('❌ Error en el pago', err);
      },
    }).render(paypalRef.current);
  }, [loaded]);

  return (
    <>
      <div ref={paypalRef} style={{ display: modalVisible ? 'none' : 'block' }} />
      {modalVisible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center z-[99999]">
            <h2 className="text-xl font-semibold mb-2">Procesando pago...</h2>
            <p className="text-sm text-gray-600">Estamos confirmando tu orden. Por favor, espera.</p>
            <div className="mt-4">
              <div className="w-6 h-6 mx-auto border-4 border-dashed border-[#00c2c7] border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
