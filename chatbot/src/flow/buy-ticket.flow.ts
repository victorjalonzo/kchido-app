import { addKeyword, EVENTS } from "@builderbot/bot";
import { RaffleAPI } from "../util/raffle.api.js";
import { Raffle } from "../util/raffle.type.js";
import { OrderAPI } from "../util/order.api.js";
import { CreateOrderPayload } from "../util/order.type.js";
import { CreateCustomerPayload, Customer, UpdateCustomerPayload } from "util/customer.type.js";
import { CustomerAPI } from "../util/customer.api.js";
import { AuthAPI } from "../util/auth.api.js";
import { Config } from "../shared/config.js";
import { Validator } from "../util/message-validator.js";
import { TicketSerial } from "../util/ticket-generator.js";


interface UserData {
    customer?: Customer
    choosenRaffle: Raffle
    choosenTicketAmount: number
    choosenTicketType: string
    choosenTickets: number[]
    choosenNumber: string
    choosenName: string
    choosenCountryState: string

    availableRaffles: Raffle[]
}

const PAGE_URL = Config.pageURL

//Entry flow
export const buyTicketFlow = addKeyword(EVENTS.ACTION)
.addAction( async (ctx, { gotoFlow, state, endFlow }) => {
    return gotoFlow(_chooseRaffleFlow)
})

//Raffle flow
export const _chooseRaffleFlow = addKeyword(EVENTS.ACTION)
.addAction(async (_, {flowDynamic, state, endFlow}) => {
    const availableRaffles = await RaffleAPI.getAll()

    if (!availableRaffles.length) {
        return endFlow('No tenemos sorteos disponibles en este momento.')
    }

    state.update({ availableRaffles })

    const message = `*¿En cual de los siguientes sorteos deseas participar?* 🏆`
    + `\n\n`
    + availableRaffles.map((raffle, index) => `*${index+1}*. ${raffle.name}`).join('\n')
    
    const hint = `\n\n_Escribe el numero del sorteo en que deseas participar._`

    return await flowDynamic(message + hint)

})
.addAction({capture: true}, async (ctx, {fallBack, state, gotoFlow}) => {
    try {
        const availableRaffles = state.get('availableRaffles')
        const choosenRaffle = Validator.getOption(ctx.body, availableRaffles)

        state.update({ choosenRaffle })

        return gotoFlow(_chooseTicketAmountFlow)
    }
    catch (e) {
        return fallBack(e.message)
    }
})

//Ticket amount flow
export const _chooseTicketAmountFlow = addKeyword(EVENTS.ACTION)
.addAction(async (_, {flowDynamic, state}) => {
    const raffle = <Raffle>state.get('choosenRaffle')
    const precio = raffle.pricePeerTicket
    const message = `*¿Cuantos boletos te gustaria comprar? 🎫*`
    + `\n\n`
    + `Precio de boleto: ${precio} USD`

    const hint = '\n\n_Escribe la cantidad de boletos que quieres comprar_'

    return await flowDynamic(message + hint)
})
.addAction({capture: true}, async (ctx, { state, fallBack, gotoFlow}) => {
    try {
        const choosenTicketAmount = Validator.getNumber(ctx.body)
        state.update({ choosenTicketAmount })

        return gotoFlow(_chooseTicketTypeFlow)
    }
    catch(e) {
        return fallBack(e.message)
    }
})

