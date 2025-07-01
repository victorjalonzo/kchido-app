import { addKeyword, EVENTS } from "@builderbot/bot";
import { Validator } from "../util/message-validator.js";
import { ConversactionAbort } from "../util/exceptions.js";

export const faqFlow = addKeyword(EVENTS.ACTION)
.addAction(async (_, { flowDynamic, state }) => {
    const faq = [
        {
            question: '¿Como compro mis boletos?',
            answer: 'Lo puedes comprar a traves de *Whatsapp* al (920) 810-4193'
        },
        {
            question: '¿Como se elige al ganador?',
            answer: 'Todos nuestros sorteos se realizan en base al *Pawerboll* de Estados Unidos\n\nEl participante cuyo numero de boleto coincida con los ultimos 6 digitos del Pawerboll sera el ganador de todo lo que se junte de los boletos (las fechas seran publicadas en nuestra web y en el canal de Telegram.'
        },
        {
            question: '¿Que sucede cuando no hay un ganador?',
            answer: 'Todo el dinero se acumala para la siguiente loteria. (el premio sera doble para la siguente loteria)'
        },
        {
            question: '¿Donde se publican a los ganadores?',
            answer: 'Los ganadores seran publicados en nuestra pagina web loteriaentreamigos.com y en nuestro canal de Telegram.'
        },
        {
            question: '¿Formas de pagos para los boletos?',
            answer: 'Nuestras formas de pago son: *Zelle*, *Cashapp*, *Venmo* o tambien puedes mandarnos un mensaje a Whatsapp al (920) 810-4193 para otras formas de pago.'
        }
    ]

    state.update( { faq })

    const message = "*¿Que pregunta podria resolver tus dudas?*"
    + "\n\n"
    + faq.map((e, index) => `${index+1}. ${e.question}`).join("\n")

    const hint = `\n\n_❕ Escribe el numero de la pregunta que te interesa_`
    + Validator.getCancelHint()

    return await flowDynamic(message+hint)
})
.addAction({capture: true}, async (ctx, {state, flowDynamic, endFlow, fallBack }) => {
    try {
        const faq = state.get('faq')
        const option = Validator.getOption(ctx.body, faq)
        return await flowDynamic(option.answer)
    }
    catch(e) {
        if (e instanceof ConversactionAbort) return endFlow(e.message)
        return fallBack(e.message)
    }
})
.addAction(async (_, {flowDynamic}) => {
    const message = "¿Quieres elegir otra pregunta frecuente?"
    + "\n\n"
    + ['Si', 'No'].map((e, index) => `*${index+1}*. ${e}`).join('\n')

    const hint = `\n`
    + '\n*Opciones:*\n'
    + `\n_1️⃣ Escribe *1* para elegir otra pregunta_`
    + `\n_2️⃣ Escribe *2* para terminar la conversación._`

    return await flowDynamic(message+hint)
})
.addAction({capture: true}, async (ctx, {fallBack, endFlow, gotoFlow}) => {
    try {
        if (Validator.isAgree(ctx.body)) return gotoFlow(faqFlow)
        return endFlow('Ok! ☺️')
    }
    catch(e) {
        if (e instanceof ConversactionAbort) return endFlow(e.message)
        return fallBack(e.message)
    }
})