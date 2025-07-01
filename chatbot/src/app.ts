import { createBot, createProvider, createFlow } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { entryFlow } from './flow/entry.flow.js'
import { menuFlow } from './flow/menu.flow.js'
import { 
    buyTicketFlow, 
    _chooseRaffleFlow,
    _chooseTicketAmountFlow,
    _chooseTicketTypeFlow,
    _chooseManualTicketFlow,
    _chooseGeneratedTicketFlow,
    _confirmChoosenTickets,
    _provideFirstTimeCountryStateFlow,
    _provideFirstTimeNameFlow,
    _provideFirstTimeNumberFlow,
    _provideManualContactNumber,
    _providePersonalInformation,
    _confirmPersonalInformation,
    _resumenFlow,
    _orderCompletedFlow

} from './flow/buy-ticket.flow.js'
import { Task } from './util/tasks.type.js'
import { OrderAPI } from './util/order.api.js'
import { TaskPoller } from './util/task-poller.js'
import { faqFlow } from './flow/faq.flow.js'

const PORT = process.env.PORT ?? 3008

const main = async () => {
    const adapterFlow = createFlow([
        entryFlow, 
        menuFlow, 
        buyTicketFlow, 
        _chooseRaffleFlow,
        _chooseTicketAmountFlow,
        _chooseTicketTypeFlow,
        _chooseGeneratedTicketFlow,
        _chooseManualTicketFlow,
        _confirmChoosenTickets,
        _providePersonalInformation,
        _provideFirstTimeCountryStateFlow,
        _provideFirstTimeNameFlow,
        _provideFirstTimeNumberFlow,
        _confirmPersonalInformation,
        _resumenFlow,
        _orderCompletedFlow,
        faqFlow
    ])
    
    const adapterProvider = createProvider(Provider, {
        writeMyself: 'host'
    })
    const adapterDB = new Database()

    const chatbot = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    const { handleCtx, httpServer } = chatbot

    adapterProvider.server.post(
        '/webhook',
        handleCtx(async (bot, req, res) => {
            try {
                const task = <Task>req.body
                const order = await OrderAPI.get(task.orderId, { user: true })
                const customer = order.user

                await bot.dispatch('ORDER_COMPLETED', {
                    from: customer.number, 
                    name: customer.name,
                    task: task
                })

                res.writeHead(200, { 'Content-Type': 'application/json' })
                return res.end(JSON.stringify({ status: 'ok' }))
            }
            catch(e) {
                console.log(e)
            }
        })
    )
    

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

    TaskPoller.start()

    httpServer(+PORT)
}

main()