//Ticket Type flow 
export const _chooseTicketTypeFlow = addKeyword(EVENTS.ACTION)
.addAction(async (_ , { state, flowDynamic }) => {
    const choosenTicketAmount = state.get('choosenTicketAmount')
    const message = (choosenTicketAmount > 1 
        ? `*¿Quieres generar los numeros de tus boletos automaticamente?* 🤖`
        : `*¿Quieres generar el numero de tu boleto automaticamente?* 🤖`
    )
    + `\n\n`
    + ['Si', 'No'].map((e, index) => `*${index+1}*. ${e}`).join('\n')

    const hint = `\n`
    + `\n_Escribe *1* para generar automaticamente_`
    + `\n_Escribe *2* para introducirlos manualmente._`

    return await flowDynamic(message + hint)
})
.addAction({capture: true}, async (ctx, {fallBack, gotoFlow }) => {
    try {
        return Validator.isAgree(ctx.body)
        ? gotoFlow(_chooseGeneratedTicketFlow)
        : gotoFlow(_chooseManualTicketFlow)
    }
    catch (e) {
        return fallBack(e.message)
    }
})

//Ticket Generation Flow 
export const _chooseGeneratedTicketFlow = addKeyword(EVENTS.ACTION)
.addAction(async (_, { flowDynamic, state }) => {
    await flowDynamic('Generando boletos...')

    const choosenTicketAmount = state.get('choosenTicketAmount')
    const choosenTickets = TicketSerial.generate(choosenTicketAmount)

    state.update( { choosenTickets })

    const message = (choosenTickets.length > 1
        ? `Tus boletos generados son:`
        : `Tu boleto generado es:`
    )
    + `\n\n ${choosenTickets.map((ticket, index) => `${index+1}. *${ticket}*`).join('\n')}`

    return await flowDynamic(message)
})
.addAction(async (_, { flowDynamic }) => {
    const message = `*Deseas continuar con estos boletos?*`
    + `\n\n`
    + ['Si', 'No'].map((option, index) =>  `*${index+1}*. ${option}`).join('\n')

    const hint = '\n'
    + '\n_Escribe *1* para continuar con los boletos_'
    + '\n_Escribe *2* para seleccionar otros boletos_'

    await flowDynamic(message + hint)

})
.addAction({ capture: true}, async (ctx, {fallBack, gotoFlow}) => {
    try {
        if (!Validator.isAgree(ctx.body)) return gotoFlow(_chooseTicketTypeFlow)
        return gotoFlow(_providePersonalInformation)
    }
    catch (e) {
        return fallBack(e.message)
    }
})

export const _chooseManualTicketFlow = addKeyword(EVENTS.ACTION)
.addAction(async (_, { flowDynamic, state }) => {
    const choosenTicketAmount = state.get('choosenTicketAmount')
    const choosenTickets = state.get('choosenTickets') ?? []
    const currentIndex = choosenTickets.length + 1

    const message = choosenTicketAmount > 1
    ? `*Escribe el numero de tu boleto #${currentIndex}*`
    : `*Escribe el numero de tu boleto`

    const hint = choosenTicketAmount > 1 
    ? `\n\n_Escribe un numero de *6 digitos* para tu boleto #${currentIndex}_`
    : `\n\n_Escribe un numero de *6 digitos* para tu boleto_`

    return await flowDynamic(message + hint)
})
.addAction({ capture: true }, async (ctx, { state, flowDynamic, gotoFlow}) => {
    const choosenTicket = ctx.body
    const choosenTicketAmount = state.get('choosenTicketAmount')
    const choosenTickets = state.get('choosenTickets') ?? []

    choosenTickets.push(choosenTicket)

    state.update({ choosenTickets })

    if (choosenTickets.length < choosenTicketAmount) {
        return gotoFlow(_chooseManualTicketFlow)
    }

    const message = `*¿Deseas continuar con estos boletos?*`
    + '\n'
    + choosenTickets.map((ticket, index) => `${index+1}. ${ticket}`).join('\n')
    + '\n\n'
    + ['Si', 'No'].map((option, index) =>  `*${index+1}*. ${option}`).join('\n')

    const hint = '\n'
    + '\n_Escribe *1* para continuar con los boletos_'
    + '\n_Escribe *2* para seleccionar otros boletos_'

    return flowDynamic(message + hint)
})
.addAction({capture: true}, async (ctx, { gotoFlow, fallBack}) => {
    try {
        if (!Validator.isAgree(ctx.body)) {
            return gotoFlow(_chooseTicketTypeFlow)
        }
        
        return gotoFlow(_providePersonalInformation)
    }
    catch(e) {
        return fallBack(e.message)
    }
})


