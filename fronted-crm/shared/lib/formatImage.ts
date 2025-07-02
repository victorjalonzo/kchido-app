import { Config } from "../config"

const SERVER_URL = Config.serverURL

export const ImageFormat = (ImageUrl: string) => {
    //return `${SERVER_URL}/${ImageUrl}`
    return ImageUrl
}