import { fetchAPI } from "./api.js"
import { ChatbotConfiguration } from "./chatbot-configuration.type.js"

const endpoint = '/chatbot-configuration'

export class ChatbotConfigurationAPI {
    static get = async (): Promise<ChatbotConfiguration> => {
        return await fetchAPI(endpoint)
    }

    static update = async (payload: { whatsAppGroupId: string }): Promise<ChatbotConfiguration> => {
        return await fetchAPI(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(payload)
        })
    }
}