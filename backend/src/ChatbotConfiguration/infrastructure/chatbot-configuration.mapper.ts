import { ChatbotConfigurations as PrismaChatbotConfiguration } from "@prisma/client";
import { ChatbotConfiguration } from "../domain/chatbot-configuration.entity";

export class ChatbotConfigurationMapper {
    static toDomain(raw: PrismaChatbotConfiguration){
        return new ChatbotConfiguration(raw)
    }
}