import { ShortIdGenerator } from "src/Shared/util/shortid-generator"

export class RaffleShortIdGenerator {
    static generate = () => {
        return `RAF-${ShortIdGenerator.generate()}`
    }
}