import { addKeyword, utils } from "@builderbot/bot"
import { Config } from "../shared/config.js"
import { WhatsAppGroupIdNotFound } from "../util/exceptions.js"
import { RaffleAPI } from "../util/raffle.api.js"
import { TaskAPI } from "../util/task.api.js"
import { Task, TaskStatus, UpdateTaskPayload } from "../util/tasks.type.js"
import { WhatsAppGroupSock } from "../util/whatsApp-group.js"

const PAGE_URL = Config.pageURL

export const raffleEndedFlow = addKeyword(utils.setEvent('RAFFLE_ENDED'))
.addAction(async (ctx, { provider }) => {
    const task = <Task>ctx.task
    const whatsAppGroupSock = new WhatsAppGroupSock(provider.vendor)
    const raffle = await RaffleAPI.getById(task.raffleId)
    const whatsAppGroupId = raffle.whatsAppGroupId
    
    try {
        if (!whatsAppGroupId) {
            console.log(`Raffle: ${raffle.name} (${raffle.id}) has no WhatsApp group ID attached.`)
            throw new WhatsAppGroupIdNotFound()
        }

        await whatsAppGroupSock.get(whatsAppGroupId)

        const message = `🎉 *¡El sorteo "${raffle.name}" ha finalizado!* 🎉
        
        Gracias a todos por participar. 🥳
        
        📌 Ya puedes consultar los *números ganadores* directamente en nuestro sitio web:
        
        🔗 ${PAGE_URL}/${raffle.id}
        
        ¡Buena suerte! 🍀`

        await whatsAppGroupSock.sendMessage(whatsAppGroupId, message)

        console.log('Raffle ended notification sent, task completed successfully.')
    }
    catch (e) {
        console.log(`Something went wrong while trying to notify ended of raffle: ${raffle.name} (${raffle.id}) in WhatsApp group. Error: ${e}`);
        return;
    }

    const payload: UpdateTaskPayload = {
        id: task.id,
        status: TaskStatus.COMPLETED,
    }

    await TaskAPI.update(payload)
})