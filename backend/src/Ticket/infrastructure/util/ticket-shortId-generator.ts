import { ShortIdGenerator } from "src/Shared/util/shortid-generator"

export class TicketShortIdGenerator {
    static generate = () => {
        return `TIC-${ShortIdGenerator.generate()}`
    }
}