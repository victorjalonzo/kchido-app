import { addKeyword, EVENTS } from "@builderbot/bot";
import { buyTicketFlow } from "./buy-ticket.flow.js";
import { Validator } from "../util/message-validator.js";
import { ConversactionAbort } from "../util/exceptions.js";
import { faqFlow } from "./faq.flow.js";

export const menuFlow = addKeyword(EVENTS.ACTION)
.addAction(async (_, { flowDynamic, state }) => {
    const customer = state.get('customer');

    const customerName = customer
      ? customer.name[0].toUpperCase() + customer.name.slice(1).toLowerCase()
      : '';

    const availableMenuOptions = [
        { id: 1, label: 'Comprar boletos de sorteos 🏆', flow: buyTicketFlow},
        { id: 2, label: 'Ver preguntas frecuentes ❓', flow: faqFlow}
    ]

    state.update( { availableMenuOptions })

    const message = `*¿En que te puedo ayudar ${customerName}?* 😁`
    +'\n'
    + availableMenuOptions.map((option) => `\n*${option.id}.* ${option.label}`)

    const hint = "\n"
    + "\n*Opciones*\n"
    + '\n_1️⃣ Selecciona *1* para comprar boletos_'
    + '\n_2️⃣ Selecciona *2* para ver las preguntas frecuentes_'
    + Validator.getCancelHint()

     await flowDynamic(message + hint)

})
.addAction({ capture: true }, async (ctx, {fallBack, gotoFlow, state, endFlow }) => {
    try {
        const availableMenuOptions = state.get('availableMenuOptions')
        const option = Validator.getOption(ctx.body, availableMenuOptions)

        return gotoFlow(option.flow)
    }
    catch(e) {
        if (e instanceof ConversactionAbort) return endFlow(e.message)
        return fallBack(e.message)
    }
})