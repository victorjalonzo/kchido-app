import { Injectable } from "@nestjs/common";
import { ChatbotConfigurations as PrismaChatbotConfiguration } from "@prisma/client";
import { SharedRepository } from "src/Shared/shared.repository";
import { Model } from "src/Shared/shared.types";
import { UpdateChatbotConfigurationDto } from "./create-chatbot-configuration.dto";
import { ChatbotConfigurationMapper } from "../infrastructure/chatbot-configuration.mapper";

@Injectable()
export class ChatbotConfigurationService {
    private readonly model: Model = Model.CHATBOT_CONFIGURATION

    constructor (
        private readonly repository: SharedRepository<PrismaChatbotConfiguration>
    ) {}
    
    find = async () => {
        return await this.repository.findOne(this.model)
        .then(async record => record ? record : await this._create())
        .then(record => ChatbotConfigurationMapper.toDomain(record))
    }

    update = async (dto: UpdateChatbotConfigurationDto) => {
        return await this.repository.update(this.model, dto, {id: 'config'})
        .then((record: PrismaChatbotConfiguration) => 
            ChatbotConfigurationMapper.toDomain(record)
        )
    }

    _create = async () => {
        const data =  { isOn: true }
        return await this.repository.create(this.model, data)
    }
}