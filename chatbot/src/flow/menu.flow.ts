import { addKeyword, EVENTS } from "@builderbot/bot";
import { buyTicketFlow } from "./buy-ticket.flow.js";

export const menuFlow = addKeyword(EVENTS.ACTION)
.addAction(async (_, { flowDynamic }) => {
    const message = '*¿En que te puedo ayudar?* 😁'
    +'\n'
    + `\n*1*. Comprar boletos de sorteos 🏆`
    + `\n*2*. Ver preguntas frecuentes ❓`

    await flowDynamic(message)

})
.addAction({ capture: true }, async (ctx, {flowDynamic, fallBack, gotoFlow}) => {
    switch(ctx.body) {
        case '1': return gotoFlow(buyTicketFlow)
        case '2': return gotoFlow(buyTicketFlow)
        
        default:
            await flowDynamic('Porfavor seleccione una opcion numerica valida.')
            return fallBack()
    }
})