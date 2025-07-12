import { ChatbotConfigurationService } from "src/ChatbotConfiguration/application/chatbot-configuration.service"
import { createChatbotConfigurationTestModule } from "./create-chatbot-configuration-test-module"
import { UpdateChatbotConfigurationDto } from "src/ChatbotConfiguration/application/create-chatbot-configuration.dto"
import { ChatbotConfiguration } from "src/ChatbotConfiguration/domain/chatbot-configuration.entity"

describe('Chatbot configuration service: update', () => {
    let service: ChatbotConfigurationService

    beforeAll(async () => {
        const module = await createChatbotConfigurationTestModule()
        service = module.get(ChatbotConfigurationService)
    })

    it('should update a record', async () => {
        const dto: UpdateChatbotConfigurationDto = {
            whatsAppGroupId: "12345"
        }

        const record = await service.update(dto)
        expect(record).toBeInstanceOf(ChatbotConfiguration)
    })
})