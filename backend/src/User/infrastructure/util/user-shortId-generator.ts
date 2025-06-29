import { ShortIdGenerator } from "src/Shared/util/shortid-generator"
import { UserType } from "src/User/domain/user.entity"

export class UserShortIdGenerator {
    static generate = (userType: UserType) => {
        if (userType == UserType.CUSTOMER) {
            return `CUS-${ShortIdGenerator.generate()}`
        }

        return `USR-${ShortIdGenerator.generate()}`
    }
}