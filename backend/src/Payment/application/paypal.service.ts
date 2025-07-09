import { Injectable } from "@nestjs/common"
import { sharedConfig } from "src/Shared/shared.config"

@Injectable()
export class PaypalService {
    getAccessToken = async (clientId: string, clientSecret: string) => {
        const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
        const url = sharedConfig.paypalAuthURL

        const response = await fetch(url, {
            method: "POST",
            headers: {
              Authorization: `Basic ${basicAuth}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "grant_type=client_credentials",
        })

        const data = await response.json()
        if (!response.ok) {
            throw Error(`Error ${response.status}: ${data.message}`)
        }
        
        return data.access_token
    }

    createWebhook = async (accessToken: string) => {
        const appWebhookURL = sharedConfig.appWebhookURL
        const url = sharedConfig.paypalWebhookURL
        
        const payload = {
            url: appWebhookURL,
            event_types: [
              { name: "CHECKOUT.ORDER.APPROVED" },
              { name: "PAYMENT.CAPTURE.COMPLETED" },
            ],
          }

        const response = await fetch(url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })

        const data = await response.json()
        if (!response.ok) {
            throw Error(`Error ${response.status}: ${data.message}`)
        }
        
        return data
    }

    getWebhooks = async (accessToken: string, webhookId?: string) => {
        const url = sharedConfig.paypalWebhookURL
        + (webhookId ? `/${webhookId}` : "")

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json()
        if (!response.ok) {
            throw Error(`Error ${response.status}: ${data.message}`)
        }
        
        return data.webhooks
    }

    deleteWebhook = async (accessToken: string, webhookId: string) => {
        const url = `${sharedConfig.paypalWebhookURL}/${webhookId}`

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
        
        if (!response.ok) {
            const data = await response.json()
            throw Error(`Error ${response.status}: ${data.message}`)
        }

        return true;
    }
}