import { addKeyword, EVENTS, utils } from "@builderbot/bot";
import { RaffleAPI } from "../util/raffle.api.js";
import { Raffle, RaffleStatus, UpdateRafflePayload } from "../util/raffle.type.js";
import { OrderAPI } from "../util/order.api.js";
import { CreateOrderPayload } from "../util/order.type.js";
import { CreateCustomerPayload, Customer, UpdateCustomerPayload } from "../util/customer.type.js";
import { CustomerAPI } from "../util/customer.api.js";
import { AuthAPI } from "../util/auth.api.js";
import { Config } from "../shared/config.js";
import { Validator } from "../util/message-validator.js";
import { TicketSerial } from "../util/ticket-generator.js";
import { Task, TaskStatus, UpdateSubTaskPayload, UpdateTaskPayload } from "../util/tasks.type.js";
import { TicketAPI } from "../util/ticket.api.js";
import { writeFileSync } from "fs";
import * as path from 'path'
import { SubTaskAPI } from "../util/subTask.api.js";
import { TaskAPI } from "../util/task.api.js";
import { ConversactionAbort } from "../util/exceptions.js";
import { BaileysProvider } from "@builderbot/provider-baileys";


interface UserData {
    customer?: Customer
    choosenRaffle: Raffle
    choosenTicketAmount: number
    choosenTicketType: string
    choosenTickets: number[]
    choosenNumber: string
    choosenContactNumber: string 
    choosenName: string
    choosenCountry: string,
    choosenState: string

    availableRaffles: Raffle[]
}

const PAGE_URL = Config.pageURL

//Entry flow
export const buyTicketFlow = addKeyword(EVENTS.ACTION)
.addAction( async (_, { gotoFlow, provider }) => {
    const sock = provider.vendor
    sock
    return gotoFlow(_chooseRaffleFlow)
})

//Raffle flow
export const _chooseRaffleFlow = addKeyword(EVENTS.ACTION)
.addAction(async (_, {flowDynamic, state, endFlow}) => {
    const availableRaffles = await RaffleAPI.getAll({ status: RaffleStatus.ONGOING, visibility: 'public' })

    if (!availableRaffles.length) {
        return endFlow('No tenemos sorteos disponibles en este momento.')
    }

    state.update({ availableRaffles })

    const message = `*¿En cual de los siguientes sorteos deseas participar?* 🏆`
    + `\n\n`
    + availableRaffles.map((raffle, index) => `*${index+1}*. ${raffle.name}`).join('\n')
    
    const hint = `\n\n_❕ Escribe el numero del sorteo en que deseas participar._`
    + Validator.getCancelHint()

    return await flowDynamic(message + hint)

})
.addAction({capture: true}, async (ctx, {fallBack, state, gotoFlow, endFlow}) => {
    try {
        const availableRaffles = state.get('availableRaffles')
        const choosenRaffle = Validator.getOption(ctx.body, availableRaffles)

        state.update({ choosenRaffle })

        return gotoFlow(_chooseTicketAmountFlow)
    }
    catch (e) {
        if (e instanceof ConversactionAbort) return endFlow(e.message)
        return fallBack(e.message)
    }
})

