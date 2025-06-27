import { Injectable } from "@nestjs/common";
import { Task } from "../domain/task.entity";
import { SharedConfig } from "src/Shared/shared.config";

const CHATBOT_WEBHOOK_URL = `${SharedConfig.chatbotServerUrl}/webhook`

@Injectable()
export class TaskDispatcher {
    dispatchToChatbot = async (task: Task): Promise<void> => {
        const response = await fetch(CHATBOT_WEBHOOK_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(task)
        })

        console.log(response)
    } 
}