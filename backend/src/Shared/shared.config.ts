import { config } from "dotenv"

config()

enum AppMode {
    PRODUCTION = 'production',
    TEST = 'test'
}

class SharedConfig {
    appMode: AppMode
    appSchema: string
    appHost: string
    appPort: number
    private readonly appWebhook: string
    private readonly appApi: string
    private readonly _databaseURL: string
    private readonly _jwtSecret: string
    private readonly _jwtExpiresIn: string
    private readonly _chatbotServerURL: string
    private readonly paypalAuthLiveURL: string
    private readonly paypalWebhookLiveURL: string
    private readonly paypalAuthTestURL: string 
    private readonly paypalWebhookTestURL: string 

    constructor () {
        this.appMode = <AppMode>this._getEnv('APP_MODE')
        this.appSchema = this._getEnv('APP_SCHEMA')
        this.appHost = this._getEnv('APP_HOST')
        this.appPort = Number(this._getEnv('APP_PORT', '3000'))
        this.appApi = this._getEnv('APP_API')
        this.appWebhook = this._getEnv('APP_WEBHOOK')

        this._jwtSecret = this._getEnv('JWT_SECRET')
        this._jwtExpiresIn = this._getEnv('JWT_EXPIRES_IN')

        this._databaseURL = this._getEnv('DATABASE_URL')

        this._chatbotServerURL = this._getEnv('CHATBOT_SERVER_URL')

        this.paypalAuthLiveURL = this._getEnv('PAYPAL_LIVE_AUTH_URL')
        this.paypalWebhookLiveURL = this._getEnv('PAYPAL_LIVE_WEBHOOK_URL')
        this.paypalAuthTestURL = this._getEnv('PAYPAL_TEST_AUTH_URL')
        this.paypalWebhookTestURL = this._getEnv('PAYPAL_TEST_WEBHOOK_URL')
    }

    get appURL(): string {
       return this.appMode == AppMode.PRODUCTION || this.appHost.toLowerCase() != 'localhost'
       ? `${this.appSchema}://${this.appHost}`
       : `${this.appSchema}://${this.appHost}: ${this.appPort}`
    }

    get appApiURL(): string {
        return `${this.appURL}/${this.appApi}`
    }

    get appWebhookURL(): string {
        return `${this.appApiURL}/${this.appWebhook}`
    }

    get databaseURL(): string{
        return this._databaseURL
    }

    get jwtSecret(): string{
        return this._jwtSecret
    }

    get jwtExpiresIn(): string {
        return this._jwtExpiresIn
    }

    get chatbotServerURL() {
        return this._chatbotServerURL
    }

    get paypalWebhookURL() {
        return this.appMode == AppMode.PRODUCTION
        ? this.paypalWebhookLiveURL
        : this.paypalWebhookTestURL
    }

    get paypalAuthURL() {
        return this.appMode == AppMode.PRODUCTION
        ? this.paypalAuthLiveURL
        : this.paypalAuthTestURL
    }

    _getEnv(variableName: string, defaultValue?: string): string {
        let value = process.env[variableName]
        if (!value) {
            if (!defaultValue) throw Error(`Missing ${variableName} variable environment`)
            return defaultValue
        }

        return value;
    }
}

export const sharedConfig = new SharedConfig()