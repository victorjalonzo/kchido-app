import { addKeyword, EVENTS } from "@builderbot/bot"
import { ChatbotConfigurationAPI } from "../util/chatbot-configuration.api.js"
import { WhatsAppGroupSock } from "../util/whatsApp-group.js"

export const addGroupFlow = addKeyword(EVENTS.ACTION)
.addAction({}, async (ctx, { provider, flowDynamic }) => {
    try {
        const whatsAppGroupSock = new WhatsAppGroupSock(provider.vendor)
        //const jid = `${ctx.from}@s.whatsapp.net`;
        const jid = `18092163465@s.whatsapp.net`;
        
        let { whatsAppGroupId: waGroupId } = await ChatbotConfigurationAPI.get()

        if (waGroupId) {
            try {
                const isParticipant = await whatsAppGroupSock.isParticipant(waGroupId, jid)
                if (!isParticipant) await whatsAppGroupSock.addParticipants(waGroupId, [jid])
            }
            catch(e) {
                waGroupId = null
            }
        }

        if (!waGroupId) {
            const waGroup = await whatsAppGroupSock.create([jid])
            const data = { whatsAppGroupId: waGroup.id }

            await ChatbotConfigurationAPI.update(data)

            waGroupId = waGroup.id
        }
                
        const inviteLink = await whatsAppGroupSock.getInviteLink(waGroupId)

        const message = `Unete al grupo para mantenerte al tanto de los resultados de nuestros sorteos:`
        return await flowDynamic([message, inviteLink])
    }
    catch(e){
        console.log(`Error while adding customer to WhatsApp group ${e.error}`)
    }
})