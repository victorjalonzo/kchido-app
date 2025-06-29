import { customAlphabet } from 'nanoid'

export class ShortIdGenerator {
    static generate = () => {
        const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
        const nanoid = customAlphabet(alphabet, 6)

        const now = new Date()
        const yyyy = now.getFullYear()
        const mm = String(now.getMonth() + 1).padStart(2, '0')
        const dd = String(now.getDate()).padStart(2, '0')
        const datePart = `${yyyy}${mm}${dd}`
        const randomPart = nanoid()

        return `${datePart}-${randomPart}`
    }
}