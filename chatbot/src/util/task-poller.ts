import { Config } from "../shared/config.js"
import { TaskAPI } from "./task.api.js"
import { TaskStatus } from "./tasks.type.js"

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const webhookURL = `${Config.appBaseURL}/webhook`

console.log(`URL: ${webhookURL}`)

export class TaskPoller {
    static start = async () => {
        console.log('Starting polling...')
        while (true) {
            await sleep(5000)
    
            try {
                console.log('polling tasks...')
                
                const tasks = await TaskAPI.getAll({ 
                    status: TaskStatus.PENDING,
                    'sub-tasks': true
                })
                console.log(`${tasks.length} tasks polled...`)
    
                for (const task of tasks) {
                    const response = await fetch(webhookURL, {
                        method: 'POST',
                        body: JSON.stringify(task),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })

                    console.log(response.status)
                    console.log(`Event triggered from task: ${task.id}`)
                    await sleep(20000)
                }
            }
            catch(e) {
                console.log('Something went wrong while polling', String(e))
            }
        }
    }
}