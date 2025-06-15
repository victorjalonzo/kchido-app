import { Controller, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { OrderService } from "src/Order/application/order.service";
import { OrderStatusAlreadySet } from "src/Order/domain/order.exception";

@Controller('payment-webhook')
export class PaymentWebhookController {
  constructor (private readonly orderService: OrderService){}
    
    @Post()
    async handle(@Req() req: Request, @Res() res: Response){
        const event = req.body;
        const orderId = event.resource.custom_id

        if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
          try {
            const order = await this.orderService.complete(orderId)
            console.log(order)
          }
          catch (e) {
            if (e instanceof OrderStatusAlreadySet) null
            else {
              console.log(`Something went wrong while receiving a webhook: ${e}`)
              return res.sendStatus(500)
            }
          }
        }
      
        res.sendStatus(200);
    }
}