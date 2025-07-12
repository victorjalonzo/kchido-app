import { Module } from "@nestjs/common";
import { SharedModule } from "src/Shared/shared.module";
import { ChatbotConfigurationService } from "../application/chatbot-configuration.service";
import { ChatbotConfigurationController } from "./chatbot-configuration.controller";

@Module({
    imports: [SharedModule],
    providers: [ChatbotConfigurationService],
    controllers: [ChatbotConfigurationController]
})
export class ChatbotConfigurationModule {}