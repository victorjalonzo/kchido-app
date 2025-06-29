import * as path from 'path'
import { ImageUploader } from 'src/Shared/util/image-uploader'

export class RaffleImageUploader {
    static save = (raffleId: string, base64String: string) => {
        const filename = 'image'
        const filePath = path.join(process.cwd(), 'uploads', 'raffles', raffleId, filename)
        
        return ImageUploader.save(base64String, filePath)
    }
}