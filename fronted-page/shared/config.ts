import dotenv from 'dotenv'

dotenv.config()

export class Config {
    static get appPort(): number{
        return Number(process.env.PORT ?? 3000)
    }

    static get serverURL(): string {
        if (!process.env.NEXT_PUBLIC_SERVER_URL) throw Error('Missing SERVER_URL environment variable')
        return process.env.NEXT_PUBLIC_SERVER_URL
    }

    static get apiURL(): string {
        const serverURL = Config.serverURL
        const apiPrefix = process.env.NEXT_PUBLIC_API_PREFIX

        if (!apiPrefix) throw Error('Missing API PREFIX environment variable')
        
        return `${serverURL}/${apiPrefix}`
    }

    static get paypalClientId(): string {
        if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) throw Error('Missing PAYPAY CLIENT ID environment variable')
        return process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    }
}