//Ticket amount flow
export const _chooseTicketAmountFlow = addKeyword(EVENTS.ACTION)
.addAction(async (_, {flowDynamic, state}) => {
    const raffle = <Raffle>state.get('choosenRaffle')

    await flowDynamic(`Este sorteo *${raffle.name}* tiene un monto acumulado de *${raffle.initialAmount + raffle.accumulated} USD*. El precio por boleto es de *${raffle.pricePeerTicket} USD*.`)

    const message = `*¿Cuantos boletos te gustaria comprar? 🎫*`

    const hint = '\n\n_❕ Escribe la cantidad numerica de boletos que quieres comprar_'
    + Validator.getCancelHint()

    return await flowDynamic(message + hint)
})
.addAction({capture: true}, async (ctx, { state, fallBack, gotoFlow, endFlow}) => {
    try {
        const choosenTicketAmount = Validator.getNumber(ctx.body)
        state.update({ choosenTicketAmount })

        return gotoFlow(_chooseTicketTypeFlow)
    }
    catch(e) {
        if (e instanceof ConversactionAbort) return endFlow(e.message)
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
    + '\n*Opciones:*\n'
    + `\n_1️⃣ Escribe *1* para generar automaticamente_`
    + `\n_2️⃣ Escribe *2* para introducirlos manualmente._`
    + Validator.getCancelHint()

    return await flowDynamic(message + hint)
})
.addAction({capture: true}, async (ctx, {fallBack, gotoFlow, endFlow }) => {
    try {
        return Validator.isAgree(ctx.body)
        ? gotoFlow(_chooseGeneratedTicketFlow)
        : gotoFlow(_chooseManualTicketFlow)
    }
    catch (e) {
        if (e instanceof ConversactionAbort) return endFlow(e.message)
        return fallBack(e.message)
    }
})

//Ticket Generation Flow 
export const _chooseGeneratedTicketFlow = addKeyword(EVENTS.ACTION)
.addAction(async (_, { flowDynamic, state, gotoFlow }) => {
    await flowDynamic('Generando boletos...')

    const choosenTicketAmount = state.get('choosenTicketAmount')
    const choosenTickets = TicketSerial.generate(choosenTicketAmount)

    /*** *
    VERIFY IF THE TICKETS ARE ALREADY TAKEN HERE.
    IF THEY ARE TAKEN, GENERATE ANOTHER ONE. 
    ***/

    state.update( { choosenTickets })

    const message = (choosenTickets.length > 1
        ? `Tus boletos generados son:`
        : `Tu boleto generado es:`
    )
    + `\n\n ${choosenTickets.map((ticket, index) => `${index+1}. *${ticket}*`).join('\n')}`

    await flowDynamic(message)

    return gotoFlow(_confirmChoosenTickets)
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
    ? `\n\n_❕ Escribe un numero de *6 digitos* para tu boleto #${currentIndex}_`
    : `\n\n_❕ Escribe un numero de *6 digitos* para tu boleto_`
    + Validator.getCancelHint()

    return await flowDynamic(message + hint)
})
.addAction({ capture: true }, async (ctx, { state, flowDynamic, gotoFlow, fallBack, endFlow}) => {
    try {
        const choosenTicket = ctx.body
        const choosenTicketAmount = state.get('choosenTicketAmount')
        const choosenTickets = state.get('choosenTickets') ?? []
    
        choosenTickets.push(choosenTicket)
    
        state.update({ choosenTickets })
    
        if (choosenTickets.length < choosenTicketAmount) {
            return gotoFlow(_chooseManualTicketFlow)
        }
    
        const message = (choosenTickets.length > 1
            ? `Tus boletos seleccionados son:`
            : `Tu boleto seleccionado es:`
        )
        + `\n\n ${choosenTickets.map((ticket, index) => `${index+1}. *${ticket}*`).join('\n')}`
    
        await flowDynamic(message)
    
        return gotoFlow(_confirmChoosenTickets)
    }
    catch(e) {
        if (e instanceof ConversactionAbort) return endFlow(e.message)
        return fallBack(e.message)
    }
})

export const _confirmChoosenTickets = addKeyword(EVENTS.ACTION)
.addAction(async (_, { flowDynamic }) => {
    const message = `*Deseas continuar con estos boletos?*`
    + `\n\n`
    + ['Si', 'No'].map((option, index) =>  `*${index+1}*. ${option}`).join('\n')

    const hint = '\n'
    + "\n*Opciones:*\n"
    + '\n_1️⃣ Escribe *1* para continuar con los boletos_'
    + '\n_2️⃣ Escribe *2* para seleccionar otros boletos_'
    + Validator.getCancelHint()

    await flowDynamic(message + hint)
})
.addAction({ capture: true}, async (ctx, {fallBack, gotoFlow, endFlow}) => {
    try {
        if (!Validator.isAgree(ctx.body)) return gotoFlow(_chooseTicketTypeFlow)
        return gotoFlow(_providePersonalInformation)
    }
    catch (e) {
        if (e instanceof ConversactionAbort) return endFlow(e.message)
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
            choosenCountry: customer.country,
            choosenState: customer.state,
            choosenNumber: customer.number,
            choosenContactNumber: customer.contactNumber
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
    const message = `*¿Quieres utilizar tu numero actual ${currentNumber} como numero de contacto para comunicarnos contigo?* ☎️`
    + `\n\n`
    + ['Si', 'No'].map((option, index) => `*${index+1}*. ${option}`).join('\n')

    const hint = `\n`
    + `\n_1️⃣ Escribe *1* para seleccionar tu numero actual_`
    + `\n_2️⃣ Escribe *2* para elegir otro_`
    + Validator.getCancelHint()

    return await flowDynamic(message + hint)
})
.addAction({capture: true}, async (ctx, { state, flowDynamic, gotoFlow, fallBack, endFlow }) => {
    try {
        if (!Validator.isAgree(ctx.body)) return gotoFlow(_provideManualContactNumber)

        const choosenNumber = ctx.from
        const choosenContactNumber = ctx.from
        state.update({ choosenNumber, choosenContactNumber })
    
        await flowDynamic(`Haz seleccionado el numero *${choosenContactNumber}* como numero de contacto.`)
        return gotoFlow(_provideFirstTimeNameFlow)
    }
    catch(e) {
        if (e instanceof ConversactionAbort) return endFlow(e.message)
        return fallBack(e.message)
    }
})

export const _provideManualContactNumber = addKeyword(EVENTS.ACTION)
.addAction(async (_, {flowDynamic}) => {
    const message = `*¿Cual es el numero de telefono que quieres utilizar como numero de contacto?*`
    
    const hint = `\n\n_❕ Escribe el numero de telefono que deseas utilizar como numero de contacto_`
    + Validator.getCancelHint()

    return await flowDynamic(message + hint)
})
.addAction({capture: true}, async (ctx, { flowDynamic, fallBack, state, gotoFlow, endFlow}) => {
    try {
        const choosenNumber = Validator.getNumber(ctx.body)
        state.update( { choosenNumber })

        await flowDynamic(`Haz seleccionado el numero *${choosenNumber}* como numero de contacto.`)
        return gotoFlow(_provideFirstTimeNameFlow)
    }
    catch(e) {
        if (e instanceof ConversactionAbort) return endFlow(e.message)
        return fallBack(e.message)
    }
})

//Provide name for first time flow
export const _provideFirstTimeNameFlow = addKeyword(EVENTS.ACTION)
.addAction(async (_, { flowDynamic }) => {
    const message = `*¿Cual es tu nombre?*`
    const hint = `\n\n_❕ Escribe tu nombre_`
    + Validator.getCancelHint()

    return await flowDynamic(message + hint)
})
.addAction({capture: true}, async (ctx, { flowDynamic, state, gotoFlow, fallBack, endFlow}) => {
    try {
        const choosenName = ctx.body
        state.update({ choosenName })
        await flowDynamic(`Haz establecido tu nombre como: *${choosenName}*`)
    
        return gotoFlow(_provideFirstTimeCountry)
    }
    catch (e) {
        if (e instanceof ConversactionAbort) return endFlow(e.message)
        return fallBack(e.message)
    }
})

//Provide country for first time
export const _provideFirstTimeCountry = addKeyword(EVENTS.ACTION)
.addAction(async (_, { flowDynamic }) => {
    const message = `*¿A que pais perteneces?*`
    const hint = `\n\n_❕ Escribe el pais de donde eres_`
    + Validator.getCancelHint()

    return await flowDynamic(message + hint)
})
.addAction({ capture: true}, async (ctx, { state, gotoFlow, flowDynamic, fallBack, endFlow}) => {
    try {
        const choosenCountry = ctx.body
        state.update({ choosenCountry })
        await flowDynamic(`Haz establecido tu pais como: *${choosenCountry}*`)

        return await gotoFlow(_provideFirstTimeCountryStateFlow)
    }
    catch (e) {
        if (e instanceof ConversactionAbort) {
            return endFlow(e.message)
        }
        return fallBack(e.message)
    }
})


//Provide country state for first time
export const _provideFirstTimeCountryStateFlow = addKeyword(EVENTS.ACTION)
.addAction(async (_, { flowDynamic }) => {
    const message = `*¿A que estado o ciudad perteneces?*`
    const hint = `\n\n_❕ Escribe el estado o ciudad al que perteneces en tu pais_`
    + Validator.getCancelHint()

    return await flowDynamic(message + hint)
})
.addAction({capture: true}, async (ctx, { flowDynamic, state, gotoFlow, fallBack, endFlow }) => {
    try {
        const choosenState = ctx.body
        state.update({ choosenState })
        await flowDynamic(`Haz establecido tu estado como: *${choosenState}*`)
    
        return gotoFlow(_confirmPersonalInformation)
    }
    catch(e) {
        if (e instanceof ConversactionAbort) return endFlow(e.message)
        return fallBack(e.message)
    }
})

export const _confirmPersonalInformation = addKeyword(EVENTS.ACTION)
.addAction(async (_, { flowDynamic, state }) => {
    const currentState = <UserData>state.getMyState()
    
    const message = `*✏️ Verifica la información ingresada*`
    + '\n'
    + `\nNombre: *${currentState.choosenName}*`
    + `\nPais: *${currentState.choosenCountry}*`
    + `\nEstado: *${currentState.choosenState}*`
    + `\nNumero de contacto: *${currentState.choosenContactNumber}*`
    + "\n\n"
    + "¿Estos datos son correctos?"
    + '\n\n'
    + ['Si', 'No'].map((option, index) => `*${index+1}*. ${option}`).join('\n')

    const hint = "\n"
    + "\n*Opciones:*\n"
    + "\n_1️⃣ Escribe 1 para confirmar los datos._"
    + "\n_2️⃣ Escribe 2 para corregirlos._"
    + Validator.getCancelHint()

    return await flowDynamic(message+hint)
})
.addAction({capture: true}, async (ctx, { flowDynamic, fallBack, gotoFlow, state, endFlow }) => {
    try {
        if (!Validator.isAgree(ctx.body)) {
            flowDynamic('Entiendo, te pedire tu informacion nuevamente.')
            return gotoFlow(_provideFirstTimeNumberFlow)
        }
        await flowDynamic('Gracias por confirmar tu informacion personal.')

        const currentState = state.getMyState()

        let customer: Customer | null = null

        if (!currentState.customer) {
            const payload: CreateCustomerPayload = {
                name: currentState.choosenName,
                number: currentState.choosenNumber,
                contactNumber: currentState.choosenContactNumber,
                country: currentState.choosenCountry,
                state: currentState.choosenState,
                role: 'customer'
            }
            customer = await CustomerAPI.create(payload)
        }
        else {
            const payload: UpdateCustomerPayload = {
                id: currentState.customer.id,
                name: currentState.choosenName,
                number: currentState.choosenNumber,
                contactNumber: currentState.choosenContactNumber,
                country: currentState.choosenCountry,
                state: currentState.choosenState,
            }

            customer = await CustomerAPI.update(payload)
        }

        state.update( { customer })
        return gotoFlow(_resumenFlow)

    }catch(e) {
        if (e instanceof ConversactionAbort) return endFlow(e.message)
        return fallBack(e.message)
    }
})

// Resumen information
export const _resumenFlow = addKeyword(EVENTS.ACTION)
.addAction(async (_, { flowDynamic, state }) => {
    const currentState = <UserData>state.getMyState()

    const message = `*¿Desea proceder con su compra?* 🛒`
    + `\n\n`
    //+ `Nombre: *${currentState.choosenName}*\n`
    //+ `Estado: *${currentState.choosenCountryState}*\n`
    //+ `Numero de contacto: *${currentState.choosenNumber}*\n`
    + `Sorteo: *${currentState.choosenRaffle.name}*`
    + `\n`
    + `Cantidad de boletos: *${currentState.choosenTicketAmount}*`
    + `\n\n`
    + `Numero de boletos: \n_*${currentState.choosenTickets.join(" ")}*_`
    + `\n\n`
    + `Total: *${currentState.choosenRaffle.pricePeerTicket * currentState.choosenTicketAmount} USD*`
    + `\n\n`
    + ['Si', 'No'].map((option, index) => `*${index+1}*. ${option}`).join('\n')

    const hint = "\n"
    + "\n*Opciones:*\n"
    + "\n1️⃣ Escribe *1* para proceder con la compra"
    + "\n2️⃣ Escribe *2* para cancelar la compra"

    return await flowDynamic(message + hint)
})
.addAction({capture: true}, async (ctx, {flowDynamic, state, fallBack, endFlow}) => {
    try {
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
    }
    catch(e) {
        if (e instanceof ConversactionAbort) return endFlow(e.message)
        return fallBack(e.message)
    }
    
})

export const _orderCompletedFlow = addKeyword(utils.setEvent('ORDER_COMPLETED'))
.addAction(async (ctx, { flowDynamic, gotoFlow }) => {
    try {
        const task = <Task>ctx.task

        for (let i=0; i<=task.subTasks.length-1; i++) {
            const subTask = task.subTasks[i]
    
            if (subTask.status != TaskStatus.PENDING) continue 
    
            if (i == 0) {
                await flowDynamic("Tu pago ha sido completado exitosamente. En breve recibiras tus boletos.")
            }
    
            const ticket = await TicketAPI.get(subTask.ticketId)
            const caption = `Boleto: *${ticket.serial}*`
            const buffer = await TicketAPI.getReceiptBuffer(ticket.id)
            const filePath = path.join(process.cwd(), 'temp.png')
            writeFileSync(filePath, <any>buffer)
    
            await flowDynamic([{
                body: caption,
                media: filePath
            }])

            subTask.status = TaskStatus.COMPLETED

            const payload: UpdateSubTaskPayload = {
                id: subTask.id,
                status: subTask.status
            }

            await SubTaskAPI.update(payload)

            console.log('Subtask completed successfully.')
        }

        const isTaskCompleted = task.subTasks.length > 0 &&
        task.subTasks.every(sub => sub.status === TaskStatus.COMPLETED);

        if (isTaskCompleted) {
            const payload: UpdateTaskPayload = {
                id: task.id,
                status: TaskStatus.COMPLETED,
            }
            await TaskAPI.update(payload)

            console.log('Task completed successfully.')
        }

        return gotoFlow(_addGroupFlow)
    }
    catch (e) {
        console.log(`Something went wrong while trying to complete a task. ${String(e)}`)
    }
})

export const _addGroupFlow = addKeyword(EVENTS.ACTION)
.addAction(async (ctx, { state, provider, flowDynamic }) => {
    try {
        const raffleId = state.get('raffleId')
        const raffle = await RaffleAPI.getById(raffleId)
        const sock = (provider as BaileysProvider).vendor
        const jid = `${ctx.from}@s.whatsapp.net`;
        const userMessage = `Unete al grupo para mantenerte al tanto de los resultados de este sorteo:`
        
        let groupId = raffle.whatsAppGroupId

        if (groupId) {
            try {
                await sock.groupMetadata(groupId)
            }
            catch(e) {
                groupId = null
            }
        }

        if (!groupId) {
            const subject = `Sorteo: ${raffle.name}`; 
            const participants = [jid];
    
            groupId = (await sock.groupCreate(subject, participants)).id
            await sock.groupSettingUpdate(groupId, 'locked');
            await sock.groupSettingUpdate(groupId, 'announcement');

            const data: UpdateRafflePayload = {
                id: raffle.id,
                whatsAppGroupId: groupId
            }

            await RaffleAPI.update(data)

            const groupMessage = `*Bienvenidos!*`
            + `\n\nPor medio de este grupo recibiran los resultados del sorteo: *${raffle.name}*`
            + `\n\nBuena suerte a todos! ☺️`

            await (provider as BaileysProvider).sendText(groupId, groupMessage)
        }

        await sock.groupParticipantsUpdate(groupId, [jid], 'add')
                
        const inviteCode = await sock.groupInviteCode(groupId);
        const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

        return await flowDynamic([userMessage, inviteLink])
    }
    catch(e){
        console.log(`Error while adding customer to WhatsApp group ${e.error}`)
    }
})