//Provide personal information flow
export const _providePersonalInformation = addKeyword(EVENTS.ACTION)
.addAction(async (_, {flowDynamic, gotoFlow, state}) => {
    const customer = state.get('customer')

    if (customer) {
        state.update({ 
            choosenName: customer.name,
            choosenCountryState: customer.countryState,
            choosenNumber: customer.number
         })
         return gotoFlow(_confirmPersonalInformation)
    }

    const message = `Ya que es tu primera vez participando en nuestro sorteo voy a necesitar algunos datos 🙂`
    await flowDynamic(message)
    return gotoFlow(_provideFirstTimeNumberFlow)
})

//Provide number for first time flow
export const _provideFirstTimeNumberFlow = addKeyword(EVENTS.ACTION)
.addAction(async (ctx, {flowDynamic}) => {
    const currentNumber = ctx.from
    const message = `*¿Quieres utilizar tu numero actual _${currentNumber}_ como numero de contacto para comunicarnos contigo?* ☎️`
    + `\n\n`
    + ['Si', 'No'].map((option, index) => `*${index+1}*. ${option}`).join('\n')

    const hint = `\n`
    + `\n_Escribe *1* para seleccionar tu numero actual_`
    + `\n_Escribe *2* para elegir otro_`

    return await flowDynamic(message + hint)
})
.addAction({capture: true}, async (ctx, { state, flowDynamic, gotoFlow }) => {
    if (!Validator.isAgree(ctx.body)) return

    const choosenNumber = ctx.from
    state.update({ choosenNumber })

    await flowDynamic(`Haz seleccionado el numero *${choosenNumber}* como numero de contacto.`)
    return gotoFlow(_provideFirstTimeNameFlow)
})

export const _provideManualContactNumber = addKeyword(EVENTS.ACTION)
.addAction(async (_, {flowDynamic}) => {
    const message = `*¿Cual es el numero de telefono que quieres utilizar como numero de contacto?*`
    const hint = `\n\n_Escribe el numero de telefono que deseas utilizar como numero de contacto_`

    return await flowDynamic(message + hint)
})
.addAction({capture: true}, async (ctx, { flowDynamic, fallBack, state, gotoFlow }) => {
    try {
        const choosenNumber = Validator.getNumber(ctx.body)
        state.update( { choosenNumber })

        await flowDynamic(`Haz seleccionado el numero *${choosenNumber}* como numero de contacto.`)
        return gotoFlow(_provideFirstTimeNameFlow)
    }
    catch(e) {
        return fallBack(e.message)
    }
})

//Provide name for first time flow
export const _provideFirstTimeNameFlow = addKeyword(EVENTS.ACTION)
.addAction(async (_, { flowDynamic }) => {
    const message = `*¿Cual es tu nombre?*`
    const hint = `\n\n_Escribe tu nombre_`
    return await flowDynamic(message + hint)
})
.addAction({capture: true}, async (ctx, { flowDynamic, state, gotoFlow }) => {
    const choosenName = ctx.body
    state.update({ choosenName })
    await flowDynamic(`Haz establecido tu nombre como: *${choosenName}*`)

    return gotoFlow(_provideFirstTimeCountryStateFlow)
})


//Provide country state for first time
export const _provideFirstTimeCountryStateFlow = addKeyword(EVENTS.ACTION)
.addAction(async (_, { flowDynamic }) => {
    const message = `*¿A que estado perteneces dentro de los Estados Unidos? 🇺🇸*`
    const hint = `\n\n_Escribe tu estado dentro de los Estados Unidos_`
    return await flowDynamic(message + hint)
})
.addAction({capture: true}, async (ctx, { flowDynamic, state, gotoFlow }) => {
    const choosenCountryState = ctx.body
    state.update({ choosenCountryState })
    await flowDynamic(`Haz establecido tu estado como: *${choosenCountryState}*`)

    return gotoFlow(_confirmPersonalInformation)
})

