import { addKeyword, EVENTS } from "@builderbot/bot";
import { AuthAPI } from "../util/auth.api.js";
import { menuFlow } from "./menu.flow.js";
import { CustomerAPI } from "../util/customer.api.js";
import { Asset } from "../util/asset.js";

export const entryFlow = addKeyword(EVENTS.WELCOME)
.addAction(async (ctx, {endFlow, state}) => {
    try {
        const chatbotUser = await AuthAPI.getMe()

        const customers = await CustomerAPI.getAll({
            role: 'customer',
            number: ctx.from
        })
    
        const customer = customers[0]
    
        if (customer) {
            if (customer.status == 'banned') {
                return endFlow()
            }
    
            state.update( { customer })
        }
    }
    catch(e) {
        console.log(`Something went wrong while trying to load configuration from entry point ${String(e)}`)
    }
})
.addAction(async (_, { flowDynamic, gotoFlow }) => {
    const message = {
        body: '*Bienvenido a KChido* ☺️',
        media: Asset.getBanner()
    }

    await flowDynamic([ message ])

    return gotoFlow(menuFlow)
})