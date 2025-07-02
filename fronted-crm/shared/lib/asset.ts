import { Config } from "../config"

const endpoint = `${Config.apiURL}/static`

export class Asset {
    static get defaultProfileImage(){
        return `${endpoint}/default-profile-image.jpg`
    }

    static get defaultRaffleImage(){
        return `${endpoint}/default-raffle-image.png`
    }
}