export const _confirmPersonalInformation = addKeyword(EVENTS.ACTION)
.addAction(async (_, { flowDynamic, state }) => {
    const currentState = <UserData>state.getMyState()
    
    const message = `*Estos datos son correctos?*`
    + '\n'
    + `*\nNombre: *${currentState.choosenName}`
    + `\nEstado: *${currentState.choosenCountryState}*`
    + `\nNumero de contacto: *${currentState.choosenNumber}*`
    + '\n'
    + ['Si', 'No'].map((option, index) => `*${index+1}*. ${option}`).join('\n')

    const hint = "\n"
    + "\n_Escribe *1* para confirmar_"
    + "\n_Escribe *2* para volver a seleccionar_"

    return await flowDynamic(message+hint)
})
.addAction({capture: true}, async (ctx, { flowDynamic, fallBack, gotoFlow, state }) => {
    try {
        if (!Validator.isAgree(ctx.body)) {
            flowDynamic('Entiendo, te pedire tu informacion nuevamente.')
            return gotoFlow(_provideFirstTimeNameFlow)
        }
        await flowDynamic('Gracias por confirmar tu informacion personal.')

        const currentState = state.getMyState()

        let customer: Customer | null = null

        if (!currentState.customer) {
            const payload: CreateCustomerPayload = {
                name: currentState.choosenName,
                number: currentState.choosenNumber,
                role: 'customer'
            }
            customer = await CustomerAPI.create(payload)
        }
        else {
            const payload: UpdateCustomerPayload = {
                id: currentState.customer.id,
                name: currentState.choosenName,
                number: currentState.choosenNumber
            }

            customer = await CustomerAPI.update(payload)
        }

        state.update( { customer })

        return gotoFlow(_resumenFlow)
    }catch(e) {
        return fallBack(e.message)
    }
})

// Resumen information
export const _resumenFlow = addKeyword(EVENTS.ACTION)
.addAction(async (_, { flowDynamic, state }) => {
    const currentState = <UserData>state.getMyState()

    const message = `*¿Desea proceder con su compra?*`
    + `\n\n`
    + `Nombre: *${currentState.choosenName}*\n`
    + `Estado: *${currentState.choosenCountryState}*\n`
    + `Numero de contacto: *${currentState.choosenNumber}*\n`
    + `Cantidad de boletos: *${currentState.choosenTicketAmount}*\n`
    + `\n`
    + `Total: *${currentState.choosenRaffle.pricePeerTicket * currentState.choosenTicketAmount} USD*`
    + `\n\n`
    + ['Si', 'No'].map((option, index) => `*${index+1}*. ${option}`).join('\n')

    return await flowDynamic(message)
})
.addAction({capture: true}, async (ctx, {flowDynamic, state}) => {
    if (!Validator.isAgree(ctx.body)) {
        return await flowDynamic('La compra ha sido cancelada.')
    }

    const currentState = <UserData>state.getMyState()
    const customer = currentState.customer

    const chatbotUser = await AuthAPI.getMe()

    const payload: CreateOrderPayload = {
        raffleId: currentState.choosenRaffle.id,
        userId: customer.id, 
        tickets: currentState.choosenTickets,
        total: currentState.choosenRaffle.pricePeerTicket * currentState.choosenTicketAmount,
        paymentMethod: 'Paypal',
        assistedBy: chatbotUser.id
    }

    const order = await OrderAPI.create(payload)
    const checkoutURL = `${PAGE_URL}/checkout/${order.id}`

    return await flowDynamic([
        'Perfecto',
        'Completa el pago de tu compra en el siguiente enlace:',
        checkoutURL
    ])
})