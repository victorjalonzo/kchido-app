import * as path from 'path'
import { ImageUploader } from 'src/Shared/util/image-uploader'

export class UserImageUploader {
    static save = (userId: string, base64String: string) => {
        const filename = 'profile'
        const filePath = path.join(process.cwd(), 'uploads', 'users', userId, filename)
        
        return ImageUploader.save(base64String, filePath)
    }
}