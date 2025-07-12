import { Body, Controller, Get, Patch, UsePipes, ValidationPipe } from "@nestjs/common";
import { ChatbotConfigurationService } from "../application/chatbot-configuration.service";
import { UpdateChatbotConfigurationDto } from "../application/create-chatbot-configuration.dto";

@Controller('api/v1/chatbot-configuration')
export class ChatbotConfigurationController {
    constructor(private readonly service: ChatbotConfigurationService) {}

    @Get()
    async find(){
        return await this.service.find()
    }

    @Patch()
    @UsePipes(new ValidationPipe())
    async update(@Body() dto: UpdateChatbotConfigurationDto){
        return await this.service.update(dto)
    }
}