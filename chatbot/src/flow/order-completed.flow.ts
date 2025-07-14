import { addKeyword, utils } from "@builderbot/bot"
import { writeFileSync } from "fs"
import * as path from "path"
import { SubTaskAPI } from "../util/subTask.api.js"
import { TaskAPI } from "../util/task.api.js"
import { Task, TaskStatus, UpdateSubTaskPayload, UpdateTaskPayload } from "../util/tasks.type.js"
import { TicketAPI } from "../util/ticket.api.js"
import { addGroupFlow } from "./add-group.flow.js"

export const orderCompletedFlow = addKeyword(utils.setEvent('ORDER_COMPLETED'))
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

            console.log('All tickets were sent, task completed successfully.')
        }

        return gotoFlow(addGroupFlow)
    }
    catch (e) {
        console.log(`Something went wrong while trying to complete a task. ${String(e)}`)
    }
})