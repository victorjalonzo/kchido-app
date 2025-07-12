import { ChatbotConfigurationService } from "src/ChatbotConfiguration/application/chatbot-configuration.service"
import { createChatbotConfigurationTestModule } from "./create-chatbot-configuration-test-module"
import { ChatbotConfiguration } from "src/ChatbotConfiguration/domain/chatbot-configuration.entity"

describe('Chatbot configuration service: update', () => {
    let service: ChatbotConfigurationService

    beforeAll(async () => {
        const module = await createChatbotConfigurationTestModule()
        service = module.get(ChatbotConfigurationService)
    })

    it('should retrieve a record', async () => {
        const record = await service.find()
        expect(record).toBeInstanceOf(ChatbotConfiguration)
    })
})