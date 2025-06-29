import { ShortIdGenerator } from "src/Shared/util/shortid-generator"

export class OrderShortIdGenerator {
    static generate = () => {
        return `ORD-${ShortIdGenerator.generate()}`
    }
}

