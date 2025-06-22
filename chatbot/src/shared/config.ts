import dotenv from 'dotenv'

dotenv.config()

export class Config {
    static get appPort(): number{
        return Number(process.env.PORT ?? 3000)
    }

    static get serverURL(): string {
        const serverURL = process.env.SERVER_URL
        if (!serverURL) throw Error('Missing SERVER_URL environment variable')
        return serverURL
    }

    static get pageURL(): string {
        const pageURL = process.env.PAGE_URL
        if (!pageURL) throw Error('Missing PAGE_URL environment variable')
        return pageURL
    }

    static get apiURL(): string {
        const serverURL = Config.serverURL
        const apiPrefix = process.env.API_PREFIX

        if (!apiPrefix) throw Error('Missing API PREFIX environment variable')
        
        return `${serverURL}/${apiPrefix}`
    }

    static get email(): string {
        const email = process.env.BOT_EMAIL
        if (!email) throw Error('Missing EMAIL environment variable')
        return email;
    }

    static get password(): string {
        const password = process.env.BOT_PASSWORD
        if (!password) throw Error('Missing PASSWORD environment variable')
        return password;
    }
}