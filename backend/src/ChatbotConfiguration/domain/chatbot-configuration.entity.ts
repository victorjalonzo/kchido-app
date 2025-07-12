interface ChatbotConfigurationProps {
    id: string
    isOn: boolean
    whatsAppGroupId?: string | null
}

export class ChatbotConfiguration {
    id: string
    isOn: boolean
    whatsAppGroupId?: string | null

    constructor (props: ChatbotConfigurationProps) {
        this.id = props.id
        this.isOn = props.isOn
        this.whatsAppGroupId = props.whatsAppGroupId
    }
}