import { config } from "dotenv"

config()

export class SharedConfig {
    static get serverPort(): number | string{
        return process.env.PORT ?? 3000
    }

    static get apiURL(): string {
        const schema = process.env.SCHEMA
        const host = process.env.HOST
        const port = process.env.PORT ?? 3000
        const api = process.env.API

        return host == 'localhost'
        ? `${schema}://${host}:${port}/${api}`
        : `${schema}://${host}/${api}`
    }

    static get databaseURL(): string{
        return <string>process.env.DATABASE_URL
    }

    static get jwtSecret(): string{
        return <string>process.env.JWT_SECRET
    }

    static get jwtExpiresIn(): string {
        return <string>process.env.JWT_EXPIRES_IN
    }

    static get chatbotServerUrl() {
        const chatbotServerUrl = process.env.CHATBOT_SERVER_URL
        if (!chatbotServerUrl) throw new Error('Missing CHATBOT_SERVER_URL environment variable')
        return chatbotServerUrl
    }
}