import { Test } from "@nestjs/testing"
import { ChatbotConfigurationService } from "src/ChatbotConfiguration/application/chatbot-configuration.service"
import { SharedModule } from "src/Shared/shared.module"
import { ChatbotConfigurationController } from "../chatbot-configuration.controller"

export const createChatbotConfigurationTestModule = async () => {
    return await Test.createTestingModule({
        imports: [SharedModule],
        providers: [ChatbotConfigurationService],
        controllers: [ChatbotConfigurationController]
    })
    .compile